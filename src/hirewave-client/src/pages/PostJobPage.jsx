import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function PostJobPage() {
  const [form, setForm] = useState({
    title: '', description: '', company: '', location: '',
    salaryMin: '', salaryMax: '', jobType: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await client.post('/jobs', {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        jobType: Number(form.jobType)
      });
      navigate('/dashboard');
    } catch {
      setError('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(26,85,104,0.6)',
    border: '1px solid var(--hw-border)',
    color: 'var(--hw-text)',
    width: '100%',
    padding: '0.625rem 1rem',
    borderRadius: '0.75rem',
    fontSize: '0.875rem',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 500,
    marginBottom: '0.375rem',
    color: 'var(--hw-text-muted)'
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--hw-text)' }}>Post a New Job</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--hw-text-muted)' }}>Fill in the details to attract the right candidates</p>
      </div>

      <div className="rounded-2xl p-8"
        style={{ background: 'rgba(15,76,92,0.6)', border: '1px solid var(--hw-border)' }}>

        {error && (
          <div className="px-4 py-3 rounded-xl mb-5 text-sm"
            style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label style={labelStyle}>Job Title</label>
            <input type="text" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
              onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Company</label>
              <input type="text" required value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
                onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input type="text" required value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
                onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Job Description</label>
            <textarea rows={6} required value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical', padding: '0.75rem 1rem' }}
              onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
              onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Min Salary (£)</label>
              <input type="number" value={form.salaryMin}
                onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                placeholder="e.g. 40000"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
                onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Max Salary (£)</label>
              <input type="number" value={form.salaryMax}
                onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                placeholder="e.g. 60000"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
                onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Job Type</label>
            <select value={form.jobType}
              onChange={(e) => setForm({ ...form, jobType: e.target.value })}
              style={{ ...inputStyle }}
              onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
              onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
            >
              <option value={0}>Full Time</option>
              <option value={1}>Part Time</option>
              <option value={2}>Contract</option>
              <option value={3}>Remote</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
            style={{ background: 'var(--hw-teal)', color: '#0a2f3a' }}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
}