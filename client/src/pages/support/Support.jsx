import React from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { HelpCircle, Check, X } from 'lucide-react';

const Support = () => {
  const { supportTickets, updateTicketStatus } = useAdminData();

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-heading)' }}>Support Tickets</h1>
        <p style={{ color: 'var(--color-body)' }}>Manage and reply to support cases.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px' }}>
        {supportTickets.length === 0 ? (
          <p style={{ color: '#64748b' }}>No support tickets available.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {supportTickets.map((ticket) => (
              <div key={ticket.id} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: ticket.status === 'closed' ? '#f8fafc' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <HelpCircle size={16} /> {ticket.userName}
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', background: ticket.status === 'closed' ? '#e2e8f0' : '#fef3c7', color: ticket.status === 'closed' ? '#475569' : '#d97706', fontWeight: 600, textTransform: 'capitalize' }}>
                    {ticket.status}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#334155' }}>{ticket.subject}</h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#64748b' }}>{ticket.latestMessage}</p>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Reply</button>
                  {ticket.status !== 'closed' && (
                    <button className="btn btn-secondary" onClick={() => updateTicketStatus(ticket.id, 'closed')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                      <Check size={16} /> Close Ticket
                    </button>
                  )}
                  {ticket.status === 'closed' && (
                    <button className="btn btn-secondary" onClick={() => updateTicketStatus(ticket.id, 'open')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                      <X size={16} /> Reopen Ticket
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
