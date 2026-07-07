import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

const ContributionEmptyState = ({ onStartContributing }) => {
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
        margin: '2rem 0',
      }}
    >
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'rgba(211, 84, 0, 0.10)',
        color: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
      }}>
        <PlusCircle size={40} />
      </div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-heading)' }}>
        No Contributions Yet
      </h3>
      <p style={{ color: 'var(--color-body)', maxWidth: '480px', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.7 }}>
        Be the first to contribute! Share your skills, earn coins, and make a real impact in your community.
      </p>
      {onStartContributing && (
        <button onClick={onStartContributing} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={18} /> Start Contributing
        </button>
      )}
    </motion.div>
  );
};

export default ContributionEmptyState;
