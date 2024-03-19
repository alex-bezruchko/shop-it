// reducer.js
import { SET_ALERT, REMOVE_ALERT } from '../actions/alertActions';

const initialState = {
  message: null,
  alertType: null
};

const alertReducer = (state = initialState, action) => {
  console.log('state', state)
  console.log('action', action)

  switch (action.type) {
    case SET_ALERT:
      return {
        ...state,
        message: action.payload.message,
        alertType: action.payload.alertType
      };
    case REMOVE_ALERT:
      return {
        ...state,
        message: null,
        alertType: null
      };
    default:
      return state;
  }
};

export default alertReducer;

