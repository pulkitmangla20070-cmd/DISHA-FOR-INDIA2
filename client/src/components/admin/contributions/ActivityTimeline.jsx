import React from 'react';
import { Clock, Send, ShieldCheck, CheckCircle2, Award, RefreshCw } from 'lucide-react';

const timelineStages = [
  { key: 'pending', label: 'Submitted', icon: Send, description: 'Contribution submitted for review' },
  { key: 'under_review', label: 'Under Review', icon: ShieldCheck, description: 'Admin is reviewing' },
  { key: 'approved', label: 'Approved', icon: CheckCircle2, description: 'Contribution approved' },
  { key: 'rejected', label: 'Rejected', icon: Clock, description: 'Contribution rejected' },
  { key: 'needs_changes', label: 'Needs Changes', icon: RefreshCw, description: 'Changes requested' },
  { key: 'archived', label: 'Archived', icon: Award, description: 'Contribution archived' },
];

const ActivityTimeline = ({ currentStatus, _history = [] }) => {
  const currentIndex = timelineStages.findIndex((s) => s.key === currentStatus);

  const getStageStatus = (index) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
        Activity Timeline
      </h4>
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '15px',
            top: '8px',
            bottom: '8px',
            width: 2,
            background: 'var(--color-border)',
          }}
        />
        {timelineStages.map((stage, index) => {
          const status = getStageStatus(index);
          const isCurrent = status === 'current';
          const isCompleted = status === 'completed';

          return (
            <div key={stage.key} style={{ position: 'relative', paddingBottom: '1.5rem' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '-2rem',
                  top: 0,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCurrent ? 'var(--color-primary)' : isCompleted ? 'var(--color-secondary)' : 'var(--color-card)',
                  border: `2px solid ${isCurrent ? 'var(--color-primary)' : isCompleted ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                  color: isCurrent || isCompleted ? '#fff' : 'var(--color-body)',
                  zIndex: 1,
                  transition: 'all 0.3s ease',
                }}
              >
                <stage.icon size={16} />
              </div>
              <div style={{ paddingLeft: '0.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isCurrent ? 'var(--color-primary)' : 'var(--color-heading)' }}>
                  {stage.label}
                  {isCurrent && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--color-body)' }}>Current</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-body)', marginTop: '0.15rem' }}>{stage.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;
