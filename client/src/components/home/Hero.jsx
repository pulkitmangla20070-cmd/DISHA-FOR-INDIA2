import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Play, ShieldCheck, Award, TrendingUp, Star, Users, MapPin, Briefcase } from 'lucide-react';

const statPills = [
  { icon: <Users size={16} />, value: '100K+', label: 'Lives Impacted', color: '#D35400', bg: 'rgba(211,84,0,0.15)' },
  { icon: <Heart size={16} />, value: '10K+', label: 'Active Volunteers', color: '#059669', bg: 'rgba(5,150,105,0.15)' },
  { icon: <Briefcase size={16} />, value: '500+', label: 'Programs', color: '#7C3AED', bg: 'rgba(124,58,237,0.15)' },
  { icon: <MapPin size={16} />, value: '18', label: 'States Reached', color: '#0284C7', bg: 'rgba(2,132,199,0.15)' },
  { icon: <Award size={16} />, value: '50+', label: 'Partner NGOs', color: '#D97706', bg: 'rgba(217,119,6,0.15)' },
];

const floatingBadges = [
  {
    icon: <ShieldCheck size={20} color="#059669" />,
    title: 'Verified NGOs',
    sub: '100% Verified',
    bg: 'white',
    top: '12%', right: '-20px',
  },
  {
    icon: <Award size={20} color="#7C3AED" />,
    title: 'Verified Certificates',
    sub: 'Blockchain Secured',
    bg: 'white',
    top: '42%', right: '-30px',
  },
  {
    icon: <TrendingUp size={20} color="#0284C7" />,
    title: 'Career Growth',
    sub: 'Skills · Leadership · Portfolio',
    bg: 'white',
    top: '68%', right: '-10px',
  },
];

const Hero = () => {
  return (
    <section style={{
      background: 'linear-gradient(170deg, #0f172a 0%, #1e293b 40%, #1e3a5f 70%, #0f172a 100%)',
      paddingTop: '0',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Subtle radial glow behind content */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(211,84,0,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '7rem 1.5rem 3rem', width: '100%', position: 'relative', zIndex: 1 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>

          {/* ── LEFT CONTENT ── */}
          <div style={{ flex: '1 1 480px', maxWidth: 580 }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.375rem 0.875rem', background: 'rgba(211,84,0,0.2)', borderRadius: 999, marginBottom: '1.5rem' }}>
                <Heart size={14} color="#E67E22" fill="#E67E22" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E67E22', letterSpacing: '0.02em' }}>Join the Movement for Change</span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.15, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>
                Transforming Lives,
              </h1>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', fontWeight: 800, color: '#E67E22', lineHeight: 1.15, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', letterSpacing: '-0.04em' }}>
                Building Futures.
                <Heart size={36} color="#E67E22" fill="#E67E22" style={{ display: 'inline', verticalAlign: 'middle' }} />
              </h1>

              <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.75, marginBottom: '2rem', maxWidth: 480, fontWeight: 500 }}>
                Disha for India connects passionate volunteers with verified NGOs
                to <strong style={{ color: '#E2E8F0', fontWeight: 700 }}>create meaningful impact</strong> and{' '}
                <strong style={{ color: '#E2E8F0', fontWeight: 700 }}>build a better tomorrow.</strong>
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}
            >
              <Link
                to="/register"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.75rem 1.5rem', borderRadius: 10, background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: 'var(--shadow-glow)', transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), background 0.32s cubic-bezier(0.16, 1, 0.3, 1)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'scale(0.98)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <Users size={16} /> Become a Volunteer
              </Link>
              <Link
                to="/programs"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.75rem 1.25rem', borderRadius: 10, background: 'rgba(255,255,255,0.08)', color: '#E2E8F0', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.15)', transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)', backdropFilter: 'blur(4px)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = '#E67E22'; e.currentTarget.style.transform = 'scale(0.98)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#E2E8F0'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <ArrowRight size={16} /> Explore Programs
              </Link>
              <Link
                to="/donate"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.75rem 1.25rem', borderRadius: 10, background: 'rgba(255,255,255,0.08)', color: '#E2E8F0', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.15)', transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)', backdropFilter: 'blur(4px)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'scale(0.98)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <Heart size={16} /> Donate Now
              </Link>
              <button
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.75rem 1.25rem', borderRadius: 10, background: 'rgba(255,255,255,0.08)', color: '#E2E8F0', fontWeight: 700, fontSize: '0.9rem', border: '1.5px solid rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)', backdropFilter: 'blur(4px)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'scale(0.98)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <Play size={16} fill="currentColor" /> Watch Story
              </button>
            </motion.div>

            {/* Stat Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
            >
              {statPills.map((pill, i) => (
                <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.875rem', borderRadius: 999, background: pill.bg, color: pill.color, border: `1px solid ${pill.color}33` }}>
                  {pill.icon}
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{pill.value}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 500, opacity: 0.85 }}>{pill.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT IMAGE ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ flex: '1 1 400px', position: 'relative', maxWidth: 560, minHeight: 480 }}
          >
            <div style={{ borderRadius: '2rem', overflow: 'hidden', aspectRatio: '4/3', boxShadow: 'var(--shadow-xl)' }}>
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200"
                alt="DFI volunteers creating community impact"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="eager"
              />
            </div>

            {/* Floating badges */}
            {floatingBadges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute', top: badge.top, right: badge.right,
                  background: badge.bg, borderRadius: 12, padding: '0.625rem 0.875rem',
                  boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: 10,
                  backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.8)',
                  minWidth: 180, zIndex: 10,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {badge.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#111827', lineHeight: 1.2 }}>{badge.title}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6B7280', lineHeight: 1.2, marginTop: 2 }}>{badge.sub}</div>
                </div>
              </motion.div>
            ))}

            {/* Bottom right banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute', bottom: '-16px', left: '10%',
                background: '#1F2937', borderRadius: 14, padding: '0.75rem 1.25rem',
                display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={18} color="white" fill="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'white' }}>Your Impact Matters</div>
                <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Track · Learn · Grow</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
