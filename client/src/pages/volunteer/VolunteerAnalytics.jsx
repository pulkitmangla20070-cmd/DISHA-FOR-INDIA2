import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Award, Target, Gift } from 'lucide-react';
import { getVolunteerDashboard } from '../../services/analyticsService';
import SkeletonLoader from '../../components/volunteer/SkeletonLoader';

const VolunteerAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getVolunteerDashboard();
      if (res.success) {
        setStats(res.data?.volunteer);
      }
    } catch (err) {
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container" style={{ padding: '2rem' }}><SkeletonLoader type="dashboard" /></div>;
  if (error) return <div className="page-container" style={{ padding: '2rem', color: 'var(--color-error)' }}>{error}</div>;
  if (!stats) return null;

  const StatCard = ({ icon: Icon, value, label, color = 'var(--color-primary)' }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ padding: '0.75rem', backgroundColor: `${color}20`, color, borderRadius: '50%' }}>
        <Icon size={20} />
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-heading)' }}>{value}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-heading)' }}>My Dashboard</h1>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>Your volunteering statistics and achievements.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
        <StatCard Icon={Calendar} value={stats.totalProgramsJoined} label="Programs Joined" color="var(--color-primary)" />
        <StatCard Icon={Clock} value={stats.totalHours} label="Total Hours" color="var(--color-success)" />
        <StatCard Icon={Award} value={stats.totalAttendance} label="Attendance Records" color="var(--color-accent)" />
        <StatCard Icon={Gift} value={stats.currentCoins} label="Coins Balance" color="var(--color-warning)" />
      </div>

      {/* Application Stats */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>My Applications</h2>
        <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
          <StatCard Icon={Target} value={stats.pendingApplications} label="Pending" color="#8B5CF6" />
          <StatCard Icon={Target} value={stats.approvedApplications} label="Approved" color="var(--color-success)" />
          <StatCard Icon={Target} value={stats.rejectedApplications} label="Rejected" color="var(--color-error)" />
        </div>
      </div>

      {/* Progress Summary */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Progress Summary</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Active Programs: {stats.activePrograms}</span>
              <span>Completed Programs: {stats.completedPrograms}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerAnalytics;