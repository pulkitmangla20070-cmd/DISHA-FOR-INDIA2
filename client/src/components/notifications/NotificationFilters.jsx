import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const NotificationFilters = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  priority,
  onPriorityChange,
  readStatus,
  onReadStatusChange,
  sortBy,
  onSortByChange,
  onClear,
}) => {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'application', label: 'Applications' },
    { value: 'program', label: 'Programs' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'certificate', label: 'Certificates' },
    { value: 'reward', label: 'Rewards' },
    { value: 'leaderboard', label: 'Leaderboard' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'security', label: 'Security' },
    { value: 'system', label: 'System' },
    { value: 'message', label: 'Messages' },
  ];

  const priorities = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  const readStatuses = [
    { value: '', label: 'All Status' },
    { value: 'false', label: 'Unread' },
    { value: 'true', label: 'Read' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: '-createdAt', label: 'Oldest First' },
    { value: 'priority', label: 'Priority' },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: 'var(--color-card)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <SlidersHorizontal size={16} style={{ color: 'var(--color-body)' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-heading)' }}>
          Filters
        </span>
        {onClear && (
          <button
            onClick={onClear}
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.75rem',
              color: 'var(--color-error)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          style={{
            width: '100%',
            padding: '0.625rem 0.875rem 0.625rem 2.5rem',
            borderRadius: 10,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            fontSize: '0.85rem',
            color: 'var(--color-heading)',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
        <select
          value={category}
          onChange={(e) => onCategoryChange?.(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.82rem',
            color: 'var(--color-heading)',
            cursor: 'pointer',
          }}
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(e) => onPriorityChange?.(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.82rem',
            color: 'var(--color-heading)',
            cursor: 'pointer',
          }}
        >
          {priorities.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <select
          value={readStatus}
          onChange={(e) => onReadStatusChange?.(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.82rem',
            color: 'var(--color-heading)',
            cursor: 'pointer',
          }}
        >
          {readStatuses.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortByChange?.(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.82rem',
            color: 'var(--color-heading)',
            cursor: 'pointer',
          }}
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default NotificationFilters;
