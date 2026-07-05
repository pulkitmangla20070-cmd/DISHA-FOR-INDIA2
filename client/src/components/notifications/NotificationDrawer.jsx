import React from 'react';
import { X, CheckCheck, ChevronRight } from 'lucide-react';
import NotificationCard from './NotificationCard';
import NotificationSkeleton from './NotificationSkeleton';
import NotificationEmptyState from './NotificationEmptyState';

const NotificationDrawer = ({
  open,
  onClose,
  notifications = [],
  unreadCount = 0,
  loading = false,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onViewAll,
  error,
}) => {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15,23,42,0.35)',
          backdropFilter: 'blur(4px)',
          zIndex: 190,
        }}
      />

      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(420px, 100vw)',
        backgroundColor: 'var(--color-card)',
        boxShadow: 'var(--shadow-xl)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s var(--ease-premium)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-heading)' }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-body)' }}>
                {unreadCount} unread
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {unreadCount > 0 && onMarkAllRead && (
              <button
                onClick={onMarkAllRead}
                title="Mark all as read"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '0.4rem 0.75rem',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-card)',
                  color: 'var(--color-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <CheckCheck size={14} /> Read all
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: 'none',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-heading)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {error && (
            <div style={{
              padding: '1rem',
              borderRadius: 10,
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              fontSize: '0.85rem',
            }}>
              {error}
            </div>
          )}

          {loading && <NotificationSkeleton count={5} compact />}

          {!loading && !error && notifications.length === 0 && (
            <NotificationEmptyState message="No notifications yet" description="You're all caught up!" />
          )}

          {!loading && notifications.map((notification) => (
            <NotificationCard
              key={notification._id || notification.id}
              notification={notification}
              onMarkRead={onMarkRead}
              onDelete={onDelete}
              compact
            />
          ))}
        </div>

        {notifications.length > 0 && onViewAll && (
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--color-border)',
          }}>
            <button
              onClick={onViewAll}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '0.625rem',
                borderRadius: 10,
                border: 'none',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              View All Notifications <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default NotificationDrawer;
