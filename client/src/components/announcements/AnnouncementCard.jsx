import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, ExternalLink } from 'lucide-react';

const priorityBorder = {
  low: '#94A3B8',
  medium: '#F59E0B',
  high: '#F97316',
  critical: '#EF4444',
};

const typeStyles = {
  general: { bg: '#F8FAFC', color: '#475569' },
  program: { bg: '#FDF2F8', color: '#DB2777' },
  emergency: { bg: '#FEF2F2', color: '#DC2626' },
  maintenance: { bg: '#EFF6FF', color: '#2563EB' },
  event: { bg: '#FEF3C7', color: '#D97706' },
  recruitment: { bg: '#F0FDF4', color: '#16A34A' },
  system: { bg: '#F1F5F9', color: '#64748B' },
};

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
  tap: { scale: 0.995 },
};

const AnnouncementCard = React.memo(
  ({ announcement, onClick, showActions = true, onArchive, onPublish, onDelete }) => {
    const typeStyle = useMemo(
      () => typeStyles[announcement.type] || typeStyles.general,
      [announcement.type]
    );
    const isCritical = announcement.priority === 'critical';

    const handleArchive = useCallback(
      (e) => {
        e.stopPropagation();
        onArchive?.(announcement._id || announcement.announcementId);
      },
      [onArchive, announcement._id, announcement.announcementId]
    );

    const handlePublish = useCallback(
      (e) => {
        e.stopPropagation();
        onPublish?.(announcement._id || announcement.announcementId);
      },
      [onPublish, announcement._id, announcement.announcementId]
    );

    const handleDelete = useCallback(
      (e) => {
        e.stopPropagation();
        onDelete?.(announcement._id || announcement.announcementId);
      },
      [onDelete, announcement._id, announcement.announcementId]
    );

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      },
      [onClick]
    );

    const targetLabel = {
      all_users: 'All Users',
      volunteers: 'Volunteers',
      ngos: 'NGOs',
      admins: 'Admins',
      specific_users: 'Specific Users',
    }[announcement.targetAudience] || announcement.targetAudience;

    return (
      <motion.div
        role="article"
        aria-label={`Announcement: ${announcement.title}`}
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover={announcement.status === 'published' ? 'hover' : undefined}
        whileTap="tap"
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-card)',
          borderLeft: `4px solid ${priorityBorder[announcement.priority] || priorityBorder.medium}`,
          border: `1px solid var(--color-border)`,
          cursor: 'pointer',
          boxShadow: isCritical ? '0 0 0 1px rgba(239,68,68,0.1)' : 'none',
        }}
      >
        {isCritical && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              animation: 'pulse 2s infinite',
            }}
          />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: 999,
              backgroundColor: typeStyle.bg,
              color: typeStyle.color,
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {announcement.type}
          </span>
          <span
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: 999,
              backgroundColor:
                announcement.status === 'published'
                  ? '#F0FDF4'
                  : announcement.status === 'archived'
                  ? '#F1F5F9'
                  : '#EFF6FF',
              color:
                announcement.status === 'published'
                  ? '#059669'
                  : announcement.status === 'archived'
                  ? '#64748B'
                  : '#2563EB',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {announcement.status}
          </span>
          {announcement.scheduledAt && (
            <span
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: 999,
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Calendar size={12} /> Scheduled
            </span>
          )}
        </div>

        <div>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--color-heading)',
              margin: 0,
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {announcement.title}
          </h3>
        </div>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-body)',
            margin: 0,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {announcement.message}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
            fontSize: '0.75rem',
            color: '#94A3B8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                textTransform: 'capitalize',
              }}
            >
              <Users size={14} /> {targetLabel}
            </span>
            <span aria-hidden="true">•</span>
            <time dateTime={announcement.createdAt}>
              {formatDateTime(announcement.createdAt)}
            </time>
          </div>
          {onClick && (
            <ExternalLink size={14} aria-hidden="true" style={{ color: 'var(--color-primary)' }} />
          )}
        </div>

        {showActions && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {announcement.status !== 'published' && (
              <button
                onClick={handlePublish}
                className="btn btn-primary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              >
                Publish
              </button>
            )}
            {announcement.status !== 'archived' && (
              <button
                onClick={handleArchive}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              >
                Archive
              </button>
            )}
            <button
              onClick={handleDelete}
              className="btn btn-danger"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            >
              Delete
            </button>
          </div>
        )}
      </motion.div>
    );
  }
);

AnnouncementCard.displayName = 'AnnouncementCard';

export default AnnouncementCard;
