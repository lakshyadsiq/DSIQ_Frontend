import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.16.10.9:5000/', // Set your base URL here
});

// Request: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh', { refreshToken });

        const newAccessToken = response.data.accessToken;
        localStorage.setItem('authToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // retry original request
      } catch (err) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isLoggedIn');
        localStorage.setItem('hasWorkspace', 'false');

        window.location.href = '/login'; // force logout
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
