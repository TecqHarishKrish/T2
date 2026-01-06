import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { examApi } from '../../../api/examApi';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const ExamTakingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  useEffect(() => {
    const startExam = async () => {
      try {
        const response = await examApi.startExam(examId);
        setExam(response.data.exam);
        setTimeLeft(response.data.exam.duration * 60);
        setExamStarted(true);
      } catch (error) {
        console.error('Failed to start exam:', error);
        navigate('/student/exams');
      } finally {
        setLoading(false);
      }
    };

    startExam();
  }, [examId, navigate]);

  useEffect(() => {
    if (!examStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: { selectedAnswer: parseInt(answer) }
    }));
  };

  const handleSubmitExam = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    
    try {
      const answersArray = exam.questions.map((_, index) => ({
        selectedAnswer: answers[index]?.selectedAnswer || 0
      }));

      await examApi.submitExam(examId, { answers: answersArray });
      navigate('/student/results');
    } catch (error) {
      console.error('Failed to submit exam:', error);
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 300) return 'text-red-600';
    if (timeLeft <= 600) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Exam not found</h2>
          <Link
            to="/student/exams"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {exam.questions.length}
                </span>
                <span className={`text-sm font-medium ${getTimeColor()}`}>
                  ⏱️ {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {question.question}
            </h2>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={answers[currentQuestion]?.selectedAnswer === index}
                    onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {exam.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[index]?.selectedAnswer !== undefined
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === exam.questions.length - 1 ? (
              <button
                onClick={handleSubmitExam}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(exam.questions.length - 1, prev + 1))}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamTakingPage;
