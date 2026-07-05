import React from 'react';

const AnnouncementSkeleton = ({ count = 3 }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            borderLeft: '4px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 999 }} />
            <div className="skeleton" style={{ height: 24, width: 90, borderRadius: 999 }} />
          </div>
          <div className="skeleton" style={{ height: 28, width: '80%', borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 16, width: '100%', borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 16, width: '60%', borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 14, width: '40%', borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
};

export default AnnouncementSkeleton;
