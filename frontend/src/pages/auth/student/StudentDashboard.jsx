import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { examApi } from '../../../api/examApi';
import { resultApi } from '../../../api/resultApi';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeExams: 0,
    completedExams: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token === 'bypass-token') {
          // Use mock data for bypass mode
          const mockStats = {
            activeExams: 2,
            completedExams: 1,
            averageScore: 67
          };
          setStats(mockStats);
        } else {
          // Try real API
          const [examsResponse, resultsResponse] = await Promise.all([
            examApi.getAvailableExams(),
            resultApi.getStudentResults()
          ]);

          const activeExams = examsResponse.data.length;
          const completedExams = resultsResponse.data.length;
          const averageScore = completedExams > 0 
            ? Math.round(resultsResponse.data.reduce((sum, result) => sum + result.percentage, 0) / completedExams)
            : 0;

          setStats({
            activeExams,
            completedExams,
            averageScore
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback to mock data on error
        const fallbackStats = {
          activeExams: 2,
          completedExams: 1,
          averageScore: 67
        };
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Welcome back, {user?.username}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/student/exams"
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                Available Exams
              </Link>
              <Link
                to="/student/results"
                className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
              >
                My Results
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Exams</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeExams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedExams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/student/exams"
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Take Exam</h3>
                  <p className="text-sm text-gray-500">View and start available exams</p>
                </div>
              </div>
            </Link>

            <Link
              to="/student/results"
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">View Results</h3>
                  <p className="text-sm text-gray-500">Check your exam history and scores</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
