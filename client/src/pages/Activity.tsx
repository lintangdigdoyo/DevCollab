import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { setColor, setRem } from '../styles';
import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import Paper from '../components/global/Paper';
import { RoundedButton } from '../components/global/Button';
import SendIcon from '@material-ui/icons/Send';
import socket from '../utils/socketio';
import { AuthInitialState } from '../reducers/authReducer';
import { removeNotification } from '../actions/activityActions';
import { ActivityInitialState } from '../reducers/activityReducer';
import ActivityContent from '../components/activity/ActivityContent';

interface ActivityProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  removeNotification: (projectId: string) => Promise<void>;
  project: ProjectInitialState;
  auth: AuthInitialState;
  activity: ActivityInitialState;
}

const Activity: React.FC<ActivityProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  removeNotification,
  project: { selectedProject, projectError },
  auth: { user },
  activity: { activity },
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Activity | DevCollab';
    setNavbar(SelectedType.Activity);

    !selectedProject && loadProject(projectId);
    projectError && history.push('/projects');

    return () => clearNavbar();
  }, [
    loadProject,
    projectId,
    selectedProject,
    projectError,
    setNavbar,
    clearNavbar,
    history,
  ]);

  const userNotif = activity?.notifications?.find(
    (notification) => notification.user === user?._id
  );

  useEffect(() => {
    if ((userNotif?.totalNotifications ?? 0) > 0) {
      removeNotification(projectId);
    }
  }, [projectId, removeNotification, activity, userNotif]);

  const [message, setMessage] = useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim().length > 0) {
      socket.emit('send activity message', {
        projectId,
        user,
        message,
        userId: user?._id,
      });
      setMessage('');
    }
  };

  //Handle the submit from the textarea
  const handleUserKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim().length > 0) {
        socket.emit('send activity message', {
          projectId,
          user,
          message,
          userId: user?._id,
        });
        setMessage('');
      }
    }
  };

  return (
    <Paper>
      <Container>
        <ActivityContent
          activity={activity}
          user={user}
          projectId={projectId}
        />

        <form onSubmit={handleSubmit}>
          <InputContainer>
            <TextArea
              placeholder='Write a message...'
              name='message'
              id='message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleUserKeyPress}
            />
            <RoundedButton size='45'>
              <SendIcon />
            </RoundedButton>
          </InputContainer>
        </form>
      </Container>
    </Paper>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  auth: state.auth,
  activity: state.activity,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  removeNotification: (projectId: string) =>
    dispatch(removeNotification(projectId)),
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid ${setColor.lightBlack};
  height: 55px;
  outline: none;
  padding: 15px;
  border-radius: 5px;
  resize: none;
  font-size: ${setRem(14)};
  &:focus {
    border-color: ${setColor.primary};
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
