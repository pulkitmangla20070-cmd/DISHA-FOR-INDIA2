import React from 'react';
import { motion } from 'framer-motion';

const CollaborationEmptyState = ({ title = 'No workspaces found', description = 'Create your first workspace to start collaborating with your team.', action }) => {
  return (
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
        margin: '2rem 0'
      }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '1.5rem' }}>
        <rect x="20" y="30" width="80" height="60" rx="12" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="4" />
        <rect x="35" y="45" width="50" height="8" rx="4" fill="var(--color-primary)" opacity="0.4" />
        <rect x="35" y="60" width="30" height="8" rx="4" fill="var(--color-secondary)" opacity="0.4" />
        <circle cx="90" cy="90" r="20" fill="var(--color-primary)" opacity="0.1" />
      </svg>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-heading)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-body)', maxWidth: '400px', marginBottom: '2rem', fontSize: '1rem' }}>
        {description}
      </p>
      {action && (
        <button onClick={action.onClick} className="btn btn-primary">
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

export default CollaborationEmptyState;
