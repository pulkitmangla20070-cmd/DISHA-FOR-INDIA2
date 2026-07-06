import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
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

const statusStyles = {
  published:  { bg: '#F0FDF4', color: '#059669' },
  scheduled:  { bg: '#FEF3C7', color: '#D97706' },
  archived:   { bg: '#F1F5F9', color: '#64748B' },
  expired:    { bg: '#FFF7ED', color: '#9A3412' },
  draft:      { bg: '#EFF6FF', color: '#2563EB' },
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
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Megaphone size={18} className="text-primary" aria-hidden="true" />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Recent Announcements</h3>
        </div>
        <Link to="/announcements" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2, transition: 'opacity 0.15s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
          All <ChevronRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {[1, 2, 3].map((i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="skeleton" style={{ height: '52px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-body)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <Megaphone size={28} style={{ color: '#D1D5DB' }} aria-hidden="true" />
          <p style={{ fontSize: '0.82rem', margin: 0 }}>No announcements yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {announcements.slice(0, limit).map((ann, idx) => {
            const st = statusStyles[ann.status] || statusStyles.draft;
            return (
              <motion.div
                key={ann._id || ann.announcementId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.25 }}
              >
                <Link
                  to={`/announcements/${ann._id || ann.announcementId}`}
                  style={{
                    display: 'block',
                    padding: '0.75rem',
                    borderLeft: `3px solid ${typeColors[ann.type] || '#475569'}`,
                    backgroundColor: st.bg,
                    borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                    textDecoration: 'none',
                    transition: 'var(--transition-fast)',
                    gap: '0.5rem',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(3px)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.2rem', color: 'var(--color-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ann.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-body)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ann.message}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', fontSize: '0.68rem', color: '#9CA3AF', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: 999, backgroundColor: st.bg, color: st.color, fontWeight: 600, textTransform: 'capitalize' }}>
                      {ann.status}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={10} aria-hidden="true" />
                      {new Date(ann.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentAnnouncementsWidget;
