// actions.js
export const SET_ALERT = "SET_ALERT"
export const REMOVE_ALERT = "REMOVE_ALERT"

export const setAlert = (message, alertType) => ({
  type: SET_ALERT,
  payload: { message, alertType }
});

export const removeAlert = () => ({
  type: REMOVE_ALERT
});