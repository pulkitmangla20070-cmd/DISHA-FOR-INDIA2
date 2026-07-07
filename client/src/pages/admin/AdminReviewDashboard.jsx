import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useAdminContributions } from '../../hooks/useAdminContributions';
import ContributionQueue from '../../components/admin/contributions/ContributionQueue';
import AdminContributionDetail from '../../components/admin/contributions/AdminContributionDetail';

const AdminReviewDashboard = () => {
  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading, error } = useAdminContributions({
    page: 1,
    limit: 12,
  });

  const contributions = data?.contributions || [];

  const handleSelect = (contrib) => {
    setSelectedId(contrib._id);
  };

  const handleBack = () => {
    setSelectedId(null);
  };

  if (error) {
    return (
      <div className="page-container" style={{ padding: '2rem', color: 'var(--color-error)' }}>
        {error.message || 'Failed to load contributions'}
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Shield size={20} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Contribution Review</h1>
          <p style={{ color: 'var(--color-body)', margin: 0 }}>Review and manage volunteer contributions.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedId ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        <div>
          <ContributionQueue
            contributions={contributions}
            loading={isLoading}
            onSelect={handleSelect}
          />
        </div>
        <div>
          {selectedId ? (
            <AdminContributionDetail
              contributionId={selectedId}
              onBack={handleBack}
            />
          ) : (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-body)', background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border)' }}>
              Select a contribution from the queue to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviewDashboard;
