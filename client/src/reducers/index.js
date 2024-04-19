// reducers/index.js
import { combineReducers } from 'redux';
import productReducer from './productReducer';
import placeReducer, { queryReducer, placesReducer, coordinateReducer} from './placesReducer';
import alertstReducer from './alertsReducer';
import requestReducer from './requestReducer';


const rootReducer = combineReducers({
  products: productReducer,
  alert: alertstReducer,
  place: placeReducer,
  places: placesReducer,
  coord: coordinateReducer,
  query: queryReducer,
  requests: requestReducer
});

export default rootReducer;
