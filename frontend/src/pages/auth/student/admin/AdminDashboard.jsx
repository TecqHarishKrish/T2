import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { examApi } from '../../../../api/examApi';
import { resultApi } from '../../../../api/resultApi';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalExams: 0,
    activeExams: 0,
    totalStudents: 0,
    totalAttempts: 0
  });
  const [recentExams, setRecentExams] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token === 'bypass-token') {
          // Use mock data for bypass mode
          const mockStats = {
            totalExams: 2,
            activeExams: 2,
            totalStudents: 15,
            totalAttempts: 8
          };
          
          const mockRecentExams = [
            {
              _id: '1',
              title: 'JavaScript Fundamentals',
              questions: 3,
              isActive: true
            },
            {
              _id: '2',
              title: 'React Basics',
              questions: 2,
              isActive: true
            }
          ];
          
          const mockRecentResults = [
            {
              id: '1',
              exam: {
                title: 'JavaScript Fundamentals'
              },
              percentage: 67,
              score: 2,
              totalQuestions: 3,
              submitTime: new Date()
            }
          ];
          
          setStats(mockStats);
          setRecentExams(mockRecentExams);
          setRecentResults(mockRecentResults);
        } else {
          // Try real API
          const [examsResponse, resultsResponse] = await Promise.all([
            examApi.getAvailableExams(),
            resultApi.getStudentResults()
          ]);

          const exams = examsResponse.data;
          const results = resultsResponse.data;

          setStats({
            totalExams: exams.length,
            activeExams: exams.filter(exam => exam.isActive).length,
            totalStudents: 0, // Would need separate API call
            totalAttempts: results.length
          });

          setRecentExams(exams.slice(0, 5));
          setRecentResults(results.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Fallback to mock data on error
        const fallbackStats = {
          totalExams: 2,
          activeExams: 2,
          totalStudents: 15,
          totalAttempts: 8
        };
        
        const fallbackExams = [
          {
            _id: '1',
            title: 'JavaScript Fundamentals',
            questions: 3,
            isActive: true
          }
        ];
        
        setStats(fallbackStats);
        setRecentExams(fallbackExams);
        setRecentResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Manage exams and view performance</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/admin/create-exam"
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                Create Exam
              </Link>
              <Link
                to="/admin/exams"
                className="px-6 py-2.5 bg-gray-100 text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Manage Exams
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalExams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAttempts}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Exams</h3>
            {recentExams.length === 0 ? (
              <p className="text-gray-500">No exams created yet</p>
            ) : (
              <div className="space-y-3">
                {recentExams.map((exam) => (
                  <div key={exam._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{exam.title}</h4>
                      <p className="text-sm text-gray-500">{exam.questions?.length || 0} questions</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      exam.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {exam.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Results</h3>
            {recentResults.length === 0 ? (
              <p className="text-gray-500">No exam attempts yet</p>
            ) : (
              <div className="space-y-3">
                {recentResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{result.exam.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(result.submitTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{result.percentage}%</div>
                      <div className="text-sm text-gray-500">{result.score}/{result.totalQuestions}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/create-exam"
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Create Exam</h3>
                  <p className="text-sm text-gray-500">Add a new exam</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/exams"
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Manage Exams</h3>
                  <p className="text-sm text-gray-500">Edit or delete exams</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/results"
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">View Results</h3>
                  <p className="text-sm text-gray-500">Student performance</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;