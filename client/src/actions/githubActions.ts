import { Dispatch } from 'redux';
import { History } from 'history';

import {
  REPOSITORY_LOADED,
  REPOSITORIES_LOADED,
  REPOSITORY_STORED,
  COMMITS_LOADED,
  PULLS_LOADED,
  GITHUB_FAIL,
  CLEAR_GITHUB,
  COMMIT_NOTIFIED,
  EVENT_LOADED,
  PULL_NOTIFIED,
  EVENT_REMOVED,
  GithubDispatchTypes,
} from './githubTypes';
import api from '../api';
import { ThunkDispatch } from 'redux-thunk';
import { removeAlert, setAlert } from './alertActions';
import { MessageType } from './alertTypes';

//Load all repos
export const loadRepos = (projectId: string) => async (
  dispatch: Dispatch<GithubDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/github/repos`);

    dispatch({ type: REPOSITORIES_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: GITHUB_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Load a repository
export const loadRepo = (projectId: string) => async (
  dispatch: Dispatch<GithubDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/github/repo`);

    dispatch({ type: REPOSITORY_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: GITHUB_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Store chosen repository
export const storeRepo = (
  projectId: string,
  repositoryName: string,
  history: History
) => async (dispatch: ThunkDispatch<{}, {}, GithubDispatchTypes>) => {
  try {
    dispatch(removeAlert());

    await api.put(`/projects/${projectId}/github/repos`, {
      repositoryName,
    });

    dispatch({ type: REPOSITORY_STORED });
    history.push(`/projects/${projectId}/github-activity`);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.param))
      );

      dispatch({
        type: GITHUB_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

//Load all the commits
export const loadCommits = (projectId: string, page: number) => async (
  dispatch: Dispatch<GithubDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/github/commits/${page}`);
    dispatch({ type: COMMITS_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: GITHUB_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Load all the pulls
export const loadPulls = (projectId: string, page: number) => async (
  dispatch: Dispatch<GithubDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/github/pulls/${page}`);
    dispatch({ type: PULLS_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: GITHUB_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Clear all github state
export const clearGithub = () => (dispatch: Dispatch<GithubDispatchTypes>) => {
  dispatch({ type: CLEAR_GITHUB });
};

//Add a commit notification
export const setCommitNotification = (totalNotification: number) => (
  dispatch: Dispatch<GithubDispatchTypes>
) => {
  dispatch({ type: COMMIT_NOTIFIED, payload: totalNotification });
};

//Add a pull notification
export const setPullNotification = (totalNotification: number) => (
  dispatch: Dispatch<GithubDispatchTypes>
) => {
  dispatch({ type: PULL_NOTIFIED, payload: totalNotification });
};

//Load all events
export const loadEvents = (projectId: string) => async (
  dispatch: Dispatch<GithubDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/github/events`);
    dispatch({ type: EVENT_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: GITHUB_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Remove an event
export const removeEvent = (projectId: string, event: string) => async (
  dispatch: Dispatch<GithubDispatchTypes>
) => {
  try {
    await api.patch(`/projects/${projectId}/github/events`, { event });
    dispatch({ type: EVENT_REMOVED, payload: event });
  } catch (err) {
    dispatch({
      type: GITHUB_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
