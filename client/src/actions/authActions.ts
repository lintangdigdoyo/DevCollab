import { ThunkDispatch } from 'redux-thunk';

import api from '../api';
import { removeAlert, setAlert } from './alertActions';
import { MessageType } from './alertTypes';
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  SET_LOADING,
  REMOVE_LOADING,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  USER_LOADED,
  USER_LOAD_FAIL,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
  LoadingDispatch,
  RegisterDispatchTypes,
  LoginDispatchTypes,
  UserLoadDispatchTypes,
  LogoutDispatchTypes,
  SignInData,
  SignUpData,
} from './authTypes';

//Load User
export const loadUser = () => async (
  dispatch: ThunkDispatch<{}, {}, UserLoadDispatchTypes | LoadingDispatch>
) => {
  try {
    dispatch({ type: SET_LOADING });

    const res = await api.get('/user');
    dispatch({ type: USER_LOADED, payload: res.data });
    dispatch({ type: REMOVE_LOADING });
  } catch (err) {
    dispatch({ type: USER_LOAD_FAIL });
    dispatch({ type: REMOVE_LOADING });
  }
};

//Register User
export const signUp = (signUpData: SignUpData) => async (
  dispatch: ThunkDispatch<{}, {}, RegisterDispatchTypes>
) => {
  try {
    dispatch(removeAlert());

    await api.post('/auth/signup', signUpData);

    dispatch({ type: REGISTER_SUCCESS });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.param))
      );
    }
    dispatch({ type: REGISTER_FAIL });
  }
};

//Sign In User
export const signIn = (signInData: SignInData) => async (
  dispatch: ThunkDispatch<{}, {}, LoginDispatchTypes>
) => {
  try {
    dispatch(removeAlert());

    await api.post('/auth/signin', signInData);
    dispatch({ type: LOGIN_SUCCESS });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error: any) => {
        dispatch(setAlert(error.msg, MessageType.Fail, error.param));
      });
    }
    dispatch({ type: LOGIN_FAIL });
  }
};

//Sign out user
export const signOut = () => async (
  dispatch: ThunkDispatch<{}, {}, LogoutDispatchTypes | LoadingDispatch>
) => {
  try {
    dispatch({ type: SET_LOADING });

    await api.get('/auth/signout');
    dispatch({ type: REMOVE_LOADING });
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (err) {
    dispatch({ type: LOGOUT_FAIL });
    dispatch({ type: REMOVE_LOADING });
  }
};
