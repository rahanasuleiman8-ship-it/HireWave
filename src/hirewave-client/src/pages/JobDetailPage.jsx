import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

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
    client.get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false));
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

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
            <p className="text-gray-500 mt-2 text-lg">{job.company} · {job.location}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">{job.jobType}</span>
              {job.salaryMin && (
                <span className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                  £{job.salaryMin.toLocaleString()} – £{job.salaryMax?.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-400">{new Date(job.postedAt).toLocaleDateString()}</span>
        </div>

        <hr className="mb-6" />

        <div className="prose max-w-none text-gray-700 leading-relaxed mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h2>
          <p>{job.description}</p>
        </div>

        {/* Apply section */}
        {!user && (
          <button onClick={() => navigate('/login')} className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
            Login to Apply
          </button>
        )}

        {user?.role === 'JobSeeker' && !applied && !showForm && (
          <button onClick={() => setShowForm(true)} className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
            Apply Now
          </button>
        )}

        {applied && (
          <div className="bg-green-50 text-green-700 px-6 py-4 rounded-xl font-medium">
            ✅ Application submitted successfully!
          </div>
        )}

        {showForm && (
          <form onSubmit={handleApply} className="mt-4 space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-800 text-lg">Your Application</h3>
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
              <textarea
                rows={5}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV (PDF or Word, max 5MB)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={applying} className="bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50">
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
