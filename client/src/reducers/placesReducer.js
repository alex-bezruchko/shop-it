const initialState = {
  address: '',
  favorite: '',
  name: '',
  icon: '',
  place_id: '',
  rating: '',
  types: [],
  open_now: '',
  link: '',
  long: '',
  lat: '',
};

const placeReducer = (state = initialState, action) => {
  switch (action.type) {
    
      case "FETCH_PLACE":
          return {
              ...state,
              ...action.payload, // Directly spread the payload
          };
      case 'SET_PLACE':
          return {
              ...state,
              ...action.payload, // Directly spread the payload
          };
      default:
          return state;
  }
};

export default placeReducer;
