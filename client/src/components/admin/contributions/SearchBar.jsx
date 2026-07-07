import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search contributions...' }) => {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
      <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)', pointerEvents: 'none' }}>
        <Search size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-control"
        style={{ paddingLeft: '2.5rem', width: '100%' }}
      />
    </div>
  );
};

export default SearchBar;
