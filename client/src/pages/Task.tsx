import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import styled from 'styled-components';
import { useParams, Redirect } from 'react-router-dom';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';

import { loadProject } from '../actions/projectActions';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import { Store } from '../store';
import { ProjectInitialState } from '../reducers/projectReducer';
import ColumnTasks from '../components/task/ColumnTasks';
import AddIcon from '@material-ui/icons/Add';
import { InitialTaskState } from '../components/task/taskTypes';
import { setColor } from '../styles';
import AddListMenu from '../components/task/AddListMenu';
import socket from '../utils/socketio';
import api from '../api';

interface TaskProps {
  setNavbar: (selected: SelectedType) => void;
  loadProject: (projectId: string) => Promise<void>;
  clearNavbar: () => void;
  project: ProjectInitialState;
}

const Task: React.FC<TaskProps> = ({
  setNavbar,
  clearNavbar,
  loadProject,
  project: { selectedProject, projectError },
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  useEffect(() => {
    document.title = 'Tasks | DevCollab';
    !selectedProject && loadProject(projectId);
    projectError && <Redirect to='/projects' />;

    setNavbar(SelectedType.Task);
    return () => clearNavbar();
  }, [
    setNavbar,
    clearNavbar,
    loadProject,
    projectError,
    projectId,
    selectedProject,
  ]);

  //State for the task
  const [taskState, setTaskState] = useState<InitialTaskState>({
    columnOrder: [],
    columns: {},
    tasks: {},
  });

  //Get project tasks
  useEffect(() => {
    (async () => {
      if (selectedProject) {
        const res = await api.get(`/tasks/${selectedProject._id}`);
        if (res.data) setTaskState(res.data);
      }
    })();
  }, [selectedProject]);

  //Socket connection
  useEffect(() => {
    //Join the project room
    socket.emit('join project', { projectId: selectedProject?._id });

    //Listen to updated task project
    socket.on('task update', (data: InitialTaskState) => {
      setTaskState(data);
    });

    return () => setTaskState({ tasks: {}, columns: {}, columnOrder: [] });
  }, [selectedProject, setTaskState]);

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId, source, type } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    //Move column
    if (type === 'column') {
      const newColumnOrder = [...taskState.columnOrder];
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      socket.emit('move column', {
        projectId: selectedProject?._id,
        columnOrder: newColumnOrder,
      });

      setTaskState({
        ...taskState,
        columnOrder: newColumnOrder,
      });
      return;
    }

    const start = taskState.columns[source.droppableId];
    const finish = taskState.columns[destination.droppableId];

    //Move task in the same column
    if (start === finish) {
      const newTaskIds = [...start.taskIds];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...taskState,
        columns: {
          ...taskState.columns,
          [newColumn.id]: newColumn,
        },
      };

      socket.emit('move task same column', {
        projectId: selectedProject?._id,
        newColumn,
      });
      setTaskState(newState);
      return;
    }

    //Move task to another column
    const startTaskIds = [...start.taskIds];
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = [...finish.taskIds];
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...taskState,
      columns: {
        ...taskState.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    socket.emit('move task another column', {
      projectId: selectedProject?._id,
      columnStart: newStart,
      columnFinish: newFinish,
    });
    setTaskState(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='all-columns' direction='horizontal' type='column'>
        {(provided) => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {taskState.columnOrder.map((columnId, index) => {
              const column = taskState.columns[columnId];
              return (
                <ColumnTasks
                  key={column.id}
                  column={column}
                  taskMap={taskState.tasks}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
            <AddListMenu>
              <AddIcon />
              New list
            </AddListMenu>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
});

const Container = styled.div`
  display: flex;
  white-space: nowrap;
  position: relative;
  overflow-x: auto;
  margin-top: 30px;
  width: 103%;
  height: 80%;
  background-color: ${setColor.mainGrey};
`;

export default connect(mapStateToProps, mapDispatchToProps)(Task);
