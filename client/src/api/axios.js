import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "",
  withCredentials: true, // if you use cookies/auth
});

export default axiosInstance;
