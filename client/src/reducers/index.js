// reducers/index.js
import { combineReducers } from 'redux';
import productReducer from './productReducer';
import placeReducer from './placesReducer';
import alertstReducer from './alertsReducer';

const rootReducer = combineReducers({
  products: productReducer,
  alert: alertstReducer,
  place: placeReducer
});

export default rootReducer;
