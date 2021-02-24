import {
  MEETINGS_LOADED,
  MEETING_LOADED,
  MEETING_CREATED,
  MEETING_UPDATED,
  MEETING_DELETED,
  MEETING_FAIL,
  CLEAR_MEETING,
  MeetingDispatchTypes,
  MeetingTypes,
} from '../actions/meetingTypes';

export interface MeetingInitialState {
  meetings?: MeetingTypes[];
  selectedMeeting?: MeetingTypes;
  meetingError: {
    msg?: string;
    status?: string;
  };
}

const meetingInitialState: MeetingInitialState = {
  meetingError: {},
};

const meetingReducer = (
  state = meetingInitialState,
  action: MeetingDispatchTypes
): MeetingInitialState => {
  switch (action.type) {
    case MEETINGS_LOADED:
      return { ...state, meetings: action.payload, selectedMeeting: undefined };
    case MEETING_LOADED:
      return { ...state, meetings: undefined, selectedMeeting: action.payload };
    case MEETING_CREATED:
      return {
        ...state,
        meetings: [action.payload, ...(state.meetings ?? [])],
      };
    case MEETING_UPDATED:
      return {
        ...state,
        meetings: state.meetings?.map((meeting) =>
          meeting._id === action.payload._id ? action.payload : meeting
        ),
      };
    case MEETING_DELETED:
      return {
        ...state,
        meetings: state.meetings?.filter(
          (meeting) => meeting._id !== action.payload
        ),
      };
    case MEETING_FAIL:
      return { ...state, meetingError: action.payload };
    case CLEAR_MEETING:
      return {
        meetingError: {},
        meetings: undefined,
        selectedMeeting: undefined,
      };
    default:
      return state;
  }
};

export default meetingReducer;