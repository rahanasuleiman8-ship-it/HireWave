import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function HomePage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${keyword}&location=${location}`);
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-blue-700 text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Find Your Next Role</h1>
        <p className="text-blue-200 text-lg mb-10">Thousands of jobs in tech, finance, and more.</p>

        <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Job title or keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-gray-800 text-base focus:outline-none"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-gray-800 text-base focus:outline-none"
          />
          <button type="submit" className="bg-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-300 transition">
            Search
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="bg-white py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { label: 'Jobs Posted', value: '10,000+' },
            { label: 'Companies Hiring', value: '500+' },
            { label: 'Candidates Placed', value: '25,000+' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold text-blue-700">{stat.value}</p>
              <p className="text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Browse by Job Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['FullTime', 'PartTime', 'Contract', 'Remote'].map((type) => (
              <button
                key={type}
                onClick={() => navigate(`/jobs?jobType=${type}`)}
                className="bg-white border border-gray-200 rounded-xl py-6 text-center font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-700 transition shadow-sm"
              >
                {type === 'FullTime' ? '💼 Full Time' :
                 type === 'PartTime' ? '⏰ Part Time' :
                 type === 'Contract' ? '📋 Contract' : '🏠 Remote'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
