import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface WorkspaceState {
  retailers: any[];
  categories: any[];
  brands: any[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  retailers: [],
  categories: [],
  brands: [],
  loading: false,
  error: null,
};

// Async thunk for fetching all data
export const fetchWorkspaceData = createAsyncThunk('workspace/fetchWorkspaceData', async () => {
  const response = await axios.get('/api/workspace-data'); // replace with actual API endpoint
  return response.data; // Assuming the response contains { retailers, categories, brands }
});

// Async thunk for posting data
export const postWorkspaceData = createAsyncThunk(
  'workspace/postWorkspaceData',
  async (workspaceData: { retailers: any[]; categories: any[]; brands: any[] }) => {
    const response = await axios.post('/api/workspace', workspaceData); // replace with actual API endpoint
    return response.data;
  }
);

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspaceData: (state, action) => {
      const { retailers, categories, brands } = action.payload;
      state.retailers = retailers;
      state.categories = categories;
      state.brands = brands;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkspaceData.fulfilled, (state, action) => {
        state.loading = false;
        const { retailers, categories, brands } = action.payload;
        state.retailers = retailers;
        state.categories = categories;
        state.brands = brands;
      })
      .addCase(fetchWorkspaceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch workspace data';
      })
      .addCase(postWorkspaceData.pending, (state) => {
        state.loading = true;
      })
      .addCase(postWorkspaceData.fulfilled, (state, action) => {
        state.loading = false;
        // Do something with the response if necessary
      })
      .addCase(postWorkspaceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to post workspace data';
      });
  },
});

export const { setWorkspaceData } = workspaceSlice.actions;

export default workspaceSlice.reducer;
