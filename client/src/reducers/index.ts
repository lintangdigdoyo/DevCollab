import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import projectReducer from './projectReducer';
import navbarReducer from './navbarReducer';
import discussionReducer from './discussionReducer';

export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
  project: projectReducer,
  navbar: navbarReducer,
  discussion: discussionReducer,
});
