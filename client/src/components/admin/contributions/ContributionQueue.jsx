import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import ContributionQueueCard from './ContributionQueueCard';
import ContributionSkeleton from '../../contributions/ContributionSkeleton';
import ContributionEmptyState from '../../contributions/ContributionEmptyState';
import ReviewStats from './ReviewStats';

const ContributionQueue = ({ contributions, loading, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: '', category: '', sortBy: 'createdAt' });

  const filtered = useMemo(() => {
    let result = [...contributions];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.submittedBy?.name || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q) ||
        (c.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters.status) {
      result = result.filter((c) => c.status === filters.status);
    }
    if (filters.category) {
      result = result.filter((c) => c.category === filters.category);
    }
    result.sort((a, b) => {
      if (filters.sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      if (filters.sortBy === '-createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    return result;
  }, [contributions, searchQuery, filters]);

  const stats = useMemo(() => {
    const base = contributions || [];
    return {
      pending: base.filter((c) => c.status === 'pending').length,
      underReview: base.filter((c) => c.status === 'under_review').length,
      approvedToday: base.filter((c) => c.status === 'approved').length,
      rejectedToday: base.filter((c) => c.status === 'rejected').length,
      needsChanges: base.filter((c) => c.status === 'needs_changes').length,
      featured: base.filter((c) => c.isFeatured).length,
      avgReviewTime: '2.4h',
    };
  }, [contributions]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <ReviewStats stats={stats} />
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by volunteer, title, category, or tags..."
          className="form-control"
          style={{ flex: 1, minWidth: '240px' }}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="form-control"
          style={{ minWidth: '140px' }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="needs_changes">Needs Changes</option>
        </select>
      </div>
      {loading ? (
        <ContributionSkeleton count={6} />
      ) : filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <AnimatePresence>
            {filtered.map((contrib) => (
              <ContributionQueueCard
                key={contrib._id}
                contribution={contrib}
                onClick={onSelect}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <ContributionEmptyState
          type="search"
          title="No contributions found"
          description="Try adjusting your search or filters."
        />
      )}
    </div>
  );
};

export default ContributionQueue;
