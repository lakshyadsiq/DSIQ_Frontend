import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunk to fetch active users
export const fetchActiveUsers = createAsyncThunk(
  'users/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/users?archived=false');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch active users');
    }
  }
);

// Async thunk to fetch archived users
export const fetchArchivedUsers = createAsyncThunk(
  'users/fetchArchived',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/users?archived=true');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch archived users');
    }
  }
);

// Add a new user
export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/users', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add user');
    }
  }
);

// Archive a user
export const archiveUser = createAsyncThunk(
  'users/archiveUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/users/${userId}/archive`);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to archive user');
    }
  }
);

// Restore a user
export const restoreUser = createAsyncThunk(
  'users/restoreUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/users/${userId}/restore`);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to restore user');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState: {
    activeUsers: [],
    archivedUsers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Active Users
      .addCase(fetchActiveUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.activeUsers = action.payload;
      })
      .addCase(fetchActiveUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Archived Users
      .addCase(fetchArchivedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArchivedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.archivedUsers = action.payload;
      })
      .addCase(fetchArchivedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add User
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.activeUsers.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Archive User
      .addCase(archiveUser.fulfilled, (state, action) => {
        state.activeUsers = state.activeUsers.filter(user => user.id !== action.payload.userId);
        state.archivedUsers.push(action.payload.data);
      })
      .addCase(archiveUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Restore User
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.archivedUsers = state.archivedUsers.filter(user => user.id !== action.payload.userId);
        state.activeUsers.push(action.payload.data);
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
