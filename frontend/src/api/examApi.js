import apiClient from './apiClient';
import { mockExams } from './mockData';

export const examApi = {
  getAvailableExams: async () => {
    const token = localStorage.getItem('token');
    if (token === 'bypass-token') {
      return { data: mockExams };
    }
    return apiClient.get('/exams/available');
  },
  
  startExam: async (examId) => {
    const token = localStorage.getItem('token');
    if (token === 'bypass-token') {
      const exam = mockExams.find(e => e._id === examId);
      if (!exam) throw new Error('Exam not found');
      return { 
        data: { 
          exam: exam,
          startTime: new Date()
        } 
      };
    }
    return apiClient.get(`/exams/${examId}/start`);
  },
  
  submitExam: async (examId, answers) => {
    const token = localStorage.getItem('token');
    if (token === 'bypass-token') {
      const exam = mockExams.find(e => e._id === examId);
      if (!exam) throw new Error('Exam not found');
      
      const processedAnswers = answers.map((answer, index) => {
        const question = exam.questions[index];
        const isCorrect = question && question.correctAnswer === answer.selectedAnswer;
        
        return {
          questionIndex: index,
          selectedAnswer: answer.selectedAnswer,
          isCorrect
        };
      });

      const correctAnswers = processedAnswers.filter(a => a.isCorrect).length;
      const totalQuestions = exam.questions.length;
      const percentage = (correctAnswers / totalQuestions) * 100;

      return {
        data: {
          message: "Exam submitted successfully",
          result: {
            id: 'mock-result',
            score: correctAnswers,
            totalQuestions,
            percentage,
            correctAnswers,
            status: 'completed'
          }
        }
      };
    }
    return apiClient.post(`/exams/${examId}/submit`, { answers });
  },
  
  getExam: async (examId) => {
    const token = localStorage.getItem('token');
    if (token === 'bypass-token') {
      const exam = mockExams.find(e => e._id === examId);
      if (!exam) throw new Error('Exam not found');
      return { data: exam };
    }
    return apiClient.get(`/exams/${examId}`);
  },
};
