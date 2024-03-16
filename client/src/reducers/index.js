// reducers/index.js
import { combineReducers } from 'redux';
import productReducer from './productReducer'; // Assume you have a product reducer defined

const rootReducer = combineReducers({
  products: productReducer
});

export default rootReducer;
