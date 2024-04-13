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
  lng: ''
};

const queryState = {
  name: '',
  zip: '',
}
const placesState = {
  places: []
};

const coordinatesState = {
  lng: -77.0404113,
  lat: 38.9239368,
}
const coordinateReducer = (state = coordinatesState, action) => {
  console.log('payload', action.payload)
  switch (action.type) {
      case "FETCH_COORD":
          return {
              ...state,
              ...action.payload, // Directly spread the payload
          };
      case 'SET_COORD':
          return {
              ...state,
              ...action.payload, // Directly spread the payload
          };

      default:
          return state;
  }
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

const queryReducer = (state = queryState, action) => {
  switch (action.type) {
    case 'SET_QUERY':
      return {
        ...state,
        ...action.payload, // Spread the payload directly
      };
    default:
      return state;
  }
};

const placesReducer = (state = placesState, action) => {
  switch (action.type) {
    case 'SET_PLACES':
      return {
        ...state,
        places: action.payload.places,
      };
    default:
      return state;
  }
};

export { placeReducer, placesReducer, queryReducer, coordinateReducer }; // Export both reducers

export default placeReducer;
