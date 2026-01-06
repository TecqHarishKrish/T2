import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icons
const Icons = {
  Camera: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Mic: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  Fullscreen: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0-4h-4m4 0l-5 5" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Warning: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Time: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Question: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Type: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
};

const ProctoredExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  
  // Redirect to setup if accessed directly
  useEffect(() => {
    if (!location.state?.fromSetup) {
      navigate(`/exam/${examId}/setup`, { replace: true });
    }
  }, [examId, navigate, location.state]);
  const [examStarted, setExamStarted] = useState(false);
  const [examEnded, setExamEnded] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState((currentExamInfo.duration || 30) * 60); // Convert minutes to seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [proctoringStatus, setProctoringStatus] = useState({
    camera: true,
    microphone: true,
    fullscreen: true
  });
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Get time color based on remaining time
  const getTimeColor = useCallback(() => {
    if (timeLeft < 60) return 'text-red-400';
    if (timeLeft < 300) return 'text-amber-400';
    return 'text-emerald-400';
  }, [timeLeft]);

  const dummyQuestions = [
    {
      id: 1,
      question: "What is the primary purpose of this assessment?",
      options: ["Testing knowledge", "Learning new concepts", "Entertainment", "None of the above"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "How should you approach this exam?",
      options: ["Carefully and honestly", "Quickly without thinking", "With help from others", "Skip all questions"],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "What happens if you switch tabs during the exam?",
      options: ["Exam will be terminated", "Nothing happens", "You get extra time", "Questions change"],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "Which of the following is NOT allowed during a proctored exam?",
      options: ["Using notes", "Switching browser tabs", "Having a clear workspace", "Answering questions honestly"],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "What should you do if you encounter a technical issue?",
      options: ["Contact support immediately", "Try to fix it yourself", "Continue without resolving", "Give up on the exam"],
      correctAnswer: 0
    }
  ];

  const examInfo = {
    1: { title: "Assessment 1", duration: 30, questions: 20, type: "MCQ" },
    2: { title: "Assessment 2", duration: 30, questions: 20, type: "MCQ" },
    3: { title: "Assessment 3", duration: 30, questions: 25, type: "MCQ" },
    4: { title: "Assessment 4", duration: 30, questions: 25, type: "MCQ" },
    5: { title: "Assessment 5", duration: 30, questions: 30, type: "MCQ" },
    6: { title: "Python Assessment", duration: 45, questions: 15, type: "Programming" },
    7: { title: "Java Assessment", duration: 45, questions: 15, type: "Programming" },
    8: { title: "Data Structures Assessment", duration: 60, questions: 20, type: "MCQ + Coding" },
    9: { title: "Operating Systems Assessment", duration: 45, questions: 25, type: "MCQ" },
    10: { title: "Database Management Systems Assessment", duration: 45, questions: 25, type: "MCQ" },
    11: { title: "Computer Networks Assessment", duration: 45, questions: 25, type: "MCQ" },
    12: { title: "Web Development Assessment", duration: 60, questions: 20, type: "MCQ + Coding" },
    13: { title: "Aptitude & Logical Reasoning Test", duration: 30, questions: 30, type: "Aptitude" },
    14: { title: "Mathematics Fundamentals", duration: 45, questions: 25, type: "MCQ" },
    15: { title: "English Proficiency Test", duration: 40, questions: 30, type: "MCQ" },
    16: { title: "General Knowledge Test", duration: 30, questions: 20, type: "MCQ" },
    17: { title: "C Programming Assessment", duration: 45, questions: 15, type: "Programming" },
    18: { title: "JavaScript Assessment", duration: 40, questions: 18, type: "MCQ + Coding" },
    19: { title: "Machine Learning Basics", duration: 60, questions: 20, type: "MCQ" },
    20: { title: "Cybersecurity Fundamentals", duration: 45, questions: 25, type: "MCQ" }
  };

  const currentExamInfo = examInfo[examId] || examInfo[1];

  // TAB SWITCHING DETECTION
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && examStarted && !examEnded) {
        console.log('Tab switched - ending exam');
        endExam('Tab change detected');
      }
    };

    const handleBlur = () => {
      if (examStarted && !examEnded) {
        console.log('Window lost focus - ending exam');
        endExam('Window focus lost');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [examStarted, examEnded]);

  // FULLSCREEN DETECTION
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && examStarted && !examEnded) {
        console.log('Fullscreen exited - ending exam');
        endExam('Fullscreen mode exited');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [examStarted, examEnded]);

  // Timer effect
  useEffect(() => {
    if (examStarted && !examEnded && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && examStarted && !examEnded) {
      endExam('Time expired');
    }
  }, [timeLeft, examStarted, examEnded]);

  // Update proctoring status
  const updateProctoringStatus = useCallback(() => {
    setProctoringStatus({
      camera: document.visibilityState === 'visible',
      microphone: document.visibilityState === 'visible',
      fullscreen: !!document.fullscreenElement
    });
  }, []);

  // WARNING TIMER
  useEffect(() => {
    if (timeLeft <= 300 && timeLeft > 0 && examStarted && !examEnded) {
      setShowWarning(true);
      const timer = setTimeout(() => setShowWarning(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, examStarted, examEnded]);

  const requestMediaAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      return true;
    } catch (err) {
      console.error('Media access denied:', err);
      setError('Camera and microphone access is required to start the exam.');
      return false;
    }
  };

  const startExam = async () => {
    const mediaGranted = await requestMediaAccess();
    if (!mediaGranted) return;

    try {
      await document.documentElement.requestFullscreen();
      setExamStarted(true);
      setError('');
    } catch (err) {
      console.error('Fullscreen failed:', err);
      setError('Fullscreen mode is required for this exam.');
    }
  };

  const endExam = (reason) => {
    setExamEnded(true);
    setExamStarted(false);
    
    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    
    console.log(`Exam ended: ${reason}`);
    
    // Redirect after a short delay
    setTimeout(() => {
      navigate('/exams');
    }, 3000);
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < dummyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Format time and color utility functions are now defined at the top

  if (examEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full border border-red-900/50">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icons.Warning className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Exam Terminated</h2>
            <p className="text-gray-300 mb-6">
              Your exam has been ended due to proctoring violation.
            </p>
            <div className="bg-red-900/20 rounded-lg p-4 mb-6 border border-red-800/30">
              <p className="text-sm text-red-300">
                <Icons.Time className="w-4 h-4 inline mr-2" />
                Redirecting to exam list...
              </p>
            </div>
            <div className="animate-pulse">
              <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                <div 
                  className="bg-red-500 h-1.5 rounded-full" 
                  style={{
                    width: '60%',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Proctored Exam Setup</h1>
            <p className="text-gray-600">{currentExamInfo.title}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Requirements
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Camera and microphone access
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fullscreen mode required
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No tab switching allowed
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Stay focused on this window
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Exam Details</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Duration: {currentExamInfo.duration} minutes</p>
                <p>• Questions: {currentExamInfo.questions}</p>
                <p>• Type: {currentExamInfo.type}</p>
                <p>• Format: Multiple choice</p>
                <p>• Proctoring: Enabled</p>
              </div>
            </div>
          </div>

          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full rounded-lg bg-black mb-6"
            style={{ display: 'none' }}
          />

          <div className="space-y-3">
            <button
              onClick={startExam}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Exam
            </button>

            <button
              onClick={() => navigate('/exams')}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Warning Banner */}
      {showWarning && (
        <div className="bg-red-600 text-white px-4 py-3 text-center animate-pulse">
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="font-medium">Less than 5 minutes remaining!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">{currentExamInfo.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTimeColor()}`}>
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Question {currentQuestion + 1} of {dummyQuestions.length}
              </span>
              <button
                onClick={() => endExam('Manual exit')}
                className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
              >
                End Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / dummyQuestions.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-center text-sm text-gray-600">
            {Math.round(((currentQuestion + 1) / dummyQuestions.length) * 100)}% Complete
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                Question {currentQuestion + 1}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
              {dummyQuestions[currentQuestion].question}
            </h2>
          </div>

          <div className="space-y-4 mb-8">
            {dummyQuestions[currentQuestion].options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  answers[dummyQuestions[currentQuestion].id] === index
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${dummyQuestions[currentQuestion].id}`}
                  checked={answers[dummyQuestions[currentQuestion].id] === index}
                  onChange={() => handleAnswerSelect(dummyQuestions[currentQuestion].id, index)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="ml-4 text-gray-900 font-medium">{option}</span>
                {answers[dummyQuestions[currentQuestion].id] === index && (
                  <svg className="w-5 h-5 text-blue-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </label>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {currentQuestion === dummyQuestions.length - 1 ? (
              <button
                onClick={() => endExam('Exam completed')}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Submit Exam →
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden video element for camera */}
      <video
        ref={videoRef}
        autoPlay
        muted
        className="hidden"
      />
    </div>
  );
};

export default ProctoredExamPage;
