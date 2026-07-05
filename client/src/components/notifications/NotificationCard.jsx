import React from 'react';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';

const categoryStyles = {
  application: { bg: '#EFF6FF', color: '#2563EB', icon: '📋' },
  program: { bg: '#FDF2F8', color: '#DB2777', icon: '📅' },
  attendance: { bg: '#ECFDF5', color: '#059669', icon: '✓' },
  certificate: { bg: '#FFFBEB', color: '#D97706', icon: '🏆' },
  reward: { bg: '#F5F3FF', color: '#7C3AED', icon: '🎁' },
  leaderboard: { bg: '#FFF7ED', color: '#EA580C', icon: '🏅' },
  announcement: { bg: '#F8FAFC', color: '#475569', icon: '📢' },
  security: { bg: '#FEF2F2', color: '#DC2626', icon: '🔒' },
  account: { bg: '#F0FDF4', color: '#16A34A', icon: '👤' },
  system: { bg: '#F1F5F9', color: '#64748B', icon: '⚙' },
  message: { bg: '#EFF6FF', color: '#3B82F6', icon: '💬' },
};

const priorityBorder = {
  low: '#94A3B8',
  medium: '#F59E0B',
  high: '#F97316',
  critical: '#EF4444',
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now - date) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const NotificationCard = ({
  notification,
  onMarkRead,
  onDelete,
  onClick,
  showActions = true,
  compact = false,
}) => {
  if (!notification) return null;

  const category = categoryStyles[notification.category] || categoryStyles.announcement;
  const isUnread = !notification.isRead;

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        gap: '0.875rem',
        padding: compact ? '0.75rem' : '1rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: isUnread ? '#FFFBEB' : 'var(--color-card)',
        borderLeft: `4px solid ${priorityBorder[notification.priority] || priorityBorder.medium}`,
        border: `1px solid ${isUnread ? 'rgba(245,158,11,0.25)' : 'var(--color-border)'}`,
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
        opacity: notification.isDeleted ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!notification.isDeleted) {
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.transform = 'translateX(2px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      {isUnread && (
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
        }} />
      )}

      <div style={{
        width: 36,
        height: 36,
        borderRadius: '10px',
        backgroundColor: category.bg,
        color: category.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        flexShrink: 0,
      }}>
        {notification.icon ? <img src={notification.icon} alt="" style={{ width: 20, height: 20 }} /> : category.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          marginBottom: '0.25rem',
        }}>
          <h4 style={{
            fontSize: compact ? '0.82rem' : '0.9rem',
            fontWeight: 700,
            color: 'var(--color-heading)',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {notification.title}
          </h4>
          {notification.actionUrl && (
            <ExternalLink size={14} style={{ color: 'var(--color-body)', flexShrink: 0 }} />
          )}
        </div>

        <p style={{
          fontSize: compact ? '0.75rem' : '0.82rem',
          color: 'var(--color-body)',
          margin: 0,
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: compact ? 1 : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {notification.message}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '0.5rem',
          fontSize: '0.7rem',
          color: '#94A3B8',
        }}>
          <span style={{
            padding: '0.15rem 0.5rem',
            borderRadius: 999,
            backgroundColor: category.bg,
            color: category.color,
            fontWeight: 600,
            textTransform: 'capitalize',
          }}>
            {notification.category}
          </span>
          <span>•</span>
          <span>{formatTime(notification.createdAt || notification.sentAt)}</span>
        </div>
      </div>

      {showActions && !notification.isDeleted && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          flexShrink: 0,
        }}>
          {isUnread && (
            <button
              onClick={(e) => { e.stopPropagation(); onMarkRead?.(notification._id); }}
              title="Mark as read"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: 'none',
                backgroundColor: '#DCFCE7',
                color: '#059669',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-fast)',
              }}
            >
              <Check size={14} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(notification._id); }}
            title="Delete"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-fast)',
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
