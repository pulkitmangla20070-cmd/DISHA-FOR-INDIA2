import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Shield, RefreshCw, AlertCircle } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import AnnouncementFilters from '../../components/announcements/AnnouncementFilters';
import AnnouncementSkeleton from '../../components/announcements/AnnouncementSkeleton';
import AnnouncementEmptyState from '../../components/announcements/AnnouncementEmptyState';
import AnnouncementPagination from '../../components/announcements/AnnouncementPagination';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';

const PAGE_SIZE = 9;

const AdminAnnouncementDashboard = () => {
  const navigate = useNavigate();
  const { announcements, deleteAnnouncement: deleteAnn, updateAnnouncement } = useAdminData();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filter announcements locally
  const filteredAnnouncements = announcements.filter(ann => {
    let match = true;
    if (search && !ann.title.toLowerCase().includes(search.toLowerCase())) match = false;
    if (type && ann.type !== type) match = false;
    if (status && ann.status !== status) match = false;
    return match;
  });

  const total = filteredAnnouncements.length;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const paginatedAnnouncements = filteredAnnouncements.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      setDeleting(true);
      if (confirmDelete) {
        deleteAnn(confirmDelete);
        toast.success('Announcement deleted successfully');
        setConfirmDelete(null);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete announcement');
    } finally {
      setDeleting(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      updateAnnouncement(id, { status: 'published' });
      toast.success('Announcement published');
    } catch (err) { toast.error('Failed to publish'); }
  };

  const handleArchive = async (id) => {
    try {
      updateAnnouncement(id, { status: 'archived' });
      toast.success('Announcement archived');
    } catch (err) { toast.error('Failed to archive'); }
  };

  const handleClearFilters = () => {
    setSearch('');
    setType('');
    setPriority('');
    setStatus('');
  };

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 1240, margin: '0 auto', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Shield size={20} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Admin Panel</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--color-heading)', margin: '0 0 0.35rem' }}>Announcement Management</h1>
          <p style={{ color: 'var(--color-body)', margin: 0, fontSize: '0.9rem' }}>Create, publish, and manage all platform announcements.</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/admin/announcements/create')}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} aria-hidden="true" /> Create Announcement
        </motion.button>
      </div>

      <AnnouncementFilters search={search} onSearchChange={setSearch} type={type} onTypeChange={setType} priority={priority} onPriorityChange={setPriority} status={status} onStatusChange={setStatus} showAdminFilters={true} onClear={handleClearFilters} />

      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 1.25rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', color: 'var(--color-error)', marginBottom: '1.5rem' }} role="alert">
          <AlertCircle size={18} aria-hidden="true" /> {error}
        </motion.div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => {}} disabled={false} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} aria-label="Refresh announcements">
          <RefreshCw size={16} aria-hidden="true" /> Refresh
        </motion.button>
      </div>

      {false ? (
        <AnnouncementSkeleton count={PAGE_SIZE} />
      ) : paginatedAnnouncements.length === 0 ? (
        <AnnouncementEmptyState title="No announcements found" description="Create your first announcement to broadcast important updates to your users." onAction={() => navigate('/admin/announcements/create')} actionLabel="Create Announcement" />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {paginatedAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement._id || announcement.announcementId} announcement={announcement} onClick={() => navigate(`/announcements/${announcement._id || announcement.announcementId}`)} onPublish={handlePublish} onArchive={handleArchive} onDelete={(id) => setConfirmDelete(id)} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <AnnouncementPagination currentPage={page} totalPages={totalPages} totalItems={total} itemsPerPage={PAGE_SIZE} onPageChange={(newPage) => { setPage(newPage); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </div>
          )}
        </>
      )}

      <ConfirmModal isOpen={Boolean(confirmDelete)} title="Delete Announcement" message="Are you sure you want to permanently delete this announcement? This action cannot be undone." onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
};

export default AdminAnnouncementDashboard;
