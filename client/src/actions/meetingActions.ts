import { ThunkDispatch } from 'redux-thunk';
import { History } from 'history';
import { Dispatch } from 'redux';

import { removeAlert, setAlert } from './alertActions';
import { MessageType } from './alertTypes';
import {
  MEETINGS_LOADED,
  MEETING_LOADED,
  MEETING_CREATED,
  MEETING_UPDATED,
  MEETING_DELETED,
  MEETING_FAIL,
  CLEAR_MEETING,
  CLEAR_SELECTED_MEETING,
  MeetingDispatchTypes,
  MeetingTypes,
} from './meetingTypes';
import api from '../api';

//Load all the meeting rooms
export const loadMeetings = (projectId: string) => async (
  dispatch: Dispatch<MeetingDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/meetings`);
    dispatch({ type: MEETINGS_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: MEETING_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Load a meeting room
export const loadMeeting = (projectId: string, meetingId: string) => async (
  dispatch: Dispatch<MeetingDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/meetings/${meetingId}`);

    dispatch({ type: MEETING_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: MEETING_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Create a new meeting room
export const createMeeting = (
  projectId: string,
  formData: MeetingTypes,
  history: History
) => async (dispatch: ThunkDispatch<{}, {}, MeetingDispatchTypes>) => {
  try {
    dispatch(removeAlert());
    const res = await api.post(`/projects/${projectId}/meetings`, formData);

    dispatch({ type: MEETING_CREATED, payload: res.data });
    history.push(`/projects/${projectId}/meeting-rooms`);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.param))
      );

      dispatch({
        type: MEETING_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

//Update meeting room
export const updateMeeting = (
  projectId: string,
  meetingId: string,
  formData: MeetingTypes,
  history: History
) => async (dispatch: ThunkDispatch<{}, {}, MeetingDispatchTypes>) => {
  try {
    dispatch(removeAlert());
    const res = await api.patch(
      `/projects/${projectId}/meetings/${meetingId}`,
      formData
    );

    dispatch({ type: MEETING_UPDATED, payload: res.data });
    history.push(`/projects/${projectId}/meeting-rooms`);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.param))
      );

      dispatch({
        type: MEETING_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

//Delete a meeting room
export const deleteMeeting = (projectId: string, meetingId: string) => async (
  dispatch: Dispatch<MeetingDispatchTypes>
) => {
  try {
    await api.delete(`/projects/${projectId}/meetings/${meetingId}`);
    dispatch({ type: MEETING_DELETED, payload: meetingId });
  } catch (err) {
    dispatch({
      type: MEETING_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Clear all meeting data
export const clearMeeting = () => (
  dispatch: Dispatch<MeetingDispatchTypes>
) => {
  dispatch({ type: CLEAR_MEETING });
};

//Clear selected meeting
export const clearSelectedMeeting = () => (
  dispatch: Dispatch<MeetingDispatchTypes>
) => {
  dispatch({ type: CLEAR_SELECTED_MEETING });
};
