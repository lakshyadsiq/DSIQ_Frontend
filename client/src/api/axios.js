// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '', // replace with your actual backend
  withCredentials: true, // if you use cookies/auth
});

export default axiosInstance;
