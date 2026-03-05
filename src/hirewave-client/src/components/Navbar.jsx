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
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          HireWave 🌊
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/jobs" className="hover:text-yellow-300 transition">Browse Jobs</Link>

          {!user && (
            <>
              <Link to="/login" className="hover:text-yellow-300 transition">Login</Link>
              <Link to="/register" className="bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-full hover:bg-yellow-300 transition font-semibold">
                Sign Up
              </Link>
            </>
          )}

          {user?.role === 'JobSeeker' && (
            <Link to="/my-applications" className="hover:text-yellow-300 transition">My Applications</Link>
          )}

          {user?.role === 'Employer' && (
            <>
              <Link to="/dashboard" className="hover:text-yellow-300 transition">Dashboard</Link>
              <Link to="/post-job" className="bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-full hover:bg-yellow-300 transition font-semibold">
                Post a Job
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-200">Hi, {user.firstName}</span>
              <button onClick={handleLogout} className="hover:text-yellow-300 transition text-sm">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
