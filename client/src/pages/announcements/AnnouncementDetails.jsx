import React from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Calendar, Tag, Shield, Edit3, Send, Archive, Trash2 } from 'lucide-react';
import { getAnnouncementById, publishAnnouncement, archiveAnnouncement, deleteAnnouncement } from '../../services/announcementsService';
import { useAuth } from '../../context/AuthContext';
import AnnouncementSkeleton from '../../components/announcements/AnnouncementSkeleton';
import AnnouncementEmptyState from '../../components/announcements/AnnouncementEmptyState';
import toast from 'react-hot-toast';

const priorityConfig = {
  low:      { border: '#94A3B8', bg: '#F8FAFC', color: '#475569' },
  medium:   { border: '#F59E0B', bg: '#FEF3C7', color: '#92400E' },
  high:     { border: '#F97316', bg: '#FFF7ED', color: '#9A3412' },
  critical: { border: '#EF4444', bg: '#FEF2F2', color: '#991B1B' },
};

const statusConfig = {
  draft:     { bg: '#EFF6FF', color: '#2563EB', label: 'Draft' },
  scheduled: { bg: '#FEF3C7', color: '#D97706', label: 'Scheduled' },
  published: { bg: '#F0FDF4', color: '#059669', label: 'Published' },
  expired:   { bg: '#FFF7ED', color: '#9A3412', label: 'Expired' },
  archived:  { bg: '#F1F5F9', color: '#64748B', label: 'Archived' },
};

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const AnnouncementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'COORDINATOR'].includes(user?.role?.toUpperCase());

  const { data, isLoading, error } = useQuery({
    queryKey: ['announcement', id],
    queryFn: async () => {
      const res = await getAnnouncementById(id);
      if (res.success) return res.data?.announcement || res.data;
      throw new Error(res.message || 'Failed to load announcement');
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    enabled: Boolean(id),
  });

  const announcement = data;

  if (!id) return <Navigate to="/announcements" replace />;

  if (isLoading) {
    return (
      <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 960, margin: '0 auto' }}>
        <div className="skeleton" style={{ height: 32, width: 200, borderRadius: 8, marginBottom: 16 }} />
        <AnnouncementSkeleton count={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 960, margin: '0 auto', color: 'var(--color-error)' }} role="alert">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={18} /> {error.message}
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 960, margin: '0 auto' }}>
        <AnnouncementEmptyState title="Announcement not found" description="The announcement you're looking for doesn't exist or has been removed." onAction={() => navigate('/announcements')} actionLabel="Browse Announcements" />
      </div>
    );
  }

  const p = priorityConfig[announcement.priority] || priorityConfig.medium;
  const s = statusConfig[announcement.status] || statusConfig.draft;
  const targetLabel = { all_users: 'All Users', volunteers: 'Volunteers', ngos: 'NGOs', admins: 'Admins', specific_users: 'Specific Users' }[announcement.targetAudience] || announcement.targetAudience;

  const handlePublish = async () => {
    try {
      const res = await publishAnnouncement(announcement._id || announcement.announcementId);
      if (res.success) { toast.success('Announcement published'); queryClient.invalidateQueries(['announcements']); }
    } catch (err) { toast.error(err.message || 'Failed to publish'); }
  };
  const handleArchive = async () => {
    try {
      const res = await archiveAnnouncement(announcement._id || announcement.announcementId);
      if (res.success) { toast.success('Announcement archived'); queryClient.invalidateQueries(['announcements']); }
    } catch (err) { toast.error(err.message || 'Failed to archive'); }
  };
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await deleteAnnouncement(announcement._id || announcement.announcementId);
      if (res.success) { toast.success('Announcement deleted'); navigate('/announcements'); }
    } catch (err) { toast.error(err.message || 'Failed to delete'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 960, margin: '0 auto', minHeight: '100vh' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/announcements" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
          <ArrowLeft size={16} aria-hidden="true" /> All Announcements
        </Link>
      </div>

      <article style={{ backgroundColor: 'var(--color-card)', borderRadius: 'var(--radius-xl)', border: `1px solid var(--color-border)`, borderLeft: `4px solid ${p.border}`, overflow: 'hidden' }}>
        {announcement.priority === 'critical' && (
          <div style={{ backgroundColor: '#FEF2F2', padding: '0.75rem 1.5rem', fontSize: '0.85rem', color: '#DC2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} aria-hidden="true" /> Critical Priority Announcement
          </div>
        )}

        <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, backgroundColor: '#F8FAFC', color: '#475569', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
              {announcement.type}
            </span>
            <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, backgroundColor: `${p.border}18`, color: p.color, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Tag size={11} aria-hidden="true" /> {announcement.priority}
            </span>
            <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, backgroundColor: s.bg, color: s.color, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
              {s.label}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--color-heading)', margin: '0 0 1rem', lineHeight: 1.35 }}>
            {announcement.title}
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--color-body)', lineHeight: 1.8, margin: 0 }}>
            {announcement.message}
          </p>

          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-body)' }}>
            {announcement.scheduledAt && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={15} aria-hidden="true" /> <strong>Scheduled:</strong> {formatDateTime(announcement.scheduledAt)}
              </span>
            )}
            {announcement.expiresAt && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={15} aria-hidden="true" /> <strong>Expires:</strong> {formatDateTime(announcement.expiresAt)}
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={15} aria-hidden="true" /> <strong>Target:</strong> {targetLabel}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={15} aria-hidden="true" /> <strong>Published:</strong> {announcement.publishedAt ? formatDateTime(announcement.publishedAt) : 'Not yet published'}
            </span>
          </div>

          {isAdmin && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-body)', margin: '0 0 0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Admin Actions
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to={`/admin/announcements/${announcement._id || announcement.announcementId}/edit`} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Edit3 size={15} aria-hidden="true" /> Edit
                </Link>
                {announcement.status !== 'published' && (
                  <button onClick={handlePublish} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Send size={15} aria-hidden="true" /> Publish
                  </button>
                )}
                {announcement.status !== 'archived' && (
                  <button onClick={handleArchive} className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Archive size={15} aria-hidden="true" /> Archive
                  </button>
                )}
                <button onClick={handleDelete} className="btn btn-danger" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Trash2 size={15} aria-hidden="true" /> Delete
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </article>
    </motion.div>
  );
};

export default AnnouncementDetails;
