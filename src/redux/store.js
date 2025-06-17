
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../redux/api/api';
import { apiSlicePython } from '../redux/api/apiPython';
import profileReducer from '../redux/Slices/SelectedProfile'; 
import sessionReducer from '../redux/Slices/sessionSlice'; 

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, 
    [apiSlicePython.reducerPath]: apiSlicePython.reducer, 
    profile: profileReducer, 
    session: sessionReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware) 
      .concat(apiSlicePython.middleware),
});

export default store;