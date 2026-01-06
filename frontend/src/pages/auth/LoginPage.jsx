import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage = ({ role = 'student' }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData.email, 'for role:', role);
      const result = await login(formData.email, formData.password);
      console.log('Login result:', result);
      
      // FORCE IMMEDIATE REDIRECT TO EXAMS - NO ROLE CHECKS
      console.log('Redirecting to exams page');
      navigate('/exams');
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const pageConfig = {
    student: {
      title: 'Student Portal',
      subtitle: 'Access your exams and results',
      icon: '🎓',
      demoEmail: 'student@examportal.com',
      demoPassword: 'password123'
    },
    admin: {
      title: 'Admin Dashboard', 
      subtitle: 'Manage exams and users',
      icon: '⚙️',
      demoEmail: 'admin@examportal.com',
      demoPassword: 'admin123'
    }
  };

  const config = pageConfig[role];

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Back Link */}
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>

        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">{config.icon}</div>
            <h1>{config.title}</h1>
            <p>{config.subtitle}</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="login-button"
            >
              {loading ? 'Signing in...' : `Sign in as ${role}`}
            </button>
          </form>

          <div className="switch-role">
            {role === 'student' ? (
              <Link to="/login/admin">Login as Admin instead →</Link>
            ) : (
              <Link to="/login/student">Login as Student instead →</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
