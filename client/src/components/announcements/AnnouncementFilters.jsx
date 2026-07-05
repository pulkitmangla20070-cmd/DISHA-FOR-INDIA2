import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter } from 'lucide-react';

const AnnouncementFilters = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  priority,
  onPriorityChange,
  status,
  onStatusChange,
  targetAudience,
  onTargetAudienceChange,
  showAdminFilters = false,
  onClear,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActive = [search, type, priority, status, targetAudience].some((v) => v !== '' && v !== 'all');

  const FilterSelect = ({ label, value, onChange, options }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {label && (
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>{label}:</span>
      )}
      <select
        className="form-control"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        style={{ padding: '0.4rem 2rem 0.4rem 1rem', width: 'auto', minWidth: '150px' }}
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  const typeOptions = [
    { value: 'general', label: 'General' },
    { value: 'program', label: 'Program' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'event', label: 'Event' },
    { value: 'recruitment', label: 'Recruitment' },
    { value: 'system', label: 'System' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'published', label: 'Published' },
    { value: 'expired', label: 'Expired' },
    { value: 'archived', label: 'Archived' },
  ];

  const audienceOptions = [
    { value: 'all_users', label: 'All Users' },
    { value: 'volunteers', label: 'Volunteers' },
    { value: 'ngos', label: 'NGOs' },
    { value: 'admins', label: 'Admins' },
    { value: 'specific_users', label: 'Specific Users' },
  ];

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--color-body)' }} />
            <input
              type="text"
              value={search || ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search announcements by title or message..."
              className="form-control"
              style={{ paddingLeft: '2.5rem', backgroundColor: 'var(--color-card)' }}
              aria-label="Search announcements"
            />
            {search && (
              <button
                onClick={() => onSearchChange?.('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '1rem',
                  color: 'var(--color-body)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            style={{ display: 'flex', padding: '0.75rem', gap: '0.5rem', alignItems: 'center' }}
            aria-expanded={showMobileFilters}
            aria-controls="announcement-filters-panel"
          >
            <Filter size={18} />
            <span className="mobile-hidden">Filters</span>
            {hasActive && (
              <span
                aria-hidden="true"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                }}
              />
            )}
          </button>
        </div>

        <AnimatePresence>
          {(showMobileFilters || true) && (
            <motion.div
              id="announcement-filters-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <FilterSelect
                label="Type"
                value={type}
                onChange={onTypeChange}
                options={typeOptions}
              />

              <FilterSelect
                label="Priority"
                value={priority}
                onChange={onPriorityChange}
                options={priorityOptions}
              />

              {showAdminFilters && (
                <FilterSelect
                  label="Status"
                  value={status}
                  onChange={onStatusChange}
                  options={statusOptions}
                />
              )}

              {!showAdminFilters && (
                <FilterSelect
                  label="Audience"
                  value={targetAudience}
                  onChange={onTargetAudienceChange}
                  options={audienceOptions}
                />
              )}

              {hasActive && (
                <button
                  onClick={onClear}
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-body)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  aria-label="Clear all filters"
                >
                  <X size={14} /> Clear all
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .mobile-hidden { display: inline; }
        }
        @media (max-width: 768px) {
          .mobile-hidden { display: none; }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementFilters;
