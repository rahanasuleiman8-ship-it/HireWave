import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await client.post('/auth/login', form);
      login(res.data);
      navigate(res.data.role === 'Employer' ? '/dashboard' : '/jobs');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Glow */}
      <div style={{
        position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 500, height: 400,
        background: 'radial-gradient(ellipse, rgba(45,212,191,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M4 20 Q8 12 12 18 Q16 24 20 14 Q24 4 28 16" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <path d="M4 24 Q8 16 12 22 Q16 28 20 18 Q24 8 28 20" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
            </svg>
            <span className="text-xl font-bold" style={{ color: 'var(--hw-text)' }}>HireWave</span>
          </Link>
        </div>

        <div className="rounded-2xl p-8"
          style={{ background: 'rgba(15,76,92,0.6)', border: '1px solid var(--hw-border)', backdropFilter: 'blur(12px)' }}>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--hw-text)' }}>Welcome back</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--hw-text-muted)' }}>Log in to your HireWave account</p>

          {error && (
            <div className="px-4 py-3 rounded-xl mb-4 text-sm"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--hw-text-muted)' }}>Email</label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition"
                style={{ background: 'rgba(26,85,104,0.6)', border: '1px solid var(--hw-border)', color: 'var(--hw-text)' }}
                onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
                onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--hw-text-muted)' }}>Password</label>
              <input
                type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition"
                style={{ background: 'rgba(26,85,104,0.6)', border: '1px solid var(--hw-border)', color: 'var(--hw-text)' }}
                onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
                onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--hw-teal)', color: '#0a2f3a' }}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--hw-text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--hw-teal)' }} className="font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}