import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { examApi } from '../../../../api/examApi';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';

const CreateExamPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 60,
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]
  });

  const handleExamDataChange = (field, value) => {
    setExamData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value
    };
    setExamData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setExamData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const addQuestion = () => {
    setExamData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    }));
  };

  const removeQuestion = (questionIndex) => {
    if (examData.questions.length > 1) {
      const updatedQuestions = examData.questions.filter((_, index) => index !== questionIndex);
      setExamData(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate exam data
    if (!examData.title || !examData.description) {
      setError('Please fill in all exam details');
      setLoading(false);
      return;
    }

    for (let i = 0; i < examData.questions.length; i++) {
      const question = examData.questions[i];
      if (!question.question || question.options.some(opt => !opt.trim())) {
        setError(`Please complete question ${i + 1}`);
        setLoading(false);
        return;
      }
    }

    try {
      // Create exam using direct API call since examApi doesn't have create method
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(examData)
      });

      if (response.ok) {
        navigate('/admin/dashboard');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create exam');
      }
    } catch (error) {
      setError('Failed to create exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Exam</h1>
              <p className="mt-1 text-sm text-gray-500">Add a new exam for students</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/admin/dashboard"
                className="px-6 py-2.5 bg-gray-100 text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-6 py-2.5 bg-gray-100 text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Title
                </label>
                <input
                  type="text"
                  value={examData.title}
                  onChange={(e) => handleExamDataChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter exam title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={examData.duration}
                  onChange={(e) => handleExamDataChange('duration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={examData.description}
                onChange={(e) => handleExamDataChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter exam description"
                required
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Question
              </button>
            </div>

            <div className="space-y-6">
              {examData.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Question {questionIndex + 1}</h3>
                    {examData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="Enter question"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options
                    </label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${questionIndex}`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() => handleQuestionChange(questionIndex, 'correctAnswer', optionIndex)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Option ${optionIndex + 1}`}
                          required
                        />
                        <span className="text-sm text-gray-500">
                          {question.correctAnswer === optionIndex && '(Correct)'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              to="/admin/dashboard"
              className="px-6 py-2.5 bg-gray-100 text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamPage;