import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await client.post('/auth/register', form);
      login(res.data);
      navigate(res.data.role === 'Employer' ? '/dashboard' : '/jobs');
    } catch (err) {
      const data = err.response?.data;
      if (Array.isArray(data)) {
        setError(data.map((e) => e.description).join(' '));
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(26,85,104,0.6)',
    border: '1px solid var(--hw-border)',
    color: 'var(--hw-text)'
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
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--hw-text)' }}>Create an account</h1>
          <p className="text-sm mb-1" style={{ color: 'var(--hw-text-muted)' }}>Join HireWave today</p>
          <p className="text-xs mb-5" style={{ color: 'var(--hw-text-dim)' }}>Password: 8+ chars, 1 uppercase, 1 number</p>

          {error && (
            <div className="px-4 py-3 rounded-xl mb-4 text-sm"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--hw-text-muted)' }}>First Name</label>
                <input type="text" required value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
                  onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--hw-text-muted)' }}>Last Name</label>
                <input type="text" required value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
                  onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--hw-text-muted)' }}>Email</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
                onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--hw-text-muted)' }}>Password</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
                onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--hw-text-muted)' }}>I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setForm({ ...form, role: 0 })}
                  className="py-3 rounded-xl text-sm font-semibold transition-all"
                  style={form.role === 0
                    ? { background: 'rgba(45,212,191,0.15)', border: '2px solid var(--hw-teal)', color: 'var(--hw-teal)' }
                    : { background: 'rgba(26,85,104,0.4)', border: '2px solid var(--hw-border)', color: 'var(--hw-text-muted)' }
                  }>
                  🔍 Job Seeker
                </button>
                <button type="button" onClick={() => setForm({ ...form, role: 1 })}
                  className="py-3 rounded-xl text-sm font-semibold transition-all"
                  style={form.role === 1
                    ? { background: 'rgba(45,212,191,0.15)', border: '2px solid var(--hw-teal)', color: 'var(--hw-teal)' }
                    : { background: 'rgba(26,85,104,0.4)', border: '2px solid var(--hw-border)', color: 'var(--hw-text-muted)' }
                  }>
                  🏢 Employer
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--hw-teal)', color: '#0a2f3a' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--hw-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--hw-teal)' }} className="font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}