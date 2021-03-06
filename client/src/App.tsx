import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { loadUser } from './actions/authActions';
import PrivateRoute from './components/routing/PrivateRoute';
import Route from './components/routing/PublicRoute';
import GlobalStyle from './components/global/GlobalStyle';
import BaseComponent from './components/global/BaseComponent';
import Landing from './pages/Landing';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Project from './pages/Project';
import CreateProject from './pages/CreateProject';
import UpdateProject from './pages/UpdateProject';
import NotFound from './pages/NotFound';
import UpdateUser from './pages/UpdateUser';
import Activity from './pages/Activity';
import Task from './pages/Task';
import CreateTask from './pages/CreateTask';
import DetailTask from './pages/DetailTask';
import Discussions from './pages/Discussions';
import CreateDiscussion from './pages/CreateDiscussion';
import Discussion from './pages/Discussion';
import UpdateDiscussion from './pages/UpdateDiscussion';
import MeetingRooms from './pages/MeetingRooms';
import CreateRoom from './pages/CreateRoom';
import MeetingRoom from './pages/MeetingRoom';
import UpdateMeeting from './pages/UpdateMeeting';
import Notes from './pages/Notes';
import CreateNote from './pages/CreateNote';
import UpdateNote from './pages/UpdateNote';
import Note from './pages/Note';
import Files from './pages/Files';
import CreateFile from './pages/CreateFile';
import UpdateFile from './pages/UpdateFile';
import GithubActivities from './pages/GithubActivities';
import GithubConnection from './pages/GithubConnection';

interface AppProps {
  loadUser: () => Promise<void>;
}

const App: React.FC<AppProps> = ({ loadUser }) => {
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Fragment>
      <GlobalStyle />
      <Router>
        <BaseComponent>
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/signin' component={Signin} />
            <PrivateRoute exact path='/user-settings' component={UpdateUser} />
            <PrivateRoute exact path='/projects' component={Project} />
            <PrivateRoute
              exact
              path='/create-project'
              component={CreateProject}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/edit'
              component={UpdateProject}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/activity'
              component={Activity}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/tasks'
              component={Task}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/create-task/:columnId'
              component={CreateTask}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/lists/:columnId/tasks/:taskId'
              component={DetailTask}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/discussions'
              component={Discussions}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/create-discussion'
              component={CreateDiscussion}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/discussions/:discussionId'
              component={Discussion}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/discussions/:discussionId/edit'
              component={UpdateDiscussion}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/meeting-rooms'
              component={MeetingRooms}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/meeting-rooms/:meetingId'
              component={MeetingRoom}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/create-room'
              component={CreateRoom}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/meeting-rooms/:meetingId/edit'
              component={UpdateMeeting}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/notes'
              component={Notes}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/create-note'
              component={CreateNote}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/notes/:noteId/edit'
              component={UpdateNote}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/notes/:noteId'
              component={Note}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/files'
              component={Files}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/create-file'
              component={CreateFile}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/files/:fileId'
              component={UpdateFile}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/github-activity'
              component={GithubActivities}
            />
            <PrivateRoute
              exact
              path='/projects/:projectId/github-connection'
              component={GithubConnection}
            />
            <Route exact path='*' component={NotFound} />
          </Switch>
        </BaseComponent>
      </Router>
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadUser: () => dispatch(loadUser()),
});

export default connect(null, mapDispatchToProps)(App);
