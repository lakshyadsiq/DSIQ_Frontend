import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

// Async Thunks

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      if (email === 'a@a.com' && password === '1234') {
        await new Promise((res) => setTimeout(res, 500));
        const dummyData = {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: { email, name: 'Dev User' },
        };
        localStorage.setItem('authToken', dummyData.accessToken);
        localStorage.setItem('refreshToken', dummyData.refreshToken);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('hasWorkspace', 'true');
        return dummyData;
      }

      const response = await axios.post('/api/auth/login', { email, password });
      const data = response.data;

      localStorage.setItem('authToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('isLoggedIn', 'true');

      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);
export const registerAdmin = createAsyncThunk(
  'auth/registerAdmin',
  async ({ fullName, companyName, email, password, companyCode, userRole }, { rejectWithValue }) => {
    
    try {
      // Development mock
      if (email === 'a@a.com') {
        await new Promise((res) => setTimeout(res, 500));
        const dummyData = {
          accessToken: 'mock-access-token-signup',
          refreshToken: 'mock-refresh-token-signup',
          user: { email, name: fullName },
        };
        localStorage.setItem('authToken', dummyData.accessToken);
        localStorage.setItem('refreshToken', dummyData.refreshToken);
        localStorage.setItem('isLoggedIn', 'true');
        return dummyData;
      }

      // Real API call
      const response = await axios.post('/api/auth/register-admin', {
        fullName,
        companyName,
        email,
        password,
        companyCode,
        role: userRole, // or directly 'admin'
      });

      const data = response.data;

      localStorage.setItem('authToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('isLoggedIn', 'true');

      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Admin registration failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);


// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    loading: false,
    error: null,
    user: null,
    accessToken: localStorage.getItem('authToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  },
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.setItem('hasWorkspace', 'false');
      toast.info('Logged out');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        toast.success('Login successful');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Signup
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        toast.success('Signup successful');
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
