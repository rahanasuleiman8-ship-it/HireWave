import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// ─── Top progress bar (like YouTube / GitHub) ─────────────────────────────────
function ProgressBar({ loading }) {
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const completeRef = useRef(null);

  useEffect(() => {
    if (loading) {
      setVisible(true);
      setWidth(0);
      // Quickly jump to 15%, then slowly crawl to 85%
      setTimeout(() => setWidth(15), 50);
      setTimeout(() => setWidth(40), 200);
      setTimeout(() => setWidth(65), 500);
      timerRef.current = setTimeout(() => setWidth(85), 900);
    } else {
      clearTimeout(timerRef.current);
      setWidth(100);
      completeRef.current = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 400);
    }
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(completeRef.current);
    };
  }, [loading]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 3,
      zIndex: 9999, pointerEvents: 'none',
    }}>
      <div style={{
        height: '100%',
        width: `${width}%`,
        background: 'linear-gradient(90deg, #2dd4bf, #14b8a6, #5eead4)',
        transition: width === 100 ? 'width 0.2s ease' : 'width 0.6s ease',
        boxShadow: '0 0 10px rgba(45,212,191,0.8), 0 0 20px rgba(45,212,191,0.4)',
        borderRadius: '0 2px 2px 0',
      }} />
    </div>
  );
}

// ─── Page fade wrapper ─────────────────────────────────────────────────────────
export function PageWrapper({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [opacity, setOpacity] = useState(1);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === prevPath.current) return;
    prevPath.current = location.pathname;

    // Start transition
    setLoading(true);
    setOpacity(0);

    const minDelay = 600 + Math.random() * 400; // 600–1000ms random delay

    const t = setTimeout(() => {
      setDisplayChildren(children);
      setOpacity(1);
      setLoading(false);
    }, minDelay);

    return () => clearTimeout(t);
  }, [location.pathname, children]);

  // Update children without transition when same route re-renders
  useEffect(() => {
    if (!loading) setDisplayChildren(children);
  }, [children, loading]);

  return (
    <>
      <ProgressBar loading={loading} />
      <div style={{
        opacity,
        transition: 'opacity 0.35s ease',
        minHeight: '60vh',
      }}>
        {displayChildren}
      </div>
    </>
  );
}

// ─── Skeleton components (reusable) ───────────────────────────────────────────
export function SkeletonCard({ height = 88 }) {
  return (
    <div className="rounded-2xl p-5 animate-pulse"
      style={{ background: 'rgba(15,76,92,0.4)', border: '1px solid var(--hw-border)', height }}>
      <div className="flex items-start gap-4">
        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(45,212,191,0.08)', flexShrink: 0 }} />
        <div className="flex-1 space-y-2">
          <div style={{ height: 14, width: '55%', borderRadius: 6, background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ height: 11, width: '35%', borderRadius: 6, background: 'rgba(255,255,255,0.05)' }} />
          <div className="flex gap-2 mt-2">
            <div style={{ height: 18, width: 65, borderRadius: 20, background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ height: 18, width: 85, borderRadius: 20, background: 'rgba(255,255,255,0.05)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ width = '100%', height = 12 }) {
  return (
    <div className="animate-pulse rounded"
      style={{ width, height, background: 'rgba(255,255,255,0.06)', borderRadius: 6 }} />
  );
}

export function SkeletonJobDetail() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="rounded-2xl p-8 animate-pulse"
        style={{ background: 'rgba(15,76,92,0.6)', border: '1px solid var(--hw-border)' }}>
        <div className="space-y-4">
          <SkeletonText width="60%" height={28} />
          <SkeletonText width="40%" height={16} />
          <div className="flex gap-2 mt-2">
            <div style={{ height: 24, width: 80, borderRadius: 20, background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ height: 24, width: 110, borderRadius: 20, background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <div style={{ height: 1, background: 'var(--hw-border)', margin: '1.5rem 0' }} />
          <SkeletonText width="30%" height={18} />
          <SkeletonText width="100%" height={12} />
          <SkeletonText width="95%" height={12} />
          <SkeletonText width="88%" height={12} />
          <SkeletonText width="92%" height={12} />
          <SkeletonText width="75%" height={12} />
        </div>
      </div>
    </div>
  );
}