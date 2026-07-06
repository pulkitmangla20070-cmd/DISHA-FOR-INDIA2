import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createAnnouncement,
  updateAnnouncement,
} from '../../services/announcementsService';

const ANNOUNCEMENT_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'program', label: 'Program' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'event', label: 'Event' },
  { value: 'recruitment', label: 'Recruitment' },
  { value: 'system', label: 'System' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const TARGET_AUDIENCE_OPTIONS = [
  { value: 'all_users', label: 'All Users' },
  { value: 'volunteers', label: 'Volunteers' },
  { value: 'ngos', label: 'NGOs' },
  { value: 'admins', label: 'Admins' },
  { value: 'specific_users', label: 'Specific Users' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
];

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title cannot exceed 255 characters'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message cannot exceed 2000 characters'),
  type: z.string().min(1, 'Type is required'),
  priority: z.string().min(1, 'Priority is required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  scheduledAt: z.string().max(0, 'Invalid date').optional().or(z.literal('')),
  expiresAt: z.string().max(0, 'Invalid date').optional().or(z.literal('')),
  status: z.string().min(1, 'Status is required'),
});

const AnnouncementForm = ({ announcementId, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const isEdit = Boolean(announcementId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      message: '',
      type: 'general',
      priority: 'medium',
      targetAudience: 'all_users',
      scheduledAt: '',
      expiresAt: '',
      status: 'draft',
    },
  });

  useEffect(() => {
    if (!isEdit) return;
    const fetchAnnouncement = async () => {
      try {
        const res = await getAnnouncementById(announcementId);
        if (res.success) {
          const a = res.data?.announcement || res.data;
          reset({
            title: a.title || '',
            message: a.message || '',
            type: a.type || 'general',
            priority: a.priority || 'medium',
            targetAudience: a.targetAudience || 'all_users',
            scheduledAt: a.scheduledAt ? new Date(a.scheduledAt).toISOString().slice(0, 16) : '',
            expiresAt: a.expiresAt ? new Date(a.expiresAt).toISOString().slice(0, 16) : '',
            status: a.status || 'draft',
          });
          if (a.attachments) {
            setAttachments(Array.isArray(a.attachments) ? a.attachments : []);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load announcement details');
      }
    };
    fetchAnnouncement();
  }, [announcementId, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      const payload = {
        ...data,
        attachments: attachments.length > 0 ? attachments : [],
      };

      if (data.scheduledAt === '') payload.scheduledAt = undefined;
      if (data.expiresAt === '') payload.expiresAt = undefined;

      if (isEdit) {
        await updateAnnouncement(announcementId, payload);
        toast.success('Announcement updated successfully');
      } else {
        await createAnnouncement(payload);
        toast.success('Announcement created successfully');
      }

      queryClient.invalidateQueries(['announcements', 'admin-announcements']);
      onSuccess?.();
    } catch (err) {
      const msg = err.message || (isEdit ? 'Failed to update announcement' : 'Failed to create announcement');
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleAttachmentAdd = () => {
    const url = prompt('Enter attachment URL:');
    if (url && url.trim()) {
      const name = prompt('Enter attachment name:') || 'attachment';
      setAttachments((prev) => [...prev, { name: name.trim(), url: url.trim(), type: 'file', size: 0 }]);
    }
  };

  const handleAttachmentRemove = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '0.625rem 1rem',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${errors[field] ? 'var(--color-error)' : 'var(--color-border)'}`,
    fontSize: '0.95rem',
    color: 'var(--color-heading)',
    backgroundColor: 'var(--color-card)',
    outline: 'none',
    transition: 'var(--transition-fast)',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '860px', margin: '0 auto' }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-heading)', margin: 0 }}>
          {isEdit ? 'Edit Announcement' : 'Create Announcement'}
        </h1>
        <p style={{ color: 'var(--color-body)', margin: '0.25rem 0 0' }}>
          {isEdit ? 'Update announcement details and settings.' : 'Fill in the details below to broadcast a new announcement.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Title <span style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter announcement title"
              {...register('title')}
              style={inputStyle('title')}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'announcement-title-error' : undefined}
            />
            <AnimatePresence>
              {errors.title && (
                <motion.p
                  id="announcement-title-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ fontSize: '0.8rem', color: 'var(--color-error)', marginTop: '0.25rem' }}
                  role="alert"
                >
                  {errors.title.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Message <span style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <textarea
              placeholder="Enter announcement message"
              rows={5}
              {...register('message')}
              style={{ ...inputStyle('message'), resize: 'vertical', minHeight: '120px' }}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'announcement-message-error' : undefined}
            />
            <AnimatePresence>
              {errors.message && (
                <motion.p
                  id="announcement-message-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ fontSize: '0.8rem', color: 'var(--color-error)', marginTop: '0.25rem' }}
                  role="alert"
                >
                  {errors.message.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                Type <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <select {...register('type')} style={inputStyle('type')} aria-invalid={!!errors.type}>
                {ANNOUNCEMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                Priority <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <select {...register('priority')} style={inputStyle('priority')} aria-invalid={!!errors.priority}>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                Target Audience <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <select {...register('targetAudience')} style={inputStyle('targetAudience')} aria-invalid={!!errors.targetAudience}>
                {TARGET_AUDIENCE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {isEdit && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                  Status
                </label>
                <select {...register('status')} style={inputStyle('status')} aria-invalid={!!errors.status}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                Scheduled At (optional)
              </label>
              <input
                type="datetime-local"
                {...register('scheduledAt')}
                style={inputStyle('scheduledAt')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                Expires At (optional)
              </label>
              <input
                type="datetime-local"
                {...register('expiresAt')}
                style={inputStyle('expiresAt')}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Attachments
            </label>
            <button type="button" onClick={handleAttachmentAdd} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={16} /> Add Attachment
            </button>
            {attachments.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {attachments.map((att, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.9rem' }}>
                      <strong>{att.name}</strong> — <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>{att.url}</a>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAttachmentRemove(i)}
                      aria-label={`Remove attachment ${att.name}`}
                      style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isSubmitting || uploading}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={isSubmitting || uploading}>
            {uploading || isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="spinner" aria-hidden="true" /> Processing...
              </span>
            ) : isEdit ? 'Update Announcement' : 'Create Announcement'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AnnouncementForm;
