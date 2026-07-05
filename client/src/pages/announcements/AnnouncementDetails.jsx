import React, { useMemo } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Calendar, Tag, Shield } from 'lucide-react';
import { getAnnouncementById } from '../../services/announcementsService';
import { useAuth } from '../../context/AuthContext';
import AnnouncementSkeleton from '../../components/announcements/AnnouncementSkeleton';
import AnnouncementEmptyState from '../../components/announcements/AnnouncementEmptyState';
import toast from 'react-hot-toast';

const priorityBorder = {
  low: '#94A3B8',
  medium: '#F59E0B',
  high: '#F97316',
  critical: '#EF4444',
};

const statusBackground = {
  draft: '#EFF6FF',
  scheduled: '#FEF3C7',
  published: '#F0FDF4',
  expired: '#F1F5F9',
  archived: '#FEF2F2',
};

const statusColor = {
  draft: '#2563EB',
  scheduled: '#D97706',
  published: '#059669',
  expired: '#64748B',
  archived: '#DC2626',
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

  if (!id) {
    return <Navigate to="/announcements" replace />;
  }

  if (isLoading) {
    return (
      <div style={{ padding: '2rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
        <div className="skeleton" style={{ height: 32, width: 180, borderRadius: 8, marginBottom: 16 }} />
        <AnnouncementSkeleton count={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem 1.5rem', maxWidth: 900, margin: '0 auto', color: 'var(--color-error)' }} role="alert">
        {error.message}
      </div>
    );
  }

  if (!announcement) {
    return (
      <div style={{ padding: '2rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
        <AnnouncementEmptyState
          title="Announcement not found"
          description="The announcement you're looking for doesn't exist or has been removed."
          onAction={() => navigate('/announcements')}
          actionLabel="Browse Announcements"
        />
      </div>
    );
  }

  const iconBorder = priorityBorder[announcement.priority] || priorityBorder.medium;
  const targetLabel = {
    all_users: 'All Users',
    volunteers: 'Volunteers',
    ngos: 'NGOs',
    admins: 'Admins',
    specific_users: 'Specific Users',
  }[announcement.targetAudience] || announcement.targetAudience;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '2rem 1.5rem', maxWidth: 900, margin: '0 auto', minHeight: '100vh' }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/announcements"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
        >
          <ArrowLeft size={16} aria-hidden="true" /> All Announcements
        </Link>
      </div>

      <article style={{ backgroundColor: 'var(--color-card)', borderRadius: 'var(--radius-xl)', border: `1px solid var(--color-border)`, borderLeft: `4px solid ${iconBorder}`, overflow: 'hidden' }}>
        {announcement.priority === 'critical' && (
          <div style={{ backgroundColor: '#FEF2F2', padding: '0.75rem 1.5rem', fontSize: '0.85rem', color: '#DC2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} aria-hidden="true" /> Critical Priority Announcement
          </div>
        )}

        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <span
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: 999,
                backgroundColor: '#F8FAFC',
                color: '#475569',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {announcement.type}
            </span>
            <span
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: 999,
                backgroundColor: priorityBorder[announcement.priority] ? `${priorityBorder[announcement.priority]}20` : '#F59E0B20',
                color: priorityBorder[announcement.priority] || '#D97706',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {announcement.priority}
            </span>
            <span
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: 999,
                backgroundColor: statusBackground[announcement.status] || '#EFF6FF',
                color: statusColor[announcement.status] || '#2563EB',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {announcement.status}
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-heading)', margin: '0 0 1rem', lineHeight: 1.3 }}>
            {announcement.title}
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--color-body)', lineHeight: 1.8, margin: 0 }}>
            {announcement.message}
          </p>

          <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--color-body)' }}>
            {announcement.scheduledAt && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} aria-hidden="true" />
                <strong>Scheduled:</strong> {formatDateTime(announcement.scheduledAt)}
              </span>
            )}
            {announcement.expiresAt && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} aria-hidden="true" />
                <strong>Expires:</strong> {formatDateTime(announcement.expiresAt)}
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} aria-hidden="true" />
              <strong>Target:</strong> {targetLabel}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={16} aria-hidden="true" />
              <strong>Published:</strong> {announcement.publishedAt ? formatDateTime(announcement.publishedAt) : 'Not yet published'}
            </span>
          </div>

          {isAdmin && (
            <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-body)', margin: '0 0 0.75rem', fontWeight: 600 }}>
                Admin Actions
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {announcement.status !== 'published' && (
                  <Link to={`/admin/announcements/${announcement._id || announcement.announcementId}/edit`} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                    Edit
                  </Link>
                )}
                {announcement.status !== 'published' && (
                  <button
                    onClick={async () => {
                      try {
                        const { publishAnnouncement } = await import('../../services/announcementsService');
                        const res = await publishAnnouncement(announcement._id || announcement.announcementId);
                        if (res.success) {
                          toast.success('Announcement published');
                          queryClient.invalidateQueries(['announcements']);
                        }
                      } catch (err) {
                        toast.error(err.message || 'Failed to publish');
                      }
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    Publish
                  </button>
                )}
                {announcement.status !== 'archived' && (
                  <button
                    onClick={async () => {
                      try {
                        const { archiveAnnouncement } = await import('../../services/announcementsService');
                        const res = await archiveAnnouncement(announcement._id || announcement.announcementId);
                        if (res.success) {
                          toast.success('Announcement archived');
                          queryClient.invalidateQueries(['announcements']);
                        }
                      } catch (err) {
                        toast.error(err.message || 'Failed to archive');
                      }
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    Archive
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
                    try {
                      const { deleteAnnouncement } = await import('../../services/announcementsService');
                      const res = await deleteAnnouncement(announcement._id || announcement.announcementId);
                      if (res.success) {
                        toast.success('Announcement deleted');
                        navigate('/announcements');
                      }
                    } catch (err) {
                      toast.error(err.message || 'Failed to delete');
                    }
                  }}
                  className="btn btn-danger"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </article>
    </motion.div>
  );
};

export default AnnouncementDetails;
