import React from 'react';
import { Activity } from 'lucide-react';

const ActivityFeed = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-body)' }}>
        No activity yet
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {activities.map((activity, idx) => (
        <div key={idx} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(211, 84, 0, 0.1)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '0.125rem'
          }}>
            <Activity size={16} aria-hidden="true" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--color-heading)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {activity.action}
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-body)', marginTop: '0.25rem' }}>
              {new Date(activity.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
