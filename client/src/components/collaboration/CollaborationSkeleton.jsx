import React from 'react';

const CollaborationSkeleton = ({ count = 6 }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="skeleton" style={{ height: '120px', width: '100%', borderRadius: 'var(--radius-md)' }} />
          <div className="skeleton" style={{ height: '24px', width: '70%', borderRadius: '4px' }} />
          <div className="skeleton" style={{ height: '16px', width: '40%', borderRadius: '4px' }} />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
            <div className="skeleton" style={{ height: '36px', width: '50%', borderRadius: 'var(--radius-md)' }} />
            <div className="skeleton" style={{ height: '36px', width: '50%', borderRadius: 'var(--radius-md)' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollaborationSkeleton;
