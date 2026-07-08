import React, { useState } from 'react';
import { Users, Calendar, Clock, TrendingUp, Inbox, FileText, CheckCircle, Clock4 } from 'lucide-react';
import DashboardSkeleton from '../../components/DashboardSkeleton';
import LeaderboardWidget from '../../components/LeaderboardWidget';
import NotificationWidget from '../../components/NotificationWidget';
import RecentAnnouncementsWidget from '../../components/announcements/RecentAnnouncementsWidget';
import RecommendationsWidget from '../../components/dashboard/RecommendationsWidget';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { dashboard, leaderboard, notifications, volunteers, programs, applications, attendance } = useAdminData();
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate dynamic stats from actual local context data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const stats = {
    totalVolunteers: volunteers?.length || 0,
    activePrograms: programs?.filter(p => p.status === 'published' || p.status === 'active').length || 0,
    totalHours: volunteers?.reduce((sum, v) => sum + (Number(v.hours) || 0), 0) || 0,
    newThisMonth: volunteers?.filter(v => {
      const d = new Date(v.joinDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length || 0,
    totalPrograms: programs?.length || 0,
    draftPrograms: programs?.filter(p => p.status === 'draft').length || 0,
    completedPrograms: programs?.filter(p => p.status === 'completed').length || 0,
    pendingApps: applications?.filter(a => a.status === 'pending').length || 0,
  };

  // Dynamically generate leaderboard from actual volunteers
  const leaderboardData = [...(volunteers || [])]
    .map((v, i) => ({
      id: v._id || v.id || String(i),
      name: v.name || 'Anonymous',
      hours: Number(v.hours || 0),
      level: Number(v.hours || 0) > 40 ? 'Gold' : Number(v.hours || 0) > 20 ? 'Silver' : 'Bronze'
    }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 3);

  if (dashboardLoading) {
    return <div className="page-container" style={{ padding: '2rem' }}><DashboardSkeleton type="dashboard" /></div>;
  }

  const StatCard = ({ Icon, value, label, color = '#2563eb' }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: `5px solid ${color}`, padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ padding: '0.85rem', backgroundColor: `${color}15`, color, borderRadius: '12px' }}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, marginTop: '0.4rem' }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div className="page-container" style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', margin: '0 0 0.5rem 0', color: '#0f172a', fontWeight: 800 }}>Admin Dashboard</h1>
        <p style={{ color: '#475569', margin: 0, fontSize: '1.05rem' }}>Platform overview and volunteer engagement analytics.</p>
      </div>

      {/* Stats Grid - 8 Cards matching screenshot */}
      <div className="grid grid-cols-4" style={{ marginBottom: '3rem', gap: '1.5rem' }}>
        <StatCard Icon={Users} value={stats.totalVolunteers} label="Total Volunteers" color="#3b82f6" />
        <StatCard Icon={Calendar} value={stats.activePrograms} label="Active Programs" color="#10b981" />
        <StatCard Icon={Clock} value={stats.totalHours} label="Hours Volunteered" color="#f59e0b" />
        <StatCard Icon={TrendingUp} value={stats.newThisMonth} label="Signups This Month" color="#8b5cf6" />
        
        <StatCard Icon={Calendar} value={stats.totalPrograms} label="Total Programs" color="#0ea5e9" />
        <StatCard Icon={FileText} value={stats.draftPrograms} label="Draft Programs" color="#f97316" />
        <StatCard Icon={CheckCircle} value={stats.completedPrograms} label="Completed Programs" color="#a855f7" />
        <StatCard Icon={TrendingUp} value={stats.pendingApps} label="Pending Applications" color="#ef4444" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <RecommendationsWidget />
          
          <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
             <div className="card" style={{ padding: '1.75rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', color: '#1e293b' }}>
                <div style={{ padding: '0.5rem', backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: '8px' }}>
                  <Inbox size={20} />
                </div>
                Platform Health
              </h3>
              <div style={{ padding: '1.25rem', backgroundColor: '#ecfdf5', borderRadius: '12px', textAlign: 'center', border: '1px solid #d1fae5' }}>
                <p style={{ color: '#059669', fontWeight: 600, margin: '0 0 1rem 0' }}>System is running smoothly. All services operational.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.9rem', color: '#047857' }}>
                  <div><strong>●</strong> Memory: OK</div>
                  <div><strong>●</strong> UI: Online</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', color: '#1e293b' }}>
                <div style={{ padding: '0.5rem', backgroundColor: '#fef3c7', color: '#d97706', borderRadius: '8px' }}>
                  <TrendingUp size={20} />
                </div>
                Quick Actions
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button className="btn btn-secondary" style={{ padding: '0.75rem', fontSize: '0.9rem' }} onClick={() => navigate('/admin/programs')}>Manage Programs</button>
                <button className="btn btn-secondary" style={{ padding: '0.75rem', fontSize: '0.9rem' }} onClick={() => navigate('/admin/applications')}>Review Apps</button>
                <button className="btn btn-secondary" style={{ padding: '0.75rem', fontSize: '0.9rem' }} onClick={() => navigate('/admin/attendance')}>Attendance</button>
                <button className="btn btn-secondary" style={{ padding: '0.75rem', fontSize: '0.9rem' }} onClick={() => navigate('/admin/analytics')}>Analytics</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <LeaderboardWidget
            topVolunteers={leaderboardData}
            loading={false}
          />
          <NotificationWidget
            notifications={notifications || []}
            loading={false}
          />
          <RecentAnnouncementsWidget limit={4} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
