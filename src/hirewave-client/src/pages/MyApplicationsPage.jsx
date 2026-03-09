import { useState, useEffect } from 'react';
import client from '../api/client';

const statusStyles = {
  Applied:   { bg: 'rgba(96,165,250,0.15)',  color: '#60a5fa',  border: 'rgba(96,165,250,0.3)',  icon: '📨' },
  Reviewing: { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24',  border: 'rgba(251,191,36,0.3)',  icon: '🔍' },
  Interview: { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa',  border: 'rgba(167,139,250,0.3)', icon: '🎤' },
  Offered:   { bg: 'rgba(52,211,153,0.15)',  color: '#34d399',  border: 'rgba(52,211,153,0.3)',  icon: '🎉' },
  Rejected:  { bg: 'rgba(248,113,113,0.15)', color: '#f87171',  border: 'rgba(248,113,113,0.3)', icon: '❌' },
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/applications/mine')
      .then((res) => setApplications(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: 'var(--hw-border)', borderTopColor: 'var(--hw-teal)' }} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--hw-text)' }}>My Applications</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--hw-text-muted)' }}>
          Track the status of your job applications
        </p>
      </div>

      {/* Status legend */}
      {applications.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(statusStyles).map(([status, s]) => (
            <span key={status} className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
              {s.icon} {status}
            </span>
          ))}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="text-center py-20 rounded-2xl"
          style={{ background: 'rgba(15,76,92,0.3)', border: '1px solid var(--hw-border)', color: 'var(--hw-text-muted)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            className="mx-auto mb-4" style={{ color: 'var(--hw-text-dim)' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
          <p className="font-medium mb-1">No applications yet</p>
          <p className="text-sm" style={{ color: 'var(--hw-text-dim)' }}>Start applying to jobs to track them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const s = statusStyles[app.status] || statusStyles.Applied;
            return (
              <div key={app.id} className="rounded-2xl p-6"
                style={{ background: 'rgba(15,76,92,0.5)', border: '1px solid var(--hw-border)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold mb-0.5" style={{ color: 'var(--hw-text)' }}>{app.jobTitle}</h2>
                    <p className="text-sm" style={{ color: 'var(--hw-text-muted)' }}>{app.company}</p>
                    <p className="text-xs mt-1.5" style={{ color: 'var(--hw-text-dim)' }}>
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
                    style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                    {s.icon} {app.status}
                  </span>
                </div>
                {app.coverLetter && (
                  <p className="mt-4 text-xs rounded-xl p-3 line-clamp-2"
                    style={{ background: 'rgba(10,47,58,0.5)', color: 'var(--hw-text-muted)', border: '1px solid var(--hw-border)' }}>
                    {app.coverLetter}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}