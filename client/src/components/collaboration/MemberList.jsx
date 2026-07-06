import React from 'react';
import { Crown } from 'lucide-react';

const MemberList = ({ members }) => {
  if (!members || members.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-body)' }}>
        No members yet
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {members.map((member, idx) => (
        <div key={member.userId?._id || member.userId || idx} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            flexShrink: 0
          }}>
            {(member.userId?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: 'var(--color-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {member.userId?.name || 'Unknown User'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-body)' }}>
              {member.userId?.email || ''}
            </div>
          </div>
          <span className={`badge ${member.role === 'admin' ? 'badge-purple' : 'badge-blue'}`} style={{ textTransform: 'capitalize' }}>
            {member.role === 'admin' && <Crown size={12} style={{ marginRight: '0.25rem' }} aria-hidden="true" />}
            {member.role}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
