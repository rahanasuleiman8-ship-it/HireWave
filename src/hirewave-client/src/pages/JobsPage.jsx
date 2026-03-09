import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import client from '../api/client';

const jobTypeColors = {
  FullTime: { bg: 'rgba(45,212,191,0.12)', color: '#2dd4bf', border: 'rgba(45,212,191,0.3)' },
  PartTime: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  Contract: { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: 'rgba(167,139,250,0.3)' },
  Remote: { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.3)' },
};

// Company avatar colors
const avatarColors = ['#2dd4bf', '#a78bfa', '#f59e0b', '#34d399', '#60a5fa', '#f87171'];

function CompanyAvatar({ name, index }) {
  const color = avatarColors[index % avatarColors.length];
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  return (
    <div style={{ background: `${color}22`, border: `1px solid ${color}44`, color, width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    page: 1,
    pageSize: 10,
  });

  useEffect(() => { fetchJobs(); }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.location) params.append('location', filters.location);
      if (filters.jobType) params.append('jobType', filters.jobType);
      params.append('page', filters.page);
      params.append('pageSize', filters.pageSize);
      const res = await client.get(`/jobs/search?${params}`);
      setJobs(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Search bar */}
      <form onSubmit={handleSearch}
        className="flex flex-wrap gap-3 p-3 rounded-2xl mb-8"
        style={{ background: 'rgba(15,76,92,0.7)', border: '1px solid var(--hw-border)' }}>
        <div className="flex-1 min-w-[180px] flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{ background: 'rgba(26,85,104,0.6)', border: '1px solid var(--hw-border)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--hw-text-dim)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search jobs..."
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: 'var(--hw-text)' }}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{ background: 'rgba(26,85,104,0.6)', border: '1px solid var(--hw-border)', minWidth: 140 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--hw-text-dim)', flexShrink: 0 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: 'var(--hw-text)', width: 100 }}
          />
        </div>
        <select
          value={filters.jobType}
          onChange={(e) => setFilters({ ...filters, jobType: e.target.value, page: 1 })}
          className="px-4 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{ background: 'rgba(26,85,104,0.6)', border: '1px solid var(--hw-border)', color: 'var(--hw-text-muted)' }}>
          <option value="">Full-Time ▾</option>
          <option value="FullTime">Full Time</option>
          <option value="PartTime">Part Time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
        <button type="submit"
          style={{ background: 'var(--hw-teal)', color: '#0a2f3a' }}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition">
          Search
        </button>
      </form>

      {/* Results count */}
      {!loading && jobs.length > 0 && (
        <p className="text-sm mb-4" style={{ color: 'var(--hw-text-muted)' }}>
          Showing <span style={{ color: 'var(--hw-teal)', fontWeight: 600 }}>{jobs.length}</span> jobs
        </p>
      )}

      {/* Job list */}
      {loading ? (
        <div className="text-center py-20" style={{ color: 'var(--hw-text-muted)' }}>
          <div className="inline-block w-8 h-8 border-2 rounded-full animate-spin mb-3"
            style={{ borderColor: 'var(--hw-border)', borderTopColor: 'var(--hw-teal)' }} />
          <p>Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 rounded-2xl"
          style={{ background: 'rgba(15,76,92,0.3)', border: '1px solid var(--hw-border)', color: 'var(--hw-text-muted)' }}>
          No jobs found. Try different search terms.
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job, i) => {
            const typeStyle = jobTypeColors[job.jobType] || jobTypeColors.FullTime;
            return (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="block rounded-2xl p-5 transition-all duration-200 group"
                style={{ background: 'rgba(15,76,92,0.5)', border: '1px solid var(--hw-border)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--hw-teal-dark)';
                  e.currentTarget.style.background = 'rgba(15,76,92,0.8)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--hw-border)';
                  e.currentTarget.style.background = 'rgba(15,76,92,0.5)';
                }}
              >
                <div className="flex items-start gap-4">
                  <CompanyAvatar name={job.company} index={i} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-bold text-base mb-0.5 group-hover:text-white transition-colors"
                          style={{ color: 'var(--hw-text)' }}>{job.title}</h2>
                        <p className="text-sm" style={{ color: 'var(--hw-text-muted)' }}>{job.company}</p>
                      </div>
                      <span className="text-xs whitespace-nowrap mt-1" style={{ color: 'var(--hw-text-dim)' }}>
                        {new Date(job.postedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--hw-text-muted)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {job.location}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                        style={{ background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}` }}>
                        {job.jobType}
                      </span>
                      {job.salaryMin && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                          style={{ background: 'rgba(45,212,191,0.1)', color: 'var(--hw-teal)', border: '1px solid rgba(45,212,191,0.2)' }}>
                          £{job.salaryMin.toLocaleString()} – £{job.salaryMax?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setFilters({ ...filters, page: p })}
              className="w-9 h-9 rounded-lg font-medium text-sm transition"
              style={filters.page === p
                ? { background: 'var(--hw-teal)', color: '#0a2f3a' }
                : { background: 'rgba(15,76,92,0.5)', border: '1px solid var(--hw-border)', color: 'var(--hw-text-muted)' }
              }>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}