import React from 'react';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';

const AdminCreateAnnouncement = () => {
  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 900, margin: '0 auto', minHeight: '100vh' }}>
      <AnnouncementForm onSuccess={() => window.location.href = '/admin/announcements'} />
    </div>
  );
};

export default AdminCreateAnnouncement;
