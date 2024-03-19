// reducers/index.js
import { combineReducers } from 'redux';
import productReducer from './productReducer';
import alertstReducer from './alertsReducer';

const rootReducer = combineReducers({
  products: productReducer,
  alert: alertstReducer
});

export default rootReducer;
