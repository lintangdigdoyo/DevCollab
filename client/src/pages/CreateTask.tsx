import React, { useEffect, useState } from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import socket from '../utils/socketio';
import { Store } from '../store';
import { clearNavbar, setNavbar } from '../actions/navbarAction';
import { loadProject } from '../actions/projectActions';
import { SelectedType } from '../actions/navbarTypes';
import { ProjectInitialState } from '../reducers/projectReducer';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';
import {
  DateContaiener,
  Form,
  InputContainer,
} from '../components/global/FormContainer';
import { Button } from '../components/global/Button';
import { TaskData } from '../actions/taskTypes';
import SelectMembers from '../components/global/SelectMembers';
import { AuthInitialState } from '../reducers/authReducer';
import { loadTaskState } from '../actions/taskActions';

interface CreateTaskProps {
  setNavbar: (selected: SelectedType) => void;
  loadProject: (projectId: string) => Promise<void>;
  clearNavbar: () => void;
  loadTaskState: (projectId: string) => Promise<void>;
  project: ProjectInitialState;
  auth: AuthInitialState;
}

const CreateTask: React.FC<CreateTaskProps> = ({
  setNavbar,
  clearNavbar,
  loadProject,
  loadTaskState,
  project: { selectedProject, projectError },
  auth: { user },
}) => {
  const { projectId, columnId } = useParams<{
    projectId: string;
    columnId: string;
  }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Create Task | DevCollab';
    !selectedProject && loadProject(projectId);
    projectError && history.push('/projects');

    setNavbar(SelectedType.Task);
    return () => clearNavbar();
  }, [
    setNavbar,
    history,
    clearNavbar,
    loadProject,
    projectError,
    projectId,
    selectedProject,
  ]);

  //Set form data
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    members: [],
    dueDate: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTaskData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit('create task', {
      projectId: selectedProject?._id,
      columnId,
      taskData,
    });

    history.push({
      pathname: `/projects/${selectedProject?._id}/tasks`,
      state: { fromCreateTask: true, createTaskProgress: true },
    });

    //Handle activity report
    if (taskData.title) {
      socket.emit('create activity task', {
        projectId,
        columnId,
        taskName: taskData.title,
        userName: `${user?.firstName} ${user?.lastName}`,
        userId: user?._id,
      });
    }

    //Load calendar task state
    loadTaskState(projectId);
  };

  return (
    <Paper>
      <Previous
        link={`/projects/${selectedProject?._id}/tasks`}
        previousTo='Tasks'
        title={taskData.title.trim() || 'Add Task'}
      />
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <label htmlFor='title'>
            Task Title <span>*</span>
          </label>
          <input
            required
            type='text'
            id='title'
            name='title'
            placeholder='Task title'
            onChange={handleChange}
            value={taskData.title}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor='description'>Description</label>
          <textarea
            rows={8}
            placeholder='Describe the task'
            id='description'
            name='description'
            onChange={handleChange}
            value={taskData.description}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor='members'>Members</label>
          <SelectMembers
            selectedProject={selectedProject}
            setData={setTaskData}
          />
        </InputContainer>
        <DateContaiener>
          <label htmlFor='dueDate'>Due Date</label>
          <input
            type='date'
            name='dueDate'
            id='dueDate'
            onChange={handleChange}
            value={taskData.dueDate}
          />
        </DateContaiener>
        <StyledButton extrasmall>Add Task</StyledButton>
        <StyledButton
          as={Link}
          to={`/projects/${selectedProject?._id}/tasks`}
          extrasmall={'extrasmall' && 1}
          outline={'outline' && 1}
        >
          Cancel
        </StyledButton>
      </Form>
    </Paper>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  clearNavbar: () => dispatch(clearNavbar()),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  loadTaskState: (projectId: string) => dispatch(loadTaskState(projectId)),
});

const StyledButton = styled(Button)`
  margin-top: 15px;
  margin-right: 10px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(CreateTask);
