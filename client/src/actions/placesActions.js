// actions.js
export const setPlace = (place) => ({
  type: "SET_PLACE",
  payload: { place }
});
export const fetchPlace = (place) => ({
    type: "FETCH_PLACE",
    payload: { place }
  });
  
