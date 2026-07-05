import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BellOff, Info } from 'lucide-react';
import { getAnnouncements } from '../../services/announcementsService';
import { useAuth } from '../../context/AuthContext';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import AnnouncementBanner from '../../components/announcements/AnnouncementBanner';
import AnnouncementFilters from '../../components/announcements/AnnouncementFilters';
import AnnouncementSkeleton from '../../components/announcements/AnnouncementSkeleton';
import AnnouncementEmptyState from '../../components/announcements/AnnouncementEmptyState';
import AnnouncementPagination from '../../components/announcements/AnnouncementPagination';
import toast from 'react-hot-toast';

const PAGE_SIZE = 9;

const Announcements = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [error, setError] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const params = useMemo(() => {
    const p = { page, limit: PAGE_SIZE, sortBy: 'createdAt', order: 'desc' };
    if (search) p.search = search;
    if (type) p.type = type;
    if (priority) p.priority = priority;
    if (targetAudience) p.targetAudience = targetAudience;
    return p;
  }, [page, search, type, priority, targetAudience]);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['announcements', params],
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

  const topAnnouncement = useMemo(() => {
    if (bannerDismissed || announcements.length === 0) return null;
    return announcements.find((a) => a.priority === 'critical' || a.status === 'published') || announcements[0];
  }, [announcements, bannerDismissed]);

  const listAnnouncements = useMemo(() => {
    if (topAnnouncement && !bannerDismissed) {
      return announcements.filter((a) => (a._id || a.announcementId) !== (topAnnouncement._id || topAnnouncement.announcementId));
    }
    return announcements;
  }, [announcements, topAnnouncement, bannerDismissed]);

  useEffect(() => {
    setPage(1);
  }, [search, type, priority, targetAudience]);

  const handleSearch = (val) => {
    setSearch(val);
  };

  const handleClearFilters = () => {
    setSearch('');
    setType('');
    setPriority('');
    setTargetAudience('');
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        <div className="skeleton" style={{ height: 32, width: 260, borderRadius: 8, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 18, width: 400, borderRadius: 8, marginBottom: 24 }} />
        <AnnouncementSkeleton count={PAGE_SIZE} />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto', minHeight: '100vh' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
            ← Dashboard
          </Link>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-heading)', margin: '0 0 0.5rem' }}>
          <BellOff size={28} style={{ color: 'var(--color-primary)', display: 'inline', marginRight: '0.5rem' }} aria-hidden="true" />
          Announcements
        </h1>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>
          Stay informed with the latest updates, events, and important notices.
        </p>
      </div>

      <AnnouncementFilters
        search={search}
        onSearchChange={handleSearch}
        type={type}
        onTypeChange={setType}
        priority={priority}
        onPriorityChange={setPriority}
        targetAudience={targetAudience}
        onTargetAudienceChange={setTargetAudience}
        showAdminFilters={false}
        onClear={handleClearFilters}
      />

      <AnimatePresence>
        {!bannerDismissed && topAnnouncement && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AnnouncementBanner
              announcement={topAnnouncement}
              onClose={() => setBannerDismissed(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', color: 'var(--color-error)', marginBottom: '1.5rem' }} role="alert">
          <Info size={16} aria-hidden="true" /> {error}
        </div>
      )}

      {isFetching && !isLoading && (
        <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--color-body)' }} aria-live="polite">
          Refreshing...
        </div>
      )}

      {announcements.length === 0 && !isLoading && !error && (
        <AnnouncementEmptyState
          title="No announcements found"
          description="Try adjusting your filters or check back later for updates."
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {listAnnouncements.map((announcement) => (
          <AnnouncementCard
            key={announcement._id || announcement.announcementId}
            announcement={announcement}
            onClick={() => navigate(`/announcements/${announcement._id || announcement.announcementId}`)}
          />
        ))}
      </div>

      <AnnouncementPagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        itemsPerPage={PAGE_SIZE}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Announcements;
