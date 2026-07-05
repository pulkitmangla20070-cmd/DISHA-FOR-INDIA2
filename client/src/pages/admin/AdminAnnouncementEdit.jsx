import React from 'react';
import { useParams } from 'react-router-dom';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';

const AdminEditAnnouncement = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 900, margin: '0 auto', minHeight: '100vh' }}>
      <AnnouncementForm announcementId={id} onSuccess={() => window.location.href = '/admin/announcements'} />
    </div>
  );
};

export default AdminEditAnnouncement;
