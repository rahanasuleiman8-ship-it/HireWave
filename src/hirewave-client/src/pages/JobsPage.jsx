import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import client from '../api/client';

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

  useEffect(() => {
    fetchJobs();
  }, [filters]);

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Job title or keyword"
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          className="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="flex-1 min-w-[150px] border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filters.jobType}
          onChange={(e) => setFilters({ ...filters, jobType: e.target.value, page: 1 })}
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="FullTime">Full Time</option>
          <option value="PartTime">Part Time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
        <button type="submit" className="bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition">
          Search
        </button>
      </form>

      {/* Results */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No jobs found.</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="block bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{job.title}</h2>
                  <p className="text-gray-500 mt-1">{job.company} · {job.location}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">{job.jobType}</span>
                    {job.salaryMin && (
                      <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                        £{job.salaryMin.toLocaleString()} – £{job.salaryMax?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {new Date(job.postedAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setFilters({ ...filters, page: p })}
              className={`w-9 h-9 rounded-lg font-medium text-sm ${filters.page === p ? 'bg-blue-700 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-blue-400'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
