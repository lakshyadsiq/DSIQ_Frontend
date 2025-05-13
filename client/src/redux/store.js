// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
<<<<<<< Updated upstream
import workspaceReducer from './slices/workspaceSlice';
import workspaceViewReducer from './slices/workspaceViewSlice';
=======
import authReducer from './slices/authSlice';
>>>>>>> Stashed changes

export const store = configureStore({
  reducer: {
    profile: profileReducer,
<<<<<<< Updated upstream
    workspace: workspaceReducer,
    workspaceView: workspaceViewReducer, 
  }
});
=======
    auth: authReducer,
  }
});
export default store;
>>>>>>> Stashed changes
