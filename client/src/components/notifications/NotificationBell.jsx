import React from 'react';
import { Bell, Check } from 'lucide-react';

const NotificationBell = ({ unreadCount = 0, onClick, loading = false }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Notifications"
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
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-bg)';
        e.currentTarget.style.borderColor = 'var(--color-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-card)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      {loading ? (
        <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
      ) : (
        <Bell size={20} />
      )}

      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: -4,
          right: -4,
          minWidth: 18,
          height: 18,
          padding: '0 4px',
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
        }}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
