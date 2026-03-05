import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const statusOptions = ['Applied', 'Reviewing', 'Interview', 'Offered', 'Rejected'];

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

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employer Dashboard</h1>
        <Link to="/post-job" className="bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition">
          + Post a Job
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs list */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Your Jobs</h2>
          {jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400">
              No jobs posted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => loadApplicants(job.id)}
                  className={`w-full text-left bg-white rounded-2xl border p-4 transition hover:border-blue-400 ${selectedJob === job.id ? 'border-blue-500 shadow-md' : 'border-gray-200'}`}
                >
                  <p className="font-semibold text-gray-800">{job.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{job.company} · {job.location}</p>
                  <p className="text-xs text-gray-400 mt-2">{job.isActive ? '🟢 Active' : '🔴 Inactive'}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Applicants */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            {selectedJob ? 'Applicants' : 'Select a job to view applicants'}
          </h2>
          {applicants.length === 0 && selectedJob && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400">
              No applicants yet.
            </div>
          )}
          <div className="space-y-3">
            {applicants.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{app.applicantName}</p>
                    <p className="text-sm text-gray-500">{app.applicantEmail}</p>
                    <p className="text-xs text-gray-400 mt-1">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {app.coverLetter && (
                  <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 line-clamp-3">{app.coverLetter}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
