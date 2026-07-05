import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Shield, RefreshCw, AlertCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAnnouncements, deleteAnnouncement, archiveAnnouncement, publishAnnouncement } from '../../services/announcementsService';
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
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const params = useMemo(() => {
    const p = { page, limit: PAGE_SIZE, sortBy: 'createdAt', order: 'desc' };
    if (search) p.search = search;
    if (type) p.type = type;
    if (priority) p.priority = priority;
    if (status) p.status = status;
    return p;
  }, [page, search, type, priority, status]);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-announcements', params],
    queryFn: async () => {
      setError(null);
      const res = await getAnnouncements(params);
      if (res.success) {
        return {
          announcements: res.data?.announcements || [],
          total: res.data?.pagination?.total || 0,
          page: res.data?.pagination?.page || 1,
          totalPages: res.data?.pagination?.totalPages || 1,
        };
      }
      throw new Error(res.message || 'Failed to load announcements');
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const announcements = data?.announcements || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      setDeleting(true);
      const res = await deleteAnnouncement(confirmDelete);
      if (res.success) {
        toast.success('Announcement deleted successfully');
        setConfirmDelete(null);
        queryClient.invalidateQueries(['admin-announcements']);
        queryClient.invalidateQueries(['announcements']);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete announcement');
    } finally {
      setDeleting(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      const res = await publishAnnouncement(id);
      if (res.success) {
        toast.success('Announcement published');
        queryClient.invalidateQueries(['admin-announcements']);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to publish');
    }
  };

  const handleArchive = async (id) => {
    try {
      const res = await archiveAnnouncement(id);
      if (res.success) {
        toast.success('Announcement archived');
        queryClient.invalidateQueries(['admin-announcements']);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to archive');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setType('');
    setPriority('');
    setStatus('');
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Shield size={20} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-heading)', margin: '0 0 0.5rem' }}>Announcement Management</h1>
          <p style={{ color: 'var(--color-body)', margin: 0 }}>Create, publish, and manage all platform announcements.</p>
        </div>
        <button onClick={() => navigate('/admin/announcements/create')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Create Announcement
        </button>
      </div>

      <AnnouncementFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        priority={priority}
        onPriorityChange={setPriority}
        status={status}
        onStatusChange={setStatus}
        showAdminFilters={true}
        onClear={handleClearFilters}
      />

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', color: 'var(--color-error)', marginBottom: '1.5rem' }} role="alert">
          <AlertCircle size={16} aria-hidden="true" /> {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          aria-label="Refresh announcements"
        >
          <RefreshCw size={16} style={isFetching ? { animation: 'spin 1s linear infinite' } : {}} aria-hidden="true" /> Refresh
        </button>
      </div>

      {isLoading ? (
        <AnnouncementSkeleton count={PAGE_SIZE} />
      ) : announcements.length === 0 ? (
        <AnnouncementEmptyState
          title="No announcements found"
          description="Create your first announcement to broadcast important updates to your users."
          onAction={() => navigate('/admin/announcements/create')}
          actionLabel="Create Announcement"
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement._id || announcement.announcementId}
              announcement={announcement}
              onClick={() => navigate(`/announcements/${announcement._id || announcement.announcementId}`)}
              onPublish={handlePublish}
              onArchive={handleArchive}
              onDelete={(id) => setConfirmDelete(id)}
            />
          ))}
        </div>
      )}

      <AnnouncementPagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        itemsPerPage={PAGE_SIZE}
        onPageChange={(newPage) => {
          setPage(newPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <ConfirmModal
        isOpen={Boolean(confirmDelete)}
        title="Delete Announcement"
        message="Are you sure you want to permanently delete this announcement? This action cannot be undone."
        onCancel={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
};

export default AdminAnnouncementDashboard;
