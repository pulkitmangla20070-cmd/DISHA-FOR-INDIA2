import React from 'react';
import { Users, FileText, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkspaceCard = ({ workspace, onJoin, onLeave, isMember, isCreator }) => {
  const memberCount = workspace.members?.length || 0;
  const noteCount = workspace.sharedNotes?.length || 0;
  const taskCount = workspace.taskAssignments?.length || 0;

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-heading)' }}>
          {workspace.name}
        </h3>
        <p style={{ color: 'var(--color-body)', fontSize: '0.9rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {workspace.description || 'No description provided'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--color-body)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Users size={16} aria-hidden="true" />
          <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <FileText size={16} aria-hidden="true" />
          <span>{noteCount} note{noteCount !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MessageSquare size={16} aria-hidden="true" />
          <span>{taskCount} task{taskCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to={`/collaboration/workspaces/${workspace._id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
          Open
        </Link>
        {isMember && !isCreator && (
          <button onClick={() => onLeave(workspace._id)} className="btn btn-secondary" style={{ flex: 1 }}>
            Leave
          </button>
        )}
        {!isMember && (
          <button onClick={() => onJoin(workspace._id)} className="btn btn-success" style={{ flex: 1 }}>
            Join
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkspaceCard;
