import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../volunteer/StatusBadge';
import { Calendar, Coins, Eye } from 'lucide-react';

const ContributionCard = ({ contribution }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Banner */}
      <div style={{
        height: '56px',
        background: contribution.bannerColor || 'var(--gradient-primary)',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 1.25rem',
        paddingBottom: '0.75rem',
      }}>
        <span className="badge badge-blue" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
          {contribution.category?.replace(/_/g, ' ') || 'General'}
        </span>
      </div>

      <div style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-heading)', margin: 0, lineHeight: 1.4 }}>
          {contribution.title}
        </h4>

        <p style={{ fontSize: '0.85rem', color: 'var(--color-body)', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {contribution.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-body)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} />
            <span>{new Date(contribution.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          {contribution.status === 'approved' && contribution.coins > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontWeight: 600 }}>
              <Coins size={14} />
              <span>{contribution.coins} Coins Earned</span>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <StatusBadge status={contribution.status} size="sm" />
          <button
            onClick={() => navigate(`/contributions/${contribution._id}`)}
            className="btn btn-primary"
            style={{ padding: '0.4rem 0.875rem', fontSize: '0.82rem' }}
            aria-label={`View details for ${contribution.title}`}
          >
            <Eye size={14} /> View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ContributionCard;
