import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

const AnnouncementEmptyState = ({ title = 'No announcements yet', description, onAction, actionLabel }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      backgroundColor: 'var(--color-card)',
      borderRadius: 'var(--radius-xl)',
      border: '1px dashed var(--color-border)',
      margin: '2rem 0',
    }}
  >
    <div
      style={{
        marginBottom: '1.5rem',
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '4px solid var(--color-border)',
      }}
      aria-hidden="true"
    >
      <Megaphone size={40} color="var(--color-body)" />
    </div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-heading)' }}>
      {title}
    </h3>
    <p style={{ color: 'var(--color-body)', maxWidth: '450px', marginBottom: '2rem', fontSize: '1rem' }}>
      {description || 'There are no announcements available at the moment. Check back later for updates.'}
    </p>
    {onAction && actionLabel && (
      <button onClick={onAction} className="btn btn-primary">
        {actionLabel}
      </button>
    )}
  </motion.div>
);

export default AnnouncementEmptyState;
