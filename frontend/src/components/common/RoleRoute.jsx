import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      {allowedRoles.includes(user.role) ? children : <Navigate to="/" replace />}
    </ProtectedRoute>
  );
};

export default RoleRoute;
