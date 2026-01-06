import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'bypass-token') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on 401 if using bypass token
    const token = localStorage.getItem('token');
    if (error.response?.status === 401 && token !== 'bypass-token') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
