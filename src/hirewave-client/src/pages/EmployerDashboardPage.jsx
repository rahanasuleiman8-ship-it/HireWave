import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const statusOptions = ['Applied', 'Reviewing', 'Interview', 'Offered', 'Rejected'];

const statusStyles = {
  Applied:   { bg: 'rgba(96,165,250,0.15)',  color: '#60a5fa',  border: 'rgba(96,165,250,0.3)' },
  Reviewing: { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24',  border: 'rgba(251,191,36,0.3)' },
  Interview: { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa',  border: 'rgba(167,139,250,0.3)' },
  Offered:   { bg: 'rgba(52,211,153,0.15)',  color: '#34d399',  border: 'rgba(52,211,153,0.3)' },
  Rejected:  { bg: 'rgba(248,113,113,0.15)', color: '#f87171',  border: 'rgba(248,113,113,0.3)' },
};

const pipelineStages = [
  { key: 'Applied',   label: 'Applied' },
  { key: 'Reviewing', label: 'Reviewing' },
  { key: 'Interview', label: 'Interview' },
  { key: 'Offered',   label: 'Offered' },
];

export default function EmployerDashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/jobs/mine')
      .then((res) => setJobs(res.data))
      .finally(() => setLoading(false));
  }, []);

  const loadApplicants = async (jobId) => {
    setSelectedJob(jobId);
    const res = await client.get(`/applications/job/${jobId}`);
    setApplicants(res.data);
  };

  const updateStatus = async (applicationId, status) => {
    await client.put(`/applications/${applicationId}/status`, { status });
    setApplicants((prev) =>
      prev.map((a) => a.id === applicationId ? { ...a, status } : a)
    );
  };

  // Pipeline counts
  const pipelineCounts = pipelineStages.reduce((acc, s) => {
    acc[s.key] = applicants.filter(a => a.status === s.key).length;
    return acc;
  }, {});

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: 'var(--hw-border)', borderTopColor: 'var(--hw-teal)' }} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--hw-text)' }}>Employer Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--hw-text-muted)' }}>Manage your job listings and applicants</p>
        </div>
        <Link to="/post-job"
          style={{ background: 'var(--hw-teal)', color: '#0a2f3a' }}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition flex items-center gap-2">
          <span>+</span> Post a Job
        </Link>
      </div>

      {/* Applicant Pipeline (shown when a job is selected) */}
      {selectedJob && (
        <div className="rounded-2xl p-5 mb-6"
          style={{ background: 'rgba(15,76,92,0.6)', border: '1px solid var(--hw-border)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--hw-text-muted)' }}>
            Applicant Pipeline
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {pipelineStages.map((stage) => {
              const s = statusStyles[stage.key];
              const isOffered = stage.key === 'Offered';
              return (
                <div key={stage.key}
                  className="rounded-xl p-4 text-center"
                  style={{
                    background: isOffered ? 'rgba(52,211,153,0.08)' : 'rgba(26,85,104,0.5)',
                    border: `1px solid ${isOffered ? 'rgba(52,211,153,0.3)' : 'var(--hw-border)'}`,
                  }}>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wider"
                    style={{ color: isOffered ? '#34d399' : 'var(--hw-text-muted)' }}>
                    {stage.label}
                  </p>
                  {isOffered && (
                    <div className="flex justify-center mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
                    </div>
                  )}
                  <p className="text-3xl font-bold" style={{ color: isOffered ? '#34d399' : 'var(--hw-text)' }}>
                    {pipelineCounts[stage.key]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Jobs list */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--hw-text-muted)' }}>
            Your Jobs ({jobs.length})
          </h2>
          {jobs.length === 0 ? (
            <div className="rounded-2xl p-8 text-center"
              style={{ background: 'rgba(15,76,92,0.3)', border: '1px solid var(--hw-border)', color: 'var(--hw-text-muted)' }}>
              <p className="mb-3">No jobs posted yet.</p>
              <Link to="/post-job" style={{ color: 'var(--hw-teal)' }} className="text-sm font-medium hover:underline">
                Post your first job →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => loadApplicants(job.id)}
                  className="w-full text-left rounded-xl p-4 transition-all duration-200"
                  style={{
                    background: selectedJob === job.id ? 'rgba(45,212,191,0.1)' : 'rgba(15,76,92,0.5)',
                    border: `1px solid ${selectedJob === job.id ? 'var(--hw-teal-dark)' : 'var(--hw-border)'}`,
                  }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--hw-text)' }}>{job.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--hw-text-muted)' }}>{job.company} · {job.location}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={job.isActive
                        ? { background: 'rgba(52,211,153,0.15)', color: '#34d399' }
                        : { background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Applicants */}
        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--hw-text-muted)' }}>
            {selectedJob ? `Applicants (${applicants.length})` : 'Select a job to view applicants'}
          </h2>

          {!selectedJob && (
            <div className="rounded-2xl p-12 text-center"
              style={{ background: 'rgba(15,76,92,0.3)', border: '1px dashed var(--hw-border)', color: 'var(--hw-text-dim)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3" style={{ color: 'var(--hw-text-dim)' }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <p className="text-sm">Click a job on the left to see applicants</p>
            </div>
          )}

          {selectedJob && applicants.length === 0 && (
            <div className="rounded-2xl p-8 text-center"
              style={{ background: 'rgba(15,76,92,0.3)', border: '1px solid var(--hw-border)', color: 'var(--hw-text-muted)' }}>
              No applicants yet.
            </div>
          )}

          <div className="space-y-3">
            {applicants.map((app) => {
              const s = statusStyles[app.status] || statusStyles.Applied;
              return (
                <div key={app.id} className="rounded-xl p-4"
                  style={{ background: 'rgba(15,76,92,0.5)', border: '1px solid var(--hw-border)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div style={{ background: 'rgba(45,212,191,0.15)', border: '1px solid rgba(45,212,191,0.3)', color: 'var(--hw-teal)', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                        {app.applicantName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--hw-text)' }}>{app.applicantName}</p>
                        <p className="text-xs" style={{ color: 'var(--hw-text-muted)' }}>{app.applicantEmail}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--hw-text-dim)' }}>
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  {app.coverLetter && (
                    <p className="mt-3 text-xs rounded-lg p-3 line-clamp-2"
                      style={{ background: 'rgba(10,47,58,0.5)', color: 'var(--hw-text-muted)', border: '1px solid var(--hw-border)' }}>
                      {app.coverLetter}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}