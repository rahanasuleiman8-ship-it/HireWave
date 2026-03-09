import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const jobTypes = [
  { label: 'Full Time', value: 'FullTime', icon: '💼' },
  { label: 'Part Time', value: 'PartTime', icon: '⏰' },
  { label: 'Contract', value: 'Contract', icon: '📋' },
  { label: 'Remote', value: 'Remote', icon: '🏠' },
];

const stats = [
  { label: 'Jobs Posted', value: '10,000+' },
  { label: 'Companies Hiring', value: '500+' },
  { label: 'Candidates Placed', value: '25,000+' },
];

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
      <div className="relative py-24 px-4 text-center overflow-hidden">
        {/* Glow effect */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(45,212,191,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)', color: 'var(--hw-teal)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--hw-teal)', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            Thousands of new jobs added daily
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight" style={{ color: 'var(--hw-text)' }}>
            Find Your <span style={{ color: 'var(--hw-teal)' }}>Next Role</span>
          </h1>
          <p className="text-lg mb-10" style={{ color: 'var(--hw-text-muted)' }}>
            Thousands of jobs in tech, finance, and more. Your next opportunity is one search away.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch}
            className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 p-2 rounded-2xl"
            style={{ background: 'rgba(15,76,92,0.8)', border: '1px solid var(--hw-border)', backdropFilter: 'blur(8px)' }}>
            <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(26,85,104,0.6)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--hw-text-dim)', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Job title or keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1 bg-transparent text-sm focus:outline-none"
                style={{ color: 'var(--hw-text)', '::placeholder': { color: 'var(--hw-text-dim)' } }}
              />
            </div>
            <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(26,85,104,0.6)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--hw-text-dim)', flexShrink: 0 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 bg-transparent text-sm focus:outline-none"
                style={{ color: 'var(--hw-text)' }}
              />
            </div>
            <button type="submit"
              style={{ background: 'var(--hw-teal)', color: '#0a2f3a' }}
              className="px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition whitespace-nowrap">
              Search Jobs
            </button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label}
              className="text-center p-6 rounded-2xl"
              style={{ background: 'rgba(15,76,92,0.5)', border: '1px solid var(--hw-border)' }}>
              <p className="text-4xl font-bold mb-1" style={{ color: 'var(--hw-teal)' }}>{stat.value}</p>
              <p className="text-sm" style={{ color: 'var(--hw-text-muted)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Job Types */}
      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--hw-text)' }}>
            Browse by Job Type
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {jobTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => navigate(`/jobs?jobType=${type.value}`)}
                className="py-6 rounded-2xl text-center font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: 'rgba(15,76,92,0.5)',
                  border: '1px solid var(--hw-border)',
                  color: 'var(--hw-text-muted)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--hw-teal)';
                  e.currentTarget.style.color = 'var(--hw-teal)';
                  e.currentTarget.style.background = 'rgba(45,212,191,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--hw-border)';
                  e.currentTarget.style.color = 'var(--hw-text-muted)';
                  e.currentTarget.style.background = 'rgba(15,76,92,0.5)';
                }}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-sm">{type.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}