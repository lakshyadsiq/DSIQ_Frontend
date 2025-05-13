// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import workspaceReducer from './slices/workspaceSlice';
import workspaceViewReducer from './slices/workspaceViewSlice';
import authReducer from './slices/authSlice';


export const store = configureStore({
  reducer: {
    profile: profileReducer,
    workspace: workspaceReducer,
    workspaceView: workspaceViewReducer, 
    auth: authReducer,
  }
});

export default store;
