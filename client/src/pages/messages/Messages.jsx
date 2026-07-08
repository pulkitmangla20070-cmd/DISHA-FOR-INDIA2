import React from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { MessageSquare, Reply, Trash2, CheckCircle } from 'lucide-react';

const Messages = () => {
  const { messages, updateMessageRead, deleteMessage } = useAdminData();

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-heading)' }}>Messages</h1>
        <p style={{ color: 'var(--color-body)' }}>User messages and inquiries.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px' }}>
        {messages.length === 0 ? (
          <p style={{ color: '#64748b' }}>No messages available.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: msg.read ? '#f8fafc' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <MessageSquare size={16} /> {msg.senderName} 
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: '#e2e8f0', color: '#475569' }}>
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#334155' }}>{msg.subject}</h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#64748b' }}>{msg.content}</p>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <Reply size={16} /> Reply
                  </button>
                  {!msg.read && (
                    <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }} onClick={() => updateMessageRead(msg.id, true)}>
                      <CheckCircle size={16} /> Mark Read
                    </button>
                  )}
                  <button className="btn btn-secondary" style={{ color: '#ef4444', padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }} onClick={() => deleteMessage(msg.id)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
