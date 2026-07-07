import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, Users, Clock, CheckCircle,
  AlertCircle, Loader, Tag, Globe, Award, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getProgramById } from '../../services/programsService';
import { submitApplication, getApplications } from '../../services/applicationsService';

const CATEGORY_COLORS = {
  Education: '#3b82f6',
  Environment: '#22c55e',
  Health: '#ef4444',
  Community: '#a855f7',
  'Animal Welfare': '#f59e0b',
  'Disaster Relief': '#f97316',
  Other: '#6b7280',
};

const MODE_ICONS = { online: '💻', offline: '📍', hybrid: '🔄' };

const StatusBadge = ({ status }) => {
  const map = {
    published:           { label: 'Open for Applications', color: '#22c55e', bg: '#dcfce7' },
    registration_closed: { label: 'Registration Closed',   color: '#f97316', bg: '#ffedd5' },
    ongoing:             { label: 'Currently Ongoing',     color: '#3b82f6', bg: '#dbeafe' },
    completed:           { label: 'Completed',             color: '#6b7280', bg: '#f3f4f6' },
    cancelled:           { label: 'Cancelled',             color: '#ef4444', bg: '#fee2e2' },
    draft:               { label: 'Draft',                 color: '#a855f7', bg: '#f3e8ff' },
  };
  const info = map[status] || { label: status, color: '#6b7280', bg: '#f3f4f6' };
  return (
    <span style={{
      padding: '0.4rem 1rem', borderRadius: '999px',
      fontSize: '0.85rem', fontWeight: 600,
      color: info.color, backgroundColor: info.bg,
    }}>
      {info.label}
    </span>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  value ? (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
      <Icon size={18} style={{ color: 'var(--color-body)', marginTop: '2px', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '0.78rem', color: 'var(--color-body)', fontWeight: 500, marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
        <div style={{ color: 'var(--color-heading)', fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  ) : null
);

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [existingApp, setExistingApp] = useState(null);
  const [checkingApp, setCheckingApp] = useState(true);

  // Motivation text for the application
  const [motivation, setMotivation] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    const loadProgram = async () => {
      try {
        const res = await getProgramById(id);
        const prog = res?.data?.program || res?.program || null;
        setProgram(prog);
      } catch (err) {
        toast.error(err.message || 'Failed to load program');
      } finally {
        setLoading(false);
      }
    };
    loadProgram();
  }, [id]);

  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!id) return;
      try {
        const res = await getApplications({ programId: id });
        const apps = (res?.data?.applications || res?.applications || []).filter(
          (app) => (app?.program?._id || app?.program)?.toString() === id
        );
        if (apps.length > 0) {
          setExistingApp(apps[0]);
        }
      } catch (_) {
        // ignore — volunteer just doesn't have a previous application
      } finally {
        setCheckingApp(false);
      }
    };
    checkExistingApplication();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!motivation.trim()) {
      toast.error('Please write a brief motivation before applying.');
      return;
    }
    setApplying(true);
    try {
      await submitApplication(id, { motivation });
      toast.success('🎉 Application submitted successfully!');
      setShowApplyForm(false);
      // Reload app check
      const res = await getApplications({ programId: id });
      const apps = (res?.data?.applications || res?.applications || []).filter(
        (app) => (app?.program?._id || app?.program)?.toString() === id
      );
      if (apps.length > 0) setExistingApp(apps[0]);
    } catch (err) {
      toast.error(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
        <p style={{ color: 'var(--color-body)' }}>Loading program details...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <AlertCircle size={48} style={{ color: 'var(--color-error)', marginBottom: '1rem' }} />
        <h2 style={{ color: 'var(--color-heading)' }}>Program not found</h2>
        <p style={{ color: 'var(--color-body)', marginBottom: '1.5rem' }}>
          This program may have been removed or doesn't exist.
        </p>
        <Link to="/opportunities" className="btn btn-primary">Browse All Programs</Link>
      </div>
    );
  }

  const accentColor = CATEGORY_COLORS[program.category] || '#6b7280';
  const location = [program.address, program.city, program.state].filter(Boolean).join(', ');
  const isAccepting = program.status === 'published';
  const isDeadlinePassed = program.registrationDeadline && new Date() > new Date(program.registrationDeadline);

  const canApply = isAccepting && !isDeadlinePassed && !existingApp && !checkingApp;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 0 3rem' }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Hero Banner */}
      <div style={{
        borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem',
        background: `linear-gradient(135deg, ${accentColor}20 0%, var(--color-card) 60%)`,
        border: '1px solid var(--color-border)',
        padding: '2.5rem',
        position: 'relative',
      }}>
        {/* Accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', backgroundColor: accentColor }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            {/* Category + Mode */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{
                padding: '0.3rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                backgroundColor: `${accentColor}20`, color: accentColor,
              }}>
                {program.category}
              </span>
              <span style={{ padding: '0.3rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 500, backgroundColor: 'var(--color-bg)', color: 'var(--color-body)', border: '1px solid var(--color-border)' }}>
                {MODE_ICONS[program.mode]} {program.mode?.charAt(0).toUpperCase() + program.mode?.slice(1)}
              </span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
              {program.title}
            </h1>

            {program.shortDescription && (
              <p style={{ fontSize: '1.05rem', color: 'var(--color-body)', maxWidth: '680px', lineHeight: 1.6 }}>
                {program.shortDescription}
              </p>
            )}
          </div>

          {/* Status */}
          <div style={{ flexShrink: 0 }}>
            <StatusBadge status={program.status} />
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          {program.startDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-body)' }}>
              <Calendar size={16} style={{ color: accentColor }} />
              <span>
                {new Date(program.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                {program.endDate && ` → ${new Date(program.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              </span>
            </div>
          )}
          {location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-body)' }}>
              <MapPin size={16} style={{ color: accentColor }} />
              <span>{location}</span>
            </div>
          )}
          {program.maxVolunteers && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-body)' }}>
              <Users size={16} style={{ color: accentColor }} />
              <span>Up to {program.maxVolunteers.toLocaleString()} volunteers</span>
            </div>
          )}
        </div>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

        {/* Left — Description */}
        <div>
          {/* Full description */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-heading)' }}>
              <FileText size={18} style={{ color: accentColor }} />
              About This Program
            </h2>
            <div style={{ color: 'var(--color-body)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
              {program.description || 'No description provided.'}
            </div>
          </div>

          {/* Tags */}
          {program.tags && program.tags.length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-heading)' }}>
                <Tag size={16} style={{ color: accentColor }} />
                Tags
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {program.tags.map((tag) => (
                  <span key={tag} style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', backgroundColor: 'var(--color-bg)', color: 'var(--color-body)', border: '1px solid var(--color-border)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply form inline */}
          {showApplyForm && (
            <div className="card" style={{ border: `2px solid ${accentColor}40`, marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-heading)' }}>
                ✍️ Your Application
              </h3>
              <form onSubmit={handleApply}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Why do you want to join this program? *</label>
                  <textarea
                    required
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="form-control"
                    rows={5}
                    placeholder="Share your motivation, relevant experience, and what you hope to achieve..."
                    maxLength={1000}
                  />
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-body)', marginTop: '0.3rem', textAlign: 'right' }}>
                    {motivation.length}/1000 characters
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={applying} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {applying ? (
                      <>
                        <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Submit Application
                      </>
                    )}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowApplyForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right — Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Apply CTA card */}
          <div className="card" style={{ border: canApply ? `2px solid ${accentColor}40` : '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-heading)' }}>
              {checkingApp ? 'Checking your status...' : existingApp ? '✅ Application Submitted' : 'Apply to This Program'}
            </h3>

            {checkingApp ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <Loader size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
              </div>
            ) : existingApp ? (
              <div>
                <p style={{ color: 'var(--color-body)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  You applied on {new Date(existingApp.appliedAt || existingApp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.
                </p>
                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Status: </span>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)', textTransform: 'capitalize' }}>{existingApp.status}</span>
                </div>
                <Link to="/applications" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', display: 'block', marginTop: '0.75rem' }}>
                  View My Applications
                </Link>
              </div>
            ) : !isAccepting ? (
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#fff3cd', color: '#856404', fontSize: '0.9rem' }}>
                ⚠️ This program is not currently accepting applications.
              </div>
            ) : isDeadlinePassed ? (
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#f8d7da', color: '#842029', fontSize: '0.9rem' }}>
                ⏰ The registration deadline has passed.
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--color-body)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                  Join this program and make a meaningful impact in your community.
                  {program.approvalRequired && (
                    <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.82rem', color: '#f97316' }}>
                      ⚠️ Applications require admin approval.
                    </span>
                  )}
                </p>
                {!showApplyForm && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowApplyForm(true)}
                    style={{ width: '100%', fontSize: '1rem', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Award size={18} />
                    Apply Now
                  </button>
                )}
              </>
            )}
          </div>

          {/* Program Details */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-heading)' }}>
              Program Details
            </h3>
            <InfoRow icon={Calendar} label="Start Date" value={program.startDate ? new Date(program.startDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : null} />
            <InfoRow icon={Calendar} label="End Date" value={program.endDate ? new Date(program.endDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : null} />
            <InfoRow icon={Clock} label="Registration Deadline" value={program.registrationDeadline ? new Date(program.registrationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'No deadline set'} />
            <InfoRow icon={Users} label="Max Volunteers" value={program.maxVolunteers ? program.maxVolunteers.toLocaleString() : 'Unlimited'} />
            <InfoRow icon={Globe} label="Mode" value={`${MODE_ICONS[program.mode]} ${program.mode?.charAt(0).toUpperCase() + program.mode?.slice(1)}`} />
            {location && <InfoRow icon={MapPin} label="Location" value={location} />}
          </div>

          {/* Organizer */}
          {program.createdBy && (
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-heading)' }}>
                Organizer
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: `${accentColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: accentColor }}>
                    {(program.createdBy.name || 'A')[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-heading)' }}>{program.createdBy.name || 'Admin'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-body)' }}>{program.createdBy.email || ''}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
