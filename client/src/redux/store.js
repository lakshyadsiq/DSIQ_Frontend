// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import workspaceReducer from './slices/workspaceSlice';
import workspaceViewReducer from './slices/workspaceViewSlice';
import authReducer from './slices/authSlice';
import roleManagementReducer from './slices/roleManagementSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    workspace: workspaceReducer,
    workspaceView: workspaceViewReducer, 
    auth: authReducer,
    roleManagement: roleManagementReducer,
  }
});

export default store;
