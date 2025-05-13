//Update your Redux Slice to use createAsyncThunk
// redux/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios'; // use default Axios if no instance

// ✅ Async Thunk to Fetch Profile Data
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  const response = await axios.get('/user/profile');
  return response.data; // assumes backend sends user profile object
});

// ✅ Async Thunk to Update Profile Data
export const updateProfile = createAsyncThunk('profile/updateProfile', async (updatedData) => {
  const response = await axios.put('/user/profile', updatedData);
  return response.data; // updated profile from backend
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default profileSlice.reducer;
