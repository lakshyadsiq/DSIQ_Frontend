// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import workspaceReducer from './slices/workspaceSlice';
import workspaceViewReducer from './slices/workspaceViewSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    workspace: workspaceReducer,
    workspaceView: workspaceViewReducer, 
  }
});