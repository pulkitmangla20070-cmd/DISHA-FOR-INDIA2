import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnnouncementBanner = ({ announcement, onClose }) => {
  if (!announcement) return null;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose?.();
    }
  }, [onClose]);

  return (
    <motion.div
      role="banner"
      aria-label="Featured announcement"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        padding: '2rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
        color: '#fff',
        overflow: 'hidden',
        marginBottom: '2rem',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-3rem',
          top: '-3rem',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '30%',
          bottom: '-4rem',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Megaphone size={24} />
      </div>

      <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
        {announcement.type === 'emergency' && (
          <span
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: 999,
              background: 'rgba(239,68,68,0.2)',
              color: '#FCA5A5',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}
          >
            Emergency
          </span>
        )}
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            margin: '0 0 0.5rem',
            lineHeight: 1.3,
          }}
        >
          {announcement.title}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.9)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
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
            gap: '1rem',
            marginTop: '1rem',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          {announcement.scheduledAt && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={14} /> Scheduled: {new Date(announcement.scheduledAt).toLocaleDateString()}
            </span>
          )}
          {announcement.expiresAt && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <Link
        to={`/announcements/${announcement._id || announcement.announcementId}`}
        aria-label={`Read announcement: ${announcement.title}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255,255,255,0.15)',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.9rem',
          textDecoration: 'none',
          flexShrink: 0,
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.2)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Read More <ArrowRight size={16} />
      </Link>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss banner"
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: '#fff',
            width: 28,
            height: 28,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

export default AnnouncementBanner;
