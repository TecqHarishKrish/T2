import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const dummyExams = [
  { id: 1, title: "Assessment 1", duration: 30, type: "MCQ", proctored: true, category: "General", difficulty: "Easy", questions: 20 },
  { id: 2, title: "Assessment 2", duration: 30, type: "MCQ", proctored: true, category: "General", difficulty: "Easy", questions: 20 },
  { id: 3, title: "Assessment 3", duration: 30, type: "MCQ", proctored: true, category: "General", difficulty: "Medium", questions: 25 },
  { id: 4, title: "Assessment 4", duration: 30, type: "MCQ", proctored: true, category: "General", difficulty: "Medium", questions: 25 },
  { id: 5, title: "Assessment 5", duration: 30, type: "MCQ", proctored: true, category: "General", difficulty: "Hard", questions: 30 },
  
  { id: 6, title: "Python Assessment", duration: 45, type: "Programming", proctored: true, category: "Programming", difficulty: "Medium", questions: 15 },
  { id: 7, title: "Java Assessment", duration: 45, type: "Programming", proctored: true, category: "Programming", difficulty: "Hard", questions: 15 },
  { id: 8, title: "Data Structures Assessment", duration: 60, type: "MCQ + Coding", proctored: true, category: "Programming", difficulty: "Hard", questions: 20 },
  { id: 9, title: "Operating Systems Assessment", duration: 45, type: "MCQ", proctored: true, category: "Computer Science", difficulty: "Medium", questions: 25 },
  { id: 10, title: "Database Management Systems Assessment", duration: 45, type: "MCQ", proctored: true, category: "Computer Science", difficulty: "Medium", questions: 25 },
  { id: 11, title: "Computer Networks Assessment", duration: 45, type: "MCQ", proctored: true, category: "Computer Science", difficulty: "Medium", questions: 25 },
  { id: 12, title: "Web Development Assessment", duration: 60, type: "MCQ + Coding", proctored: true, category: "Programming", difficulty: "Medium", questions: 20 },
  { id: 13, title: "Aptitude & Logical Reasoning Test", duration: 30, type: "Aptitude", proctored: true, category: "Aptitude", difficulty: "Easy", questions: 30 },
  
  { id: 14, title: "Mathematics Fundamentals", duration: 45, type: "MCQ", proctored: true, category: "Mathematics", difficulty: "Medium", questions: 25 },
  { id: 15, title: "English Proficiency Test", duration: 40, type: "MCQ", proctored: true, category: "Language", difficulty: "Easy", questions: 30 },
  { id: 16, title: "General Knowledge Test", duration: 30, type: "MCQ", proctored: true, category: "General", difficulty: "Easy", questions: 20 },
  { id: 17, title: "C Programming Assessment", duration: 45, type: "Programming", proctored: true, category: "Programming", difficulty: "Medium", questions: 15 },
  { id: 18, title: "JavaScript Assessment", duration: 40, type: "MCQ + Coding", proctored: true, category: "Programming", difficulty: "Medium", questions: 18 },
  { id: 19, title: "Machine Learning Basics", duration: 60, type: "MCQ", proctored: true, category: "Computer Science", difficulty: "Hard", questions: 20 },
  { id: 20, title: "Cybersecurity Fundamentals", duration: 45, type: "MCQ", proctored: true, category: "Computer Science", difficulty: "Hard", questions: 25 }
];

const ExamsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [exams] = useState(dummyExams);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'General', 'Programming', 'Computer Science', 'Mathematics', 'Language', 'Aptitude'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const examTypes = ['All', 'MCQ', 'Programming', 'MCQ + Coding', 'Aptitude'];

  const filteredExams = exams.filter(exam => {
    const matchesCategory = selectedCategory === 'All' || exam.category === selectedCategory;
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Programming': return '💻';
      case 'Computer Science': return '🔬';
      case 'Mathematics': return '🧮';
      case 'Language': return '📖';
      case 'Aptitude': return '🧠';
      case 'General': return '📚';
      default: return '📝';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'MCQ': return '📝';
      case 'Programming': return '💻';
      case 'MCQ + Coding': return '🔧';
      case 'Aptitude': return '🧠';
      default: return '📋';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'MCQ': return 'bg-blue-100 text-blue-800';
      case 'Programming': return 'bg-purple-100 text-purple-800';
      case 'MCQ + Coding': return 'bg-indigo-100 text-indigo-800';
      case 'Aptitude': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartExam = (exam) => {
    if (exam.proctored) {
      navigate(`/exam/${exam.id}/setup`);
    } else {
      navigate(`/exam/${exam.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Exam Portal</h1>
                <p className="text-sm text-gray-600">Choose your assessment</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email || 'Guest'}</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{filteredExams.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">0</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-purple-600">-</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full lg:w-64"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Exam Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
              {/* Exam Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{getCategoryIcon(exam.category)}</div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                      {exam.difficulty}
                    </span>
                    {exam.proctored && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Proctored
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{exam.title}</h3>
                <div className="flex items-center text-blue-100 text-sm space-x-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {exam.duration} min
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {exam.questions} Q
                  </div>
                </div>
              </div>

              {/* Exam Body */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {exam.category}
                    </div>
                    <div className="flex items-center text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(exam.type)}`}>
                        {getTypeIcon(exam.type)} {exam.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Available
                  </div>
                </div>

                {/* Exam Details */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {exam.duration} minutes
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {exam.questions} questions
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {exam.type}
                    </div>
                    <div className="flex items-center">
                      {exam.proctored ? (
                        <>
                          <svg className="w-3 h-3 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="text-red-600">Proctored</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-green-600">Open</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartExam(exam)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                >
                  {exam.proctored ? 'Start Proctored Exam' : 'Start Exam'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Proctoring Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Proctored Exam Requirements</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>• Camera and microphone access required</p>
                <p>• Fullscreen mode mandatory during exam</p>
                <p>• Tab switching will terminate the exam</p>
                <p>• Stay focused on the exam window</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsPage;
