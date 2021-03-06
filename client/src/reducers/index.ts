import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import projectReducer from './projectReducer';
import navbarReducer from './navbarReducer';
import discussionReducer from './discussionReducer';
import meetingReducer from './meetingReducer';
import displayReducer from './displayReducer';
import noteReducer from './noteReducer';
import fileReducer from './fileReducer';
import activityReducer from './activityReducer';
import taskReducer from './taskReducer';
import githubReducer from './githubReducer';

export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
  project: projectReducer,
  navbar: navbarReducer,
  discussion: discussionReducer,
  meeting: meetingReducer,
  display: displayReducer,
  note: noteReducer,
  file: fileReducer,
  activity: activityReducer,
  task: taskReducer,
  github: githubReducer,
});
