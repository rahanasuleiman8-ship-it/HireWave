import { useState, useEffect } from 'react';
import client from '../api/client';

const statusColors = {
  Applied: 'bg-blue-50 text-blue-700',
  Reviewing: 'bg-yellow-50 text-yellow-700',
  Interview: 'bg-purple-50 text-purple-700',
  Offered: 'bg-green-50 text-green-700',
  Rejected: 'bg-red-50 text-red-700',
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/applications/mine')
      .then((res) => setApplications(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-20 text-gray-400">You haven't applied to any jobs yet.</div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{app.jobTitle}</h2>
                  <p className="text-gray-500 mt-1">{app.company}</p>
                  <p className="text-xs text-gray-400 mt-2">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                  {app.status}
                </span>
              </div>
              {app.coverLetter && (
                <p className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 line-clamp-2">{app.coverLetter}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
