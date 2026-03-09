import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import client from '../api/client';

// ─── Design tokens ────────────────────────────────────────────────────────────
const jobTypeColors = {
  FullTime:  { bg: 'rgba(45,212,191,0.12)',  color: '#2dd4bf', border: 'rgba(45,212,191,0.3)' },
  PartTime:  { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  Contract:  { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: 'rgba(167,139,250,0.3)' },
  Remote:    { bg: 'rgba(52,211,153,0.12)',  color: '#34d399', border: 'rgba(52,211,153,0.3)' },
  full_time: { bg: 'rgba(45,212,191,0.12)',  color: '#2dd4bf', border: 'rgba(45,212,191,0.3)' },
  part_time: { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  contract:  { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: 'rgba(167,139,250,0.3)' },
};

const avatarColors = ['#2dd4bf','#a78bfa','#f59e0b','#34d399','#60a5fa','#f87171','#fb923c','#e879f9'];

function CompanyAvatar({ name, index }) {
  const color = avatarColors[index % avatarColors.length];
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '?';
  return (
    <div style={{ background:`${color}22`, border:`1px solid ${color}44`, color,
      width:44, height:44, borderRadius:10, display:'flex', alignItems:'center',
      justifyContent:'center', fontWeight:700, fontSize:13, flexShrink:0 }}>
      {initials}
    </div>
  );
}

// ─── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 animate-pulse"
      style={{ background:'rgba(15,76,92,0.4)', border:'1px solid var(--hw-border)' }}>
      <div className="flex items-start gap-4">
        <div style={{ width:44, height:44, borderRadius:10, background:'rgba(45,212,191,0.08)', flexShrink:0 }} />
        <div className="flex-1 space-y-2">
          <div style={{ height:16, width:'55%', borderRadius:6, background:'rgba(255,255,255,0.07)' }} />
          <div style={{ height:12, width:'35%', borderRadius:6, background:'rgba(255,255,255,0.05)' }} />
          <div className="flex gap-2 mt-3">
            <div style={{ height:20, width:70, borderRadius:20, background:'rgba(255,255,255,0.05)' }} />
            <div style={{ height:20, width:90, borderRadius:20, background:'rgba(255,255,255,0.05)' }} />
            <div style={{ height:20, width:110, borderRadius:20, background:'rgba(255,255,255,0.05)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Normalise a Remotive job into our shape ───────────────────────────────────
function normaliseRemotive(job) {
  const typeMap = { full_time:'FullTime', part_time:'PartTime', contract:'Contract', freelance:'Contract' };
  return {
    id: `remotive-${job.id}`,
    title: job.title,
    company: job.company_name,
    location: job.candidate_required_location || 'Remote',
    jobType: typeMap[job.job_type] || 'Remote',
    salaryMin: null,
    salaryMax: null,
    postedAt: job.publication_date,
    description: job.description?.replace(/<[^>]+>/g,'').slice(0,300) + '...',
    url: job.url,
    isExternal: true,
    logo: job.company_logo,
  };
}

// ─── Fetch from Remotive (CORS-friendly, no key needed) ───────────────────────
async function fetchRemotiveJobs(keyword = '', jobType = '') {
  try {
    const categoryMap = { FullTime:'', PartTime:'', Contract:'', Remote:'' };
    let url = `https://remotive.com/api/remote-jobs?limit=20`;
    if (keyword) url += `&search=${encodeURIComponent(keyword)}`;
    const res = await fetch(url);
    const data = await res.json();
    let jobs = (data.jobs || []).map(normaliseRemotive);
    if (jobType === 'Remote') jobs = jobs.filter(j => j.jobType === 'Remote');
    return jobs;
  } catch {
    return [];
  }
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [source, setSource] = useState('all'); // 'all' | 'local' | 'remote'

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    page: 1,
    pageSize: 10,
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    // Artificial min delay so skeleton is always visible (makes it feel lively)
    const delay = new Promise(r => setTimeout(r, 900));

    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.location) params.append('location', filters.location);
      if (filters.jobType) params.append('jobType', filters.jobType);
      params.append('page', filters.page);
      params.append('pageSize', filters.pageSize);

      // Fetch local DB + Remotive in parallel
      const [localRes, remotiveJobs] = await Promise.allSettled([
        client.get(`/jobs/search?${params}`),
        (source === 'local') ? Promise.resolve([]) : fetchRemotiveJobs(filters.keyword, filters.jobType),
      ]);

      const localJobs = localRes.status === 'fulfilled'
        ? (localRes.value.data.items || [])
        : [];
      const extJobs = remotiveJobs.status === 'fulfilled' ? remotiveJobs.value : [];

      await delay;

      // Merge: local first, then external, deduplicate by title+company
      let merged = [...localJobs];
      if (source !== 'local') {
        const seen = new Set(localJobs.map(j => `${j.title}|${j.company}`.toLowerCase()));
        for (const j of extJobs) {
          const key = `${j.title}|${j.company}`.toLowerCase();
          if (!seen.has(key)) { seen.add(key); merged.push(j); }
        }
      }

      // Filter by location client-side for external jobs
      if (filters.location) {
        const loc = filters.location.toLowerCase();
        merged = merged.filter(j =>
          j.location?.toLowerCase().includes(loc) || j.isExternal
        );
      }

      setJobs(merged);
      setTotalPages(localRes.status === 'fulfilled' ? (localRes.value.data.totalPages || 1) : 1);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters, source]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, page: 1 }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Search bar */}
      <form onSubmit={handleSearch}
        className="flex flex-wrap gap-3 p-3 rounded-2xl mb-6"
        style={{ background:'rgba(15,76,92,0.7)', border:'1px solid var(--hw-border)' }}>
        <div className="flex-1 min-w-[180px] flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{ background:'rgba(26,85,104,0.6)', border:'1px solid var(--hw-border)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ color:'var(--hw-text-dim)', flexShrink:0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search jobs..."
            value={filters.keyword}
            onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color:'var(--hw-text)' }} />
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{ background:'rgba(26,85,104,0.6)', border:'1px solid var(--hw-border)', minWidth:140 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ color:'var(--hw-text-dim)', flexShrink:0 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <input type="text" placeholder="Location"
            value={filters.location}
            onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
            className="bg-transparent text-sm focus:outline-none"
            style={{ color:'var(--hw-text)', width:100 }} />
        </div>

        <select value={filters.jobType}
          onChange={e => setFilters(f => ({ ...f, jobType: e.target.value, page:1 }))}
          className="px-4 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{ background:'rgba(26,85,104,0.6)', border:'1px solid var(--hw-border)', color:'var(--hw-text-muted)' }}>
          <option value="">All Types</option>
          <option value="FullTime">Full Time</option>
          <option value="PartTime">Part Time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>

        <button type="submit"
          style={{ background:'var(--hw-teal)', color:'#0a2f3a' }}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition">
          Search
        </button>
      </form>

      {/* Source toggle + results count */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <p className="text-sm" style={{ color:'var(--hw-text-muted)' }}>
          {loading ? 'Searching...' : (
            <>Showing <span style={{ color:'var(--hw-teal)', fontWeight:600 }}>{jobs.length}</span> jobs</>
          )}
        </p>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background:'rgba(15,76,92,0.5)', border:'1px solid var(--hw-border)' }}>
          {[['all','🌐 All Jobs'],['local','🏢 Local'],['remote','💻 Remote']].map(([val, label]) => (
            <button key={val} onClick={() => { setSource(val); setFilters(f => ({...f, page:1})); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
              style={source === val
                ? { background:'var(--hw-teal)', color:'#0a2f3a' }
                : { color:'var(--hw-text-muted)' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Job list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 rounded-2xl"
          style={{ background:'rgba(15,76,92,0.3)', border:'1px solid var(--hw-border)', color:'var(--hw-text-muted)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            className="mx-auto mb-3" style={{ color:'var(--hw-text-dim)' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <p className="font-medium">No jobs found</p>
          <p className="text-sm mt-1" style={{ color:'var(--hw-text-dim)' }}>Try different keywords or switch to "All Jobs"</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job, i) => {
            const typeStyle = jobTypeColors[job.jobType] || jobTypeColors.Remote;
            const isExternal = job.isExternal;
            const CardWrapper = ({ children }) => isExternal
              ? <a href={job.url} target="_blank" rel="noopener noreferrer"
                  className="block rounded-2xl p-5 transition-all duration-200 group"
                  style={{ background:'rgba(15,76,92,0.5)', border:'1px solid var(--hw-border)', textDecoration:'none' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--hw-teal-dark)'; e.currentTarget.style.background='rgba(15,76,92,0.8)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--hw-border)'; e.currentTarget.style.background='rgba(15,76,92,0.5)'; }}>
                  {children}
                </a>
              : <Link to={`/jobs/${job.id}`}
                  className="block rounded-2xl p-5 transition-all duration-200 group"
                  style={{ background:'rgba(15,76,92,0.5)', border:'1px solid var(--hw-border)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--hw-teal-dark)'; e.currentTarget.style.background='rgba(15,76,92,0.8)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--hw-border)'; e.currentTarget.style.background='rgba(15,76,92,0.5)'; }}>
                  {children}
                </Link>;

            return (
              <CardWrapper key={job.id}>
                <div className="flex items-start gap-4">
                  {/* Logo or avatar */}
                  {isExternal && job.logo
                    ? <img src={job.logo} alt={job.company}
                        style={{ width:44, height:44, borderRadius:10, objectFit:'contain', background:'rgba(255,255,255,0.05)', padding:4, flexShrink:0 }}
                        onError={e => { e.target.style.display='none'; }} />
                    : <CompanyAvatar name={job.company} index={i} />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-bold text-base group-hover:text-white transition-colors"
                            style={{ color:'var(--hw-text)' }}>{job.title}</h2>
                          {isExternal && (
                            <span className="text-xs px-1.5 py-0.5 rounded"
                              style={{ background:'rgba(45,212,191,0.1)', color:'var(--hw-teal)', border:'1px solid rgba(45,212,191,0.2)', fontSize:10 }}>
                              ↗ External
                            </span>
                          )}
                        </div>
                        <p className="text-sm mt-0.5" style={{ color:'var(--hw-text-muted)' }}>{job.company}</p>
                      </div>
                      <span className="text-xs whitespace-nowrap mt-1" style={{ color:'var(--hw-text-dim)' }}>
                        {new Date(job.postedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs" style={{ color:'var(--hw-text-muted)' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {job.location}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                        style={{ background:typeStyle.bg, color:typeStyle.color, border:`1px solid ${typeStyle.border}` }}>
                        {job.jobType}
                      </span>
                      {job.salaryMin && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                          style={{ background:'rgba(45,212,191,0.1)', color:'var(--hw-teal)', border:'1px solid rgba(45,212,191,0.2)' }}>
                          £{job.salaryMin.toLocaleString()} – £{job.salaryMax?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setFilters(f => ({ ...f, page:p }))}
              className="w-9 h-9 rounded-lg font-medium text-sm transition"
              style={filters.page === p
                ? { background:'var(--hw-teal)', color:'#0a2f3a' }
                : { background:'rgba(15,76,92,0.5)', border:'1px solid var(--hw-border)', color:'var(--hw-text-muted)' }}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}