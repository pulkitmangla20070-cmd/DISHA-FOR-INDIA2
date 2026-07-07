import React from 'react';
import { Search, X } from 'lucide-react';

const ContributionSearch = ({ value, onChange, placeholder = 'Search contributions...' }) => {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      maxWidth: '480px',
      width: '100%',
    }}>
      <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--color-body)', pointerEvents: 'none' }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search contributions"
        className="form-control"
        style={{
          paddingLeft: '2.75rem',
          paddingRight: value ? '2.5rem' : '1rem',
          width: '100%',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '0.75rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-body)',
          }}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ContributionSearch;
