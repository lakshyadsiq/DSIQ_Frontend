
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchModules = createAsyncThunk(
  'roleManagement/fetchModules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/modules');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createRole = createAsyncThunk(
  'roleManagement/createRole',
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await api.post('/roles', roleData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const roleManagementSlice = createSlice({
  name: 'roleManagement',
  initialState: {
    modules: [],
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Modules
      .addCase(fetchModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch modules';
      })
      // Create Role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createRole.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create role';
      });
  }
});

export const { resetSuccess } = roleManagementSlice.actions;
export default roleManagementSlice.reducer;