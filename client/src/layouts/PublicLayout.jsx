import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield, LogOut, Menu, X, Heart, Mail,
  Search, Bell, ChevronDown, User,
  Link2, MessageCircle, PlayCircle as YtIcon, Code2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PublicLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 60);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  const isHomePage = location.pathname === '/';

  const solidNav = isHomePage ? isScrolled : true;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsScrolled(window.scrollY > 60);
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/programs' },
    { name: 'Contributions', path: '/contributions' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'About', path: '/about' },
  ];

  // Roles are stored in lowercase on server, normalize for comparison
  const adminRoles = ['admin', 'superadmin', 'coordinator'];
  const dashboardPath = user && adminRoles.includes(user?.role?.toLowerCase()) ? '/admin/dashboard' : '/dashboard';

  const linkColor = solidNav ? 'var(--color-heading)' : 'rgba(255,255,255,0.92)';
  const linkHoverBg = solidNav ? '#F5F3EF' : 'rgba(255,255,255,0.12)';

  return (
    <div style={{ fontFamily: 'var(--font-primary)', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* ─────────────── HEADER ─────────────── */}
      <header
        style={{
          position: 'fixed',
          width: '100%',
          top: 0,
          zIndex: 100,
          backgroundColor: solidNav ? 'rgba(255,255,255,0.92)' : 'transparent',
          borderBottom: solidNav ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
          boxShadow: solidNav ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
          backdropFilter: solidNav ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: solidNav ? 'blur(16px)' : 'none',
          transition: 'background-color 0.23s ease-in-out, border-color 0.23s ease-in-out, backdrop-filter 0.23s ease-in-out',
          height: '68px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '100%', padding: '0 1.5rem', gap: '1.5rem' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color="white" />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', color: solidNav ? 'var(--color-heading)' : '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1 }}>
                DISHA
              </span>
              <span style={{ display: 'block', fontSize: '0.55rem', fontWeight: 600, color: solidNav ? 'var(--color-primary)' : 'rgba(255,255,255,0.85)', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
                for India
              </span>
            </div>
          </Link>

          {/* Desktop Nav — hidden on mobile via CSS class */}
          <nav className="pl-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: 1 }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: 8,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: isActive ? 'var(--color-primary)' : linkColor,
                    backgroundColor: isActive ? (solidNav ? 'rgba(211,84,0,0.08)' : 'rgba(255,255,255,0.12)') : 'transparent',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = linkHoverBg; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions — hidden on mobile via CSS class */}
          <div className="pl-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>

            {/* Search */}
            <AnimatePresence>
              {searchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', backgroundColor: solidNav ? '#F5F3EF' : 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '0.35rem 0.75rem', gap: '0.5rem' }}
                >
                  <Search size={15} style={{ color: solidNav ? 'var(--color-body)' : 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.8rem', color: solidNav ? 'var(--color-heading)' : 'white', width: '100%' }}
                    onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                  />
                  <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                    <X size={14} style={{ color: solidNav ? 'var(--color-body)' : 'rgba(255,255,255,0.7)' }} />
                  </button>
                </motion.div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: linkColor, transition: 'background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = linkHoverBg; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              )}
            </AnimatePresence>

            {user && (
              <Link
                to="/notifications"
                style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: linkColor, position: 'relative', transition: 'background 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = linkHoverBg; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: 'var(--color-error)', border: '2px solid white' }} />
              </Link>
            )}

            <div style={{ width: 1, height: 20, background: solidNav ? '#E8E3D9' : 'rgba(255,255,255,0.2)', margin: '0 0.25rem' }} />

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  to={dashboardPath}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.65rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, color: linkColor, textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = linkHoverBg; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={13} color="white" />
                  </div>
                  <span className="pl-hide-mobile-text">Hi, {(user?.name || 'User').split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: 8, border: '1px solid #FCA5A5', background: 'rgba(239,68,68,0.06)', color: '#DC2626', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                >
                  <LogOut size={13} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  to="/login"
                  style={{ padding: '0.4rem 0.85rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, color: linkColor, textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = linkHoverBg; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Sign In
                </Link>
                <Link
                  to="/dashboard"
                  style={{ padding: '0.45rem 1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, background: 'var(--color-primary)', color: 'white', textDecoration: 'none', boxShadow: '0 2px 8px rgba(211,84,0,0.3)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'none'; }}
                >
                  Dashboard
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger — visible only on mobile via CSS class */}
          <button
            className="pl-mobile-toggle"
            style={{ display: 'none', marginLeft: 'auto', width: 40, height: 40, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', color: linkColor }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              style={{ position: 'fixed', inset: 0, top: 0, background: 'var(--color-card)', zIndex: 200, display: 'flex', flexDirection: 'column', paddingTop: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingBottom: '2rem', overflowY: 'auto' }}
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: 40, height: 40, borderRadius: 8, border: 'none', background: '#F5F3EF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} />
              </button>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '2rem' }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{ padding: '0.875rem 1rem', borderRadius: 10, fontSize: '1.1rem', fontWeight: 700, color: location.pathname === link.path ? 'var(--color-primary)' : 'var(--color-heading)', textDecoration: 'none', background: location.pathname === link.path ? 'rgba(211,84,0,0.08)' : 'transparent', fontFamily: 'var(--font-heading)' }}
                  >
                    {link.name}
                  </Link>
                ))}
                {user && (
                  <Link to={dashboardPath} style={{ padding: '0.875rem 1rem', borderRadius: 10, fontSize: '1.1rem', fontWeight: 700, color: location.pathname === dashboardPath ? 'var(--color-primary)' : 'var(--color-heading)', textDecoration: 'none', background: location.pathname === dashboardPath ? 'rgba(211,84,0,0.08)' : 'transparent', fontFamily: 'var(--font-heading)' }}>
                    Dashboard
                  </Link>
                )}
              </nav>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {user ? (
                  <button
                    onClick={handleLogout}
                    style={{ padding: '0.875rem', borderRadius: 10, border: '1px solid #FCA5A5', background: 'rgba(239,68,68,0.06)', color: '#DC2626', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <LogOut size={18} /> Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" style={{ padding: '0.875rem', borderRadius: 10, border: '1px solid #E8E3D9', background: 'white', color: 'var(--color-heading)', fontSize: '1rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                      Sign In
                    </Link>
                    <Link to="/register" style={{ padding: '0.875rem', borderRadius: 10, background: 'var(--color-primary)', color: 'white', fontSize: '1rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Heart size={18} /> Become a Volunteer
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: isHomePage ? 0 : '68px' }}>
        <Outlet />
      </main>

      {/* ─────────────── FOOTER ─────────────── */}
      <footer style={{ background: '#111827', color: '#9CA3AF', fontFamily: 'var(--font-primary)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid #1F2937' }}>
            <div style={{ gridColumn: 'span 1' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={20} color="white" />
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: 'white' }}>DISHA</span>
              </Link>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#6B7280', marginBottom: '1.5rem', maxWidth: 260 }}>
                Empowering communities through verifiable volunteering. Connecting passionate individuals with grassroot NGOs across India.
              </p>
              <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                {[
                  { Icon: Link2, label: 'LinkedIn' },
                  { Icon: MessageCircle, label: 'Instagram' },
                  { Icon: YtIcon, label: 'YouTube' },
                  { Icon: Code2, label: 'GitHub' },
                ].map(({ Icon, label }) => (
                  <a key={label} href="#" aria-label={label}
                    style={{ width: 36, height: 36, borderRadius: 8, background: '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1F2937'; e.currentTarget.style.color = '#9CA3AF'; }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Company</h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['About', 'Careers', 'Contact', 'Our Mission'].map(item => (
                  <li key={item}><a href="#" style={{ color: '#6B7280', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
                  >{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Programs</h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Volunteer', 'Events', 'Success Stories', 'Leaderboard', 'Certificates'].map(item => (
                  <li key={item}><a href="#" style={{ color: '#6B7280', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
                  >{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Resources</h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Blogs', 'FAQs', 'Downloads', 'Help Center', 'Community'].map(item => (
                  <li key={item}><a href="#" style={{ color: '#6B7280', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
                  >{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Stay Updated</h5>
              <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '1rem', lineHeight: 1.6 }}>
                Get impact stories, volunteer spotlights, and new program alerts.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="Your email"
                  style={{ flex: 1, minWidth: 0, padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1F2937', color: 'white', fontSize: '0.8rem', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = '#374151'}
                />
                <button
                  style={{ padding: '0.6rem 0.875rem', borderRadius: 8, background: 'var(--color-primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
                >
                  <Mail size={16} color="white" />
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1.5rem 0', fontSize: '0.8rem', color: '#4B5563' }}>
            <span>© {new Date().getFullYear()} Disha for India Foundation. All rights reserved.</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>Made with</span>
              <Heart size={12} style={{ color: '#EF4444', fill: '#EF4444' }} />
              <span>in India</span>
              <span style={{ color: '#374151' }}>·</span>
              <span>Version 1.0</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Responsive CSS ── */}
      <style>{`
        /* Desktop: show nav & actions, hide hamburger */
        @media (min-width: 769px) {
          .pl-desktop-nav { display: flex !important; }
          .pl-desktop-actions { display: flex !important; }
          .pl-mobile-toggle { display: none !important; }
        }

        /* Mobile: hide nav & actions, show hamburger */
        @media (max-width: 768px) {
          .pl-desktop-nav { display: none !important; }
          .pl-desktop-actions { display: none !important; }
          .pl-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default PublicLayout;