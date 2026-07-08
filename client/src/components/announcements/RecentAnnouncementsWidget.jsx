import React from 'react';
import { Megaphone, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';

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

const RecentAnnouncementsWidget = ({ limit = 4 }) => {
  const { announcements } = useAdminData();

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Megaphone size={18} className="text-primary" aria-hidden="true" color="#2563eb" />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Recent Announcements</h3>
        </div>
        <Link to="/announcements" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          All <ChevronRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {announcements.slice(0, limit).map((ann, idx) => {
          const st = statusStyles[ann.status] || statusStyles.draft;
          return (
            <div key={ann._id} style={{ display: 'block', padding: '1rem', borderLeft: `3px solid ${typeColors[ann.type] || '#475569'}`, backgroundColor: st.bg, borderRadius: '0 8px 8px 0', gap: '0.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem', color: '#1e293b' }}>
                {ann.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ann.message}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', fontSize: '0.68rem', color: '#9CA3AF' }}>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: 999, backgroundColor: '#fff', color: st.color, border: `1px solid ${st.color}40`, fontWeight: 600, textTransform: 'capitalize' }}>
                  {ann.status}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={10} aria-hidden="true" />
                  {new Date(ann.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentAnnouncementsWidget;
