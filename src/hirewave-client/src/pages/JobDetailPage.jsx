import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { SkeletonJobDetail, SkeletonText } from '../components/PageTransition';

const jobTypeColors = {
  FullTime:  { bg: 'rgba(45,212,191,0.12)',  color: '#2dd4bf', border: 'rgba(45,212,191,0.3)' },
  PartTime:  { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  Contract:  { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: 'rgba(167,139,250,0.3)' },
  Remote:    { bg: 'rgba(52,211,153,0.12)',  color: '#34d399', border: 'rgba(52,211,153,0.3)' },
};

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // If it's an external Remotive job, redirect to external URL
    if (id?.startsWith('remotive-')) {
      navigate('/jobs');
      return;
    }
    // Minimum skeleton display time for polish
    const minDelay = new Promise(r => setTimeout(r, 700));
    Promise.all([
      client.get(`/jobs/${id}`).then(res => res.data).catch(() => null),
      minDelay
    ]).then(([data]) => {
      if (!data) navigate('/jobs');
      else setJob(data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('coverLetter', coverLetter);
      if (cvFile) formData.append('cvFile', cvFile);
      await client.post('/applications', formData);
      setApplied(true);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data || 'Failed to apply. You may have already applied.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <SkeletonJobDetail />;
  if (!job) return null;

  const typeStyle = jobTypeColors[job.jobType] || jobTypeColors.FullTime;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8"
      style={{ animation: 'fadeInUp 0.4s ease' }}>

      {/* Back */}
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm mb-6 hover:text-white transition"
        style={{ color: 'var(--hw-text-muted)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to Jobs
      </Link>

      <div className="rounded-2xl p-8"
        style={{ background: 'rgba(15,76,92,0.6)', border: '1px solid var(--hw-border)' }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--hw-text)' }}>{job.title}</h1>
            <p className="text-lg mb-3" style={{ color: 'var(--hw-text-muted)' }}>
              {job.company}
              <span style={{ color: 'var(--hw-text-dim)' }}> · </span>
              <span className="inline-flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {job.location}
              </span>
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm px-3 py-1 rounded-full font-medium"
                style={{ background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}` }}>
                {job.jobType}
              </span>
              {job.salaryMin && (
                <span className="text-sm px-3 py-1 rounded-full font-medium"
                  style={{ background: 'rgba(45,212,191,0.1)', color: 'var(--hw-teal)', border: '1px solid rgba(45,212,191,0.2)' }}>
                  £{job.salaryMin.toLocaleString()} – £{job.salaryMax?.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <span className="text-sm whitespace-nowrap" style={{ color: 'var(--hw-text-dim)' }}>
            {new Date(job.postedAt).toLocaleDateString()}
          </span>
        </div>

        <div style={{ height: 1, background: 'var(--hw-border)', marginBottom: '1.5rem' }} />

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--hw-text)' }}>Job Description</h2>
          <p className="leading-relaxed text-sm whitespace-pre-line" style={{ color: 'var(--hw-text-muted)' }}>
            {job.description}
          </p>
        </div>

        {/* Apply section */}
        {!user && (
          <button onClick={() => navigate('/login')}
            style={{ background: 'var(--hw-teal)', color: '#0a2f3a' }}
            className="px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition">
            Login to Apply
          </button>
        )}

        {user?.role === 'JobSeeker' && !applied && !showForm && (
          <button onClick={() => setShowForm(true)}
            style={{ background: 'var(--hw-teal)', color: '#0a2f3a' }}
            className="px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition">
            Apply Now
          </button>
        )}

        {applied && (
          <div className="px-6 py-4 rounded-xl font-medium text-sm"
            style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}>
            ✅ Application submitted! You'll receive a confirmation email shortly.
          </div>
        )}

        {showForm && (
          <form onSubmit={handleApply} className="mt-4 space-y-4 p-6 rounded-xl"
            style={{ background: 'rgba(10,47,58,0.6)', border: '1px solid var(--hw-border)', animation: 'fadeInUp 0.3s ease' }}>
            <h3 className="font-semibold text-lg" style={{ color: 'var(--hw-text)' }}>Your Application</h3>
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}>
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--hw-text-muted)' }}>Cover Letter</label>
              <textarea rows={5} value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit..."
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
                style={{ background: 'rgba(26,85,104,0.6)', border: '1px solid var(--hw-border)', color: 'var(--hw-text)' }}
                onFocus={e => e.target.style.borderColor = 'var(--hw-teal-dark)'}
                onBlur={e => e.target.style.borderColor = 'var(--hw-border)'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--hw-text-muted)' }}>
                Upload CV <span style={{ color: 'var(--hw-text-dim)' }}>(PDF or Word, max 5MB)</span>
              </label>
              <input type="file" accept=".pdf,.doc,.docx"
                onChange={e => setCvFile(e.target.files[0])}
                className="w-full text-sm"
                style={{ color: 'var(--hw-text-muted)' }}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={applying}
                style={{ background: 'var(--hw-teal)', color: '#0a2f3a' }}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-50">
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl text-sm transition"
                style={{ background: 'rgba(26,85,104,0.4)', border: '1px solid var(--hw-border)', color: 'var(--hw-text-muted)' }}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}