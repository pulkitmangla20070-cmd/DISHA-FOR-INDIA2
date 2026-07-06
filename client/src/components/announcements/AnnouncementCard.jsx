import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, ExternalLink, Flag, Tag } from 'lucide-react';

const priorityConfig = {
  low:      { border: '#94A3B8', bg: '#F8FAFC', color: '#475569', label: 'Low' },
  medium:   { border: '#F59E0B', bg: '#FEF3C7', color: '#92400E', label: 'Medium' },
  high:     { border: '#F97316', bg: '#FFF7ED', color: '#9A3412', label: 'High' },
  critical: { border: '#EF4444', bg: '#FEF2F2', color: '#991B1B', label: 'Critical' },
};

const typeConfig = {
  general:     { bg: '#F8FAFC', color: '#475569' },
  program:     { bg: '#FDF2F8', color: '#DB2777' },
  emergency:   { bg: '#FEF2F2', color: '#DC2626' },
  maintenance: { bg: '#EFF6FF', color: '#2563EB' },
  event:       { bg: '#FEF3C7', color: '#D97706' },
  recruitment: { bg: '#F0FDF4', color: '#16A34A' },
  system:      { bg: '#F1F5F9', color: '#64748B' },
};

const statusConfig = {
  draft:     { bg: '#EFF6FF', color: '#2563EB' },
  scheduled: { bg: '#FEF3C7', color: '#D97706' },
  published: { bg: '#F0FDF4', color: '#059669' },
  expired:   { bg: '#FFF7ED', color: '#9A3412' },
  archived:  { bg: '#F1F5F9', color: '#64748B' },
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
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  hover:   { y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)', transition: { duration: 0.2 } },
  tap:     { scale: 0.985 },
};

const AnnouncementCard = React.memo(
  ({ announcement, onClick, showActions = true, onArchive, onPublish, onDelete }) => {
    const priority = useMemo(() => priorityConfig[announcement.priority] || priorityConfig.medium, [announcement.priority]);
    const typeStyle = useMemo(() => typeConfig[announcement.type] || typeConfig.general, [announcement.type]);
    const statusStyle = useMemo(() => statusConfig[announcement.status] || statusConfig.draft, [announcement.status]);
    const isCritical = announcement.priority === 'critical';
    const isPublished = announcement.status === 'published';

    const id = announcement._id || announcement.announcementId;
    const targetLabel = {
      all_users: 'All Users',
      volunteers: 'Volunteers',
      ngos: 'NGOs',
      admins: 'Admins',
      specific_users: 'Specific Users',
    }[announcement.targetAudience] || announcement.targetAudience;

    const handleArchive = useCallback(
      (e) => { e.stopPropagation(); onArchive?.(id); },
      [onArchive, id]
    );
    const handlePublish = useCallback(
      (e) => { e.stopPropagation(); onPublish?.(id); },
      [onPublish, id]
    );
    const handleDelete = useCallback(
      (e) => { e.stopPropagation(); onDelete?.(id); },
      [onDelete, id]
    );
    const handleKeyDown = useCallback(
      (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } },
      [onClick]
    );

    return (
      <motion.div
        role="article"
        aria-label={`${announcement.title} — ${priority.label} priority, ${announcement.status}`}
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover={isPublished ? 'hover' : undefined}
        whileTap="tap"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-card)',
          borderLeft: `4px solid ${priority.border}`,
          border: `1px solid var(--color-border)`,
          cursor: 'pointer',
          boxShadow: isCritical ? `0 0 0 1px ${priority.border}30` : 'none',
          outline: 'none',
          transition: 'box-shadow 0.2s ease',
        }}
        onFocus={(e) => { if (isPublished) e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-primary), 0 4px 12px rgba(0,0,0,0.08)'; }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = isCritical ? `0 0 0 1px ${priority.border}30` : 'none'; }}
      >
        {isCritical && (
          <div aria-hidden="true" style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.6rem', borderRadius: 999, backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <Flag size={10} color="#DC2626" />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Critical</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, backgroundColor: typeStyle.bg, color: typeStyle.color, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Tag size={11} aria-hidden="true" /> {announcement.type.replace('_', ' ')}
          </span>
          <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, backgroundColor: statusStyle.bg, color: statusStyle.color, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
            {announcement.status}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', borderRadius: 999, backgroundColor: priority.bg, color: priority.color, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
            <Flag size={11} aria-hidden="true" /> {priority.label}
          </span>
        </div>

        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-heading)', margin: 0, lineHeight: 1.45, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {announcement.title}
          </h3>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', margin: 0, lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
          {announcement.message}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem', color: '#94A3B8', paddingTop: '0.25rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textTransform: 'capitalize' }}>
              <Users size={13} /> {targetLabel}
            </span>
            <span aria-hidden="true" style={{ color: '#D1D5DB' }}>•</span>
            <time dateTime={announcement.createdAt} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={12} aria-hidden="true" /> {formatDateTime(announcement.createdAt)}
            </time>
          </div>
          {isPublished && onClick && (
            <ExternalLink size={13} aria-hidden="true" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
          )}
        </div>

        {showActions && (
          <motion.div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {announcement.status !== 'published' && (
              <button onClick={handlePublish} className="btn btn-primary" style={{ padding: '0.45rem 0.875rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Publish
              </button>
            )}
            {announcement.status !== 'archived' && (
              <button onClick={handleArchive} className="btn btn-secondary" style={{ padding: '0.45rem 0.875rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Archive
              </button>
            )}
            <button onClick={handleDelete} className="btn btn-danger" style={{ padding: '0.45rem 0.875rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Delete
            </button>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

AnnouncementCard.displayName = 'AnnouncementCard';
export default AnnouncementCard;
