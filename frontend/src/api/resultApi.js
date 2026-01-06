import apiClient from './apiClient';
import { mockResults } from './mockData';

export const resultApi = {
  getStudentResults: async () => {
    const token = localStorage.getItem('token');
    if (token === 'bypass-token') {
      return { data: mockResults };
    }
    return apiClient.get('/results/student');
  },
  
  getResultDetail: async (attemptId) => {
    const token = localStorage.getItem('token');
    if (token === 'bypass-token') {
      const result = mockResults.find(r => r.id === attemptId);
      if (!result) throw new Error('Result not found');
      return { data: result };
    }
    return apiClient.get(`/results/${attemptId}`);
  },
};
