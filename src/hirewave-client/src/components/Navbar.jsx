import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ background: 'rgba(10,47,58,0.95)', borderBottom: '1px solid var(--hw-border)', backdropFilter: 'blur(8px)' }}
      className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M4 20 Q8 12 12 18 Q16 24 20 14 Q24 4 28 16" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M4 24 Q8 16 12 22 Q16 28 20 18 Q24 8 28 20" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
          </svg>
          <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--hw-text)' }}>
            HireWave
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/jobs" style={{ color: 'var(--hw-text-muted)' }}
            className="hover:text-white transition-colors duration-200">
            Browse Jobs
          </Link>

          {!user && (
            <>
              <Link to="/login" style={{ color: 'var(--hw-text-muted)' }}
                className="hover:text-white transition-colors duration-200">
                Login
              </Link>
              <Link to="/register"
                style={{ background: 'var(--hw-teal)', color: '#0a2f3a' }}
                className="px-5 py-2 rounded-full font-semibold hover:opacity-90 transition">
                Sign Up
              </Link>
            </>
          )}

          {user?.role === 'JobSeeker' && (
            <Link to="/my-applications" style={{ color: 'var(--hw-text-muted)' }}
              className="hover:text-white transition-colors duration-200">
              My Applications
            </Link>
          )}

          {user?.role === 'Employer' && (
            <>
              <Link to="/dashboard" style={{ color: 'var(--hw-text-muted)' }}
                className="hover:text-white transition-colors duration-200">
                Dashboard
              </Link>
              <Link to="/post-job"
                style={{ background: 'var(--hw-teal)', color: '#0a2f3a' }}
                className="px-5 py-2 rounded-full font-semibold hover:opacity-90 transition">
                Post a Job
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <div style={{ background: 'var(--hw-surface)', border: '1px solid var(--hw-border)' }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full">
                <div style={{ background: 'var(--hw-teal)' }} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                  {user.firstName?.[0]?.toUpperCase()}
                </div>
                <span style={{ color: 'var(--hw-text-muted)' }} className="text-sm">{user.firstName}</span>
              </div>
              <button onClick={handleLogout}
                style={{ color: 'var(--hw-text-dim)' }}
                className="hover:text-white transition text-sm">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}