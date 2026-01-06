import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Reuse the same Icons from ProctoredExamPage
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
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Warning: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  )
};

const ExamSetup = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [systemChecks, setSystemChecks] = useState({
    camera: { supported: false, access: false },
    microphone: { supported: false, access: false },
    fullscreen: { supported: false },
  });
  
  const [examInfo, setExamInfo] = useState({
    title: 'Loading exam...',
    duration: 0,
    instructions: []
  });
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Check system capabilities
  useEffect(() => {
    const checkSystem = async () => {
      try {
        // Check camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraStream.getTracks().forEach(track => track.stop());
        
        // Check microphone
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStream.getTracks().forEach(track => track.stop());
        
        setSystemChecks({
          camera: { supported: true, access: true },
          microphone: { supported: true, access: true },
          fullscreen: { supported: document.fullscreenEnabled },
        });
      } catch (err) {
        console.error('Permission error:', err);
        setSystemChecks(prev => ({
          ...prev,
          camera: { ...prev.camera, access: false },
          microphone: { ...prev.microphone, access: false },
        }));
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSystem();
    
    // Add event listener for fullscreen changes
    const handleFullscreenChange = () => {
      setSystemChecks(prev => ({
        ...prev,
        fullscreen: { ...prev.fullscreen, supported: document.fullscreenEnabled }
      }));
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fetch exam info (mock for now)
  useEffect(() => {
    // In a real app, this would be an API call
    const mockExamInfo = {
      title: 'Advanced JavaScript Concepts',
      duration: 60, // minutes
      instructions: [
        'Ensure you are in a well-lit room',
        'Close all other applications',
        'Ensure you have a stable internet connection',
        'Do not switch tabs or windows during the exam',
        'The exam must be completed in one session'
      ]
    };
    
    setExamInfo(mockExamInfo);
  }, [examId]);

  const handleStartExam = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate(`/exam/${examId}`);
    } catch (err) {
      console.error('Fullscreen error:', err);
      setError('Failed to enter fullscreen mode. Please allow fullscreen to continue.');
    }
  };

  const allChecksPassed = 
    systemChecks.camera.access && 
    systemChecks.microphone.access && 
    systemChecks.fullscreen.supported && 
    acceptedTerms;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Checking system requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 p-6 border-b border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white">{examInfo.title}</h1>
              <div className="flex items-center mt-2 text-gray-400">
                <Icons.Time className="w-5 h-5 mr-1" />
                <span>{examInfo.duration} minutes</span>
                <span className="mx-3 text-gray-600">•</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-100">
                  <Icons.Lock className="w-3 h-3 mr-1" />
                  Proctored Exam
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* Instructions */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Icons.Warning className="w-5 h-5 text-yellow-500 mr-2" />
              Exam Instructions
            </h2>
            <ul className="space-y-3">
              {examInfo.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-blue-400 mr-2">
                    <Icons.Check />
                  </div>
                  <span className="text-gray-300">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* System Check */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">System Check</h2>
            <div className="space-y-4">
              {/* Camera Check */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${systemChecks.camera.access ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                    <Icons.Camera className={`w-5 h-5 ${systemChecks.camera.access ? 'text-green-400' : 'text-red-400'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-100">Camera</p>
                    <p className="text-sm text-gray-400">
                      {systemChecks.camera.access 
                        ? 'Camera access granted' 
                        : 'Please allow camera access to continue'}
                    </p>
                  </div>
                </div>
                {systemChecks.camera.access ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                    <Icons.Check className="w-3 h-3 mr-1" />
                    Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400">
                    <Icons.Warning className="w-3 h-3 mr-1" />
                    Required
                  </span>
                )}
              </div>

              {/* Microphone Check */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${systemChecks.microphone.access ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                    <Icons.Mic className={`w-5 h-5 ${systemChecks.microphone.access ? 'text-green-400' : 'text-red-400'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-100">Microphone</p>
                    <p className="text-sm text-gray-400">
                      {systemChecks.microphone.access 
                        ? 'Microphone access granted' 
                        : 'Please allow microphone access to continue'}
                    </p>
                  </div>
                </div>
                {systemChecks.microphone.access ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                    <Icons.Check className="w-3 h-3 mr-1" />
                    Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400">
                    <Icons.Warning className="w-3 h-3 mr-1" />
                    Required
                  </span>
                )}
              </div>

              {/* Fullscreen Check */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${systemChecks.fullscreen.supported ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                    <Icons.Fullscreen className={`w-5 h-5 ${systemChecks.fullscreen.supported ? 'text-green-400' : 'text-red-400'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-100">Fullscreen Mode</p>
                    <p className="text-sm text-gray-400">
                      {systemChecks.fullscreen.supported 
                        ? 'Your browser supports fullscreen mode' 
                        : 'Your browser does not support fullscreen mode'}
                    </p>
                  </div>
                </div>
                {systemChecks.fullscreen.supported ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                    <Icons.Check className="w-3 h-3 mr-1" />
                    Supported
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400">
                    <Icons.Warning className="w-3 h-3 mr-1" />
                    Not Supported
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Terms Acceptance */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-300">
                I understand the rules and am ready to start the proctored exam
              </label>
              <p className="text-gray-400">
                By checking this box, you confirm that you have read and agree to the exam rules and conditions.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg flex items-start">
              <Icons.Warning className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Start Button */}
          <div className="pt-4">
            <button
              onClick={handleStartExam}
              disabled={!allChecksPassed}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                allChecksPassed
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Start Proctored Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSetup;
