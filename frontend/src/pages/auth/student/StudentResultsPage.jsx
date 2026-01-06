import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { resultApi } from '../../../api/resultApi';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const StudentResultsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await resultApi.getStudentResults();
        setResults(response.data);
      } catch (error) {
        setError('Failed to fetch results');
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleViewDetails = (resultId) => {
    navigate(`/student/results/${resultId}`);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (percentage) => {
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
              <p className="mt-1 text-sm text-gray-500">View your exam history and performance</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/student/dashboard"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {results.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results yet</h3>
            <p className="text-gray-500 mb-4">Complete some exams to see your results here</p>
            <Link
              to="/student/exams"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Take an Exam
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{result.exam.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{result.exam.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(result.submitTime).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {result.exam.duration} minutes
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {result.totalQuestions} questions
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-end gap-2">
                      <div className={`px-4 py-2 rounded-lg ${getScoreBg(result.percentage)}`}>
                        <div className={`text-2xl font-bold ${getScoreColor(result.percentage)}`}>
                          {result.percentage}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {result.score}/{result.totalQuestions}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleViewDetails(result.id)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResultsPage;
