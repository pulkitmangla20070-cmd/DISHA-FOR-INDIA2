import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Megaphone, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAnnouncements } from '../../services/announcementsService';

const typeColors = {
  general: '#475569',
  program: '#DB2777',
  emergency: '#DC2626',
  maintenance: '#2563EB',
  event: '#D97706',
  recruitment: '#16A34A',
  system: '#64748B',
};

const RecentAnnouncementsWidget = ({ limit = 4, loading: externalLoading }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-announcements', { limit }],
    queryFn: async () => {
      const res = await getAnnouncements({ page: 1, limit, sortBy: 'createdAt', order: 'desc' });
      if (res.success) return res.data?.announcements || [];
      return [];
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const announcements = data || [];
  const loading = externalLoading ?? isLoading;

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Megaphone size={18} className="text-primary" />
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Recent Announcements</h3>
        </div>
        <Link to="/announcements" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
          All <ChevronRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '56px', borderRadius: '8px' }} />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: 'var(--color-body)' }}>
          <Megaphone size={28} style={{ margin: '0 auto 0.5rem', color: '#D1D5DB' }} />
          <p style={{ fontSize: '0.82rem', margin: 0 }}>No announcements yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {announcements.slice(0, limit).map((ann) => {
            const statusBg =
              ann.status === 'published'
                ? '#F0FDF4'
                : ann.status === 'scheduled'
                ? '#FEF3C7'
                : ann.status === 'archived'
                ? '#F1F5F9'
                : '#EFF6FF';
            const statusColor =
              ann.status === 'published'
                ? '#059669'
                : ann.status === 'scheduled'
                ? '#D97706'
                : ann.status === 'archived'
                ? '#64748B'
                : '#2563EB';

            return (
              <Link
                key={ann._id || ann.announcementId}
                to={`/announcements/${ann._id || ann.announcementId}`}
                style={{
                  display: 'block',
                  padding: '0.75rem',
                  borderLeft: `3px solid ${typeColors[ann.type] || '#475569'}`,
                  backgroundColor: statusBg,
                  borderRadius: '0 8px 8px 0',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.2rem', color: 'var(--color-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ann.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-body)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ann.message}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', fontSize: '0.68rem', color: '#9CA3AF' }}>
                  <span
                    style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: 999,
                      backgroundColor: statusBg,
                      color: statusColor,
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  >
                    {ann.status}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={10} />
                    {new Date(ann.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentAnnouncementsWidget;
