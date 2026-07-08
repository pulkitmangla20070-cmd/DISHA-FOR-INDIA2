import React from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { Bell, Check, Trash2, MailOpen } from 'lucide-react';

const AdminNotifications = () => {
  const { notifications, updateNotificationRead, deleteNotification } = useAdminData();

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-heading)' }}>Admin Notifications</h1>
        <p style={{ color: 'var(--color-body)' }}>Manage system alerts and updates.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px' }}>
        {notifications.length === 0 ? (
          <p style={{ color: '#64748b' }}>No notifications found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map((notif) => (
              <div key={notif.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: notif.read ? '#f8fafc' : '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: notif.type === 'success' ? '#dcfce7' : '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell size={20} color={notif.type === 'success' ? '#16a34a' : '#4f46e5'} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>{notif.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>{notif.message}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!notif.read && (
                    <button className="btn btn-secondary" onClick={() => updateNotificationRead(notif.id, true)}>
                      <Check size={16} /> Mark Read
                    </button>
                  )}
                  {notif.read && (
                    <button className="btn btn-secondary" onClick={() => updateNotificationRead(notif.id, false)}>
                      <MailOpen size={16} /> Mark Unread
                    </button>
                  )}
                  <button className="btn btn-secondary" style={{ color: '#ef4444' }} onClick={() => deleteNotification(notif.id)}>
                    <Trash2 size={16} />
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

export default AdminNotifications;
