import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

const BellButton = React.memo(({ unreadCount = 0, onClick, loading = false, ariaLabel }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-label={ariaLabel || `Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      aria-pressed={false}
      title={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'No new notifications'}
      style={{
        position: 'relative',
        width: 40,
        height: 40,
        borderRadius: 10,
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-card)',
        color: 'var(--color-heading)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'var(--transition-fast)',
        outline: 'none',
      }}
      whileHover={{ scale: 1.05, borderColor: 'var(--color-primary)' }}
      whileTap={{ scale: 0.95 }}
      animate={{
        backgroundColor: isFocused ? 'var(--color-bg)' : 'var(--color-card)',
        borderColor: isFocused ? 'var(--color-primary)' : 'var(--color-border)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {loading ? (
        <motion.div
          className="spinner"
          style={{ width: 18, height: 18, borderWidth: 2 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      ) : (
        <Bell size={20} />
      )}

      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
              minWidth: 18,
              height: 18,
              padding: '0 5px',
              borderRadius: 999,
              backgroundColor: 'var(--color-error)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              boxShadow: '0 2px 6px rgba(220,38,38,0.35)',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
});

BellButton.displayName = 'NotificationBell';

const NotificationBell = ({ unreadCount = 0, onClick, loading = false }) => {
  const ariaLabel = unreadCount > 0 ? `${unreadCount} unread notifications` : 'No unread notifications';

  return <BellButton unreadCount={unreadCount} onClick={onClick} loading={loading} ariaLabel={ariaLabel} />;
};

export default NotificationBell;

