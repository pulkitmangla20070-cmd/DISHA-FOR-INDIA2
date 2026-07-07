import React from 'react';

const ContributionSkeleton = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = (index) => {
    switch (type) {
      case 'card':
        return (
          <div key={index} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div className="skeleton" style={{ height: '56px', width: '100%', borderRadius: 0 }} />
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="skeleton" style={{ height: '20px', width: '80%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: '14px', width: '100%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: '36px', width: '40%', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }} />
            </div>
          </div>
        );

      case 'stats':
        return (
          <div key={index} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="skeleton" style={{ height: 48, width: 48, borderRadius: 'var(--radius-lg)', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: 12, width: '50%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 24, width: '70%', borderRadius: 4 }} />
            </div>
          </div>
        );

      case 'category':
        return (
          <div key={index} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
            <div className="skeleton" style={{ height: 56, width: 56, borderRadius: 'var(--radius-lg)', flexShrink: 0 }} />
            <div className="skeleton" style={{ height: 18, width: '70%', borderRadius: 4 }} />
            <div className="skeleton" style={{ height: 14, width: '100%', borderRadius: 4 }} />
          </div>
        );

      case 'featured':
        return (
          <div key={index} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div className="skeleton" style={{ height: '160px', width: '100%', borderRadius: 0 }} />
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: 18, width: '60%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 14, width: '100%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 14, width: '40%', borderRadius: 4 }} />
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', padding: '1rem 0' }}>
            <div className="skeleton" style={{ height: 56, width: 56, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: 20, width: '40%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 14, width: '80%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 4 }} />
            </div>
          </div>
        );

      default:
        return <div key={index} className="skeleton" style={{ height: '100px', width: '100%', marginBottom: '1rem' }} />;
    }
  };

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
        {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
      </div>
    );
  }

  if (type === 'category') {
    return (
      <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
        {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
      </div>
    );
  }

  if (type === 'featured') {
    return (
      <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
        {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
      </div>
    );
  }

  if (type === 'timeline') {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </div>
  );
};

export default ContributionSkeleton;
