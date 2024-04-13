// reducers/index.js
import { combineReducers } from 'redux';
import productReducer from './productReducer';
import placeReducer, { queryReducer, placesReducer, coordinateReducer } from './placesReducer';
import alertstReducer from './alertsReducer';

const rootReducer = combineReducers({
  products: productReducer,
  alert: alertstReducer,
  place: placeReducer,
  places: placesReducer,
  coord: coordinateReducer,
  query: queryReducer
});

export default rootReducer;
