import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ExamsPage from '../pages/ExamsPage';
import ProctoredExamPage from '../pages/ProctoredExamPage';
import ExamSetup from '../pages/exam/ExamSetup';
import LoadingSpinner from '../components/common/LoadingSpinner';

// DISABLED AUTH GUARD - ALWAYS RENDER CHILDREN
const DisabledProtectedRoute = ({ children }) => {
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/exams" />}
      />
      <Route
        path="/login/student"
        element={!user ? <LoginPage role="student" /> : <Navigate to="/exams" />}
      />
      <Route
        path="/login/admin"
        element={!user ? <LoginPage role="admin" /> : <Navigate to="/exams" />}
      />
      <Route path="/register" element={<RegisterPage />} />

      {/* MAIN EXAM PORTAL - NO AUTH BLOCKING */}
      <Route
        path="/exams"
        element={
          <DisabledProtectedRoute>
            <ExamsPage />
          </DisabledProtectedRoute>
        }
      />

      {/* EXAM SETUP - NO AUTH BLOCKING */}
      <Route
        path="/exam/:examId/setup"
        element={
          <DisabledProtectedRoute>
            <ExamSetup />
          </DisabledProtectedRoute>
        }
      />
      
      {/* PROCORED EXAM - NO AUTH BLOCKING */}
      <Route
        path="/exam/:examId"
        element={
          <DisabledProtectedRoute>
            <ProctoredExamPage />
          </DisabledProtectedRoute>
        }
      />

      {/* FALLSAFE - ALWAYS SHOW EXAMS */}
      <Route
        path="/"
        element={<Navigate to="/exams" replace />}
      />
      
      {/* CATCH ALL - SHOW EXAMS */}
      <Route path="*" element={<Navigate to="/exams" replace />} />
    </Routes>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
