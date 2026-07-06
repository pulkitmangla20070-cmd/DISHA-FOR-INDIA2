import React from 'react';
import { Search, Filter } from 'lucide-react';

const CollaborationFilters = ({ search, onSearchChange, onClear }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} aria-hidden="true" />
        <input
          type="text"
          placeholder="Search workspaces..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-control"
          style={{ paddingLeft: '2.75rem', width: '100%' }}
          aria-label="Search workspaces"
        />
      </div>
      {search && (
        <button onClick={onClear} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <Filter size={16} aria-hidden="true" /> Clear
        </button>
      )}
    </div>
  );
};

export default CollaborationFilters;
