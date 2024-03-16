import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Assume you have a root reducer defined

// Create Redux store
const store = configureStore({
  reducer: rootReducer
});

export default store;