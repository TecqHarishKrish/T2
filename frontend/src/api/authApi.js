import apiClient from './apiClient';

export const authApi = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (userData) => apiClient.post('/auth/register', userData),
  me: () => apiClient.get('/auth/me'),
};
