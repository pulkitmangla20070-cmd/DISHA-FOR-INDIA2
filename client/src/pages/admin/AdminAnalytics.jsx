import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, Clock, Award, TrendingUp, Target, Gift, Building2, Download } from 'lucide-react';
import {
  getAdminDashboard,
  getVolunteerAnalytics,
  getProgramAnalytics,
  getApplicationAnalytics,
  getAttendanceAnalytics,
  getCertificateAnalytics,
  getRewardAnalytics,
  getLeaderboardAnalytics,
  getOrganizationAnalytics,
} from '../../services/analyticsService';
import SkeletonLoader from '../../components/volunteer/SkeletonLoader';

const DATE_RANGES = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'last_year', label: 'Last Year' },
];

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const exportToCSV = (data, filename) => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(','));
  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const StatCard = ({ Icon, value, label, color = 'var(--color-primary)', trend }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${color}` }}>
    <div style={{ padding: '0.75rem', backgroundColor: `${color}20`, color, borderRadius: '50%' }}>
      <Icon size={24} />
    </div>
    <div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-heading)' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>{label}</div>
      {trend !== undefined && (
        <div style={{ fontSize: '0.75rem', color: trend >= 0 ? 'var(--color-success)' : 'var(--color-error)', marginTop: '0.25rem' }}>
          {trend >= 0 ? '+' : ''}{trend}% from last period
        </div>
      )}
    </div>
  </div>
);

const ChartCard = ({ title, children, actions }) => (
  <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-heading)' }}>{title}</h3>
      {actions && <div style={{ display: 'flex', gap: '0.5rem' }}>{actions}</div>}
    </div>
    <div style={{ padding: '1rem', flex: 1 }}>{children}</div>
  </div>
);

const VolunteerAnalyticsView = ({ data, dateRange, onExport }) => {
  const analytics = data?.volunteerAnalytics;
  if (!analytics) return null;

  const monthlyData = (analytics.volunteersJoinedPerMonth || []).map(item => ({
    ...item,
    monthName: `${MONTH_NAMES[item.month] || ''} ${item.year}`,
  }));

  const exportData = dateRange === 'all' || !dateRange
    ? analytics.volunteersByState?.map(s => ({ State: s.state, Count: s.count, Percentage: `${s.percentage}%` })) || []
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
        <StatCard Icon={Users} value={analytics.totalVolunteers || 0} label="Total Volunteers" color="var(--color-primary)" />
        <StatCard Icon={Users} value={analytics.activeVolunteers || 0} label="Active Volunteers" color="var(--color-success)" />
        <StatCard Icon={Users} value={analytics.inactiveVolunteers || 0} label="Inactive" color="var(--color-error)" />
        <StatCard Icon={TrendingUp} value={`${analytics.growthRate?.rate || 0}%`} label="Growth Rate" color="var(--color-accent)" />
      </div>

      <ChartCard title="Volunteers by State" actions={exportData.length > 0 && <button onClick={() => onExport(exportData, 'volunteers-state')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
        <Download size={14} /> Export
      </button>}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {analytics.volunteersByState?.slice(0, 8).map((item, i) => (
            <div key={i} style={{ flex: '1 1 120px', padding: '0.5rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.state}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-body)' }}>{item.count} ({item.percentage}%)</div>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Volunteers by City">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
          {analytics.volunteersByCity?.slice(0, 15).map((item, i) => (
            <div key={i} style={{ flex: '1 1 150px', padding: '0.5rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.city}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-body)' }}>{item.count} ({item.percentage}%)</div>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Monthly Growth">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {monthlyData.slice(-6).map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: 'var(--color-bg)', borderRadius: '4px' }}>
              <span>{item.monthName}</span>
              <span style={{ fontWeight: 600 }}>{item.count} volunteers</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

const ProgramAnalyticsView = ({ data, onExport }) => {
  const analytics = data?.programAnalytics;
  if (!analytics) return null;

  const categoryExport = analytics.programsByCategory?.map(c => ({ Category: c.category, Count: c.count })) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
        <StatCard Icon={Calendar} value={analytics.totalPrograms || 0} label="Total Programs" color="var(--color-primary)" />
        <StatCard Icon={Calendar} value={analytics.activePrograms || 0} label="Active Programs" color="var(--color-success)" />
        <StatCard Icon={Calendar} value={analytics.completedPrograms || 0} label="Completed" color="var(--color-info)" />
        <StatCard Icon={Calendar} value={analytics.cancelledPrograms || 0} label="Cancelled" color="var(--color-error)" />
      </div>

      <ChartCard title="Programs by Category" actions={categoryExport.length > 0 && <button onClick={() => onExport(categoryExport, 'programs-category')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
        <Download size={14} /> Export
      </button>}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {analytics.programsByCategory?.map((item, i) => (
            <div key={i} style={{ flex: '1 1 150px', padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>{item.category}</div>
              <div style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '0.5rem' }}>{item.count}</div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

const ApplicationAnalyticsView = ({ data, onExport }) => {
  const analytics = data?.applicationAnalytics;
  if (!analytics) return null;

  const statusExport = analytics.statusDistribution?.map(s => ({ Status: s.status, Count: s.count })) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
        <StatCard Icon={Target} value={analytics.totalApplications || 0} label="Total Applications" color="var(--color-primary)" />
        <StatCard Icon={Target} value={`${analytics.approvalRate || 0}%`} label="Approval Rate" color="var(--color-success)" />
        <StatCard Icon={Target} value={`${analytics.rejectionRate || 0}%`} label="Rejection Rate" color="var(--color-error)" />
        <StatCard Icon={Target} value={`${analytics.pendingRate || 0}%`} label="Pending Rate" color="var(--color-warning)" />
      </div>

      <ChartCard title="Application Status Distribution" actions={statusExport.length > 0 && <button onClick={() => onExport(statusExport, 'applications-status')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
        <Download size={14} /> Export
      </button>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {analytics.statusDistribution?.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: 'var(--color-bg)', borderRadius: '4px' }}>
              <span style={{ textTransform: 'capitalize' }}>{item.status.replace('_', ' ')}</span>
              <span style={{ fontWeight: 600 }}>{item.count}</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

const AttendanceAnalyticsView = ({ data }) => {
  const analytics = data?.attendanceAnalytics;
  if (!analytics) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
        <StatCard Icon={Clock} value={analytics.totalHours || 0} label="Total Hours Contributed" color="var(--color-primary)" />
        <StatCard Icon={TrendingUp} value={`${analytics.attendanceRate || 0}%`} label="Attendance Rate" color="var(--color-success)" />
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Monthly Attendance</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {analytics.monthlyAttendance?.slice(-6).map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px' }}>
              <span>{MONTH_NAMES[item.month] || ''} {item.year}</span>
              <span>{item.count} sessions, {item.totalHours || 0} hours</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CertificateAnalyticsView = ({ data }) => {
  const analytics = data?.certificateAnalytics;
  if (!analytics) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <StatCard Icon={Award} value={analytics.certificatesGenerated || 0} label="Certificates Generated" color="var(--color-primary)" />

      <div className="card">
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Certificates by Program</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {analytics.certificatesByProgram?.map((item, i) => (
            <div key={i} style={{ flex: '1 1 150px', padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.program || 'Unknown'}</div>
              <div style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginTop: '0.25rem' }}>{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RewardAnalyticsView = ({ data }) => {
  const analytics = data?.rewardAnalytics;
  if (!analytics) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
        <StatCard Icon={Gift} value={analytics.coinsDistributed || 0} label="Coins Distributed" color="var(--color-primary)" />
        <StatCard Icon={Award} value={analytics.badgesAwarded || 0} label="Badges Awarded" color="var(--color-success)" />
        <StatCard Icon={TrendingUp} value={analytics.achievementsAwarded || 0} label="Achievements" color="var(--color-accent)" />
      </div>
    </div>
  );
};

const LeaderboardAnalyticsView = ({ data, onExport }) => {
  const analytics = data?.leaderboardAnalytics;
  if (!analytics) return null;

  const hoursExport = analytics.topVolunteers?.map(v => ({ Name: v.name, Email: v.email, Hours: v.totalHours || 0 })) || [];
  const coinsExport = analytics.highestCoinEarners?.map(v => ({ Name: v.name, Email: v.email, Coins: v.coins || 0 })) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Top Volunteers by Hours</h3>
          {hoursExport.length > 0 && (
            <button onClick={() => onExport(hoursExport, 'leaderboard-hours')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
              <Download size={14} /> Export
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {analytics.topVolunteers?.map((vol, i) => (
            <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>{i + 1}. {vol.name}</span>
              <span>{vol.totalHours} hours</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Highest Coin Earners</h3>
          {coinsExport.length > 0 && (
            <button onClick={() => onExport(coinsExport, 'leaderboard-coins')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
              <Download size={14} /> Export
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {analytics.highestCoinEarners?.map((vol, i) => (
            <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>{i + 1}. {vol.name}</span>
              <span>{vol.coins} coins</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrganizationAnalyticsView = ({ data }) => {
  const analytics = data?.organizationAnalytics;
  if (!analytics) return null;

  return (
    <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
      <StatCard Icon={Building2} value={analytics.organizationsCreated || 0} label="Organizations Created" color="var(--color-primary)" />
      <StatCard Icon={Building2} value={analytics.verifiedOrganizations || 0} label="Verified Organizations" color="var(--color-success)" />
      <StatCard Icon={Building2} value={analytics.activeOrganizations || 0} label="Active Organizations" color="var(--color-info)" />
    </div>
  );
};

const AdminAnalytics = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('this_month');

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await getAdminDashboard();
      if (res?.success) return res.data?.admin;
      throw new Error(res?.message || 'Failed to load dashboard');
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics', activeTab, dateRange],
    queryFn: async () => {
      let res;
      switch (activeTab) {
        case 'volunteers':
          res = await getVolunteerAnalytics(dateRange || null);
          break;
        case 'programs':
          res = await getProgramAnalytics(dateRange || null);
          break;
        case 'applications':
          res = await getApplicationAnalytics(dateRange || null);
          break;
        case 'attendance':
          res = await getAttendanceAnalytics(dateRange || null);
          break;
        case 'certificates':
          res = await getCertificateAnalytics(dateRange || null);
          break;
        case 'rewards':
          res = await getRewardAnalytics(dateRange || null);
          break;
        case 'leaderboard':
          res = await getLeaderboardAnalytics(10);
          break;
        case 'organizations':
          res = await getOrganizationAnalytics(dateRange || null);
          break;
        default:
          return null;
      }
      if (res?.success) return res.data;
      throw new Error(res?.message || 'Failed to load analytics');
    },
    enabled: activeTab !== 'dashboard',
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleExport = useCallback((data, filename) => {
    exportToCSV(data, filename);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', Icon: Users },
    { id: 'volunteers', label: 'Volunteers', Icon: Users },
    { id: 'programs', label: 'Programs', Icon: Calendar },
    { id: 'applications', label: 'Applications', Icon: Target },
    { id: 'attendance', label: 'Attendance', Icon: Clock },
    { id: 'certificates', label: 'Certificates', Icon: Award },
    { id: 'rewards', label: 'Rewards', Icon: Gift },
    { id: 'leaderboard', label: 'Leaderboard', Icon: TrendingUp },
    { id: 'organizations', label: 'Organizations', Icon: Building2 },
  ];

  const renderAnalyticsView = () => {
    if (analyticsLoading) return <SkeletonLoader type="dashboard" />;

    switch (activeTab) {
      case 'volunteers':
        return <VolunteerAnalyticsView data={analytics} dateRange={dateRange} onExport={handleExport} />;
      case 'programs':
        return <ProgramAnalyticsView data={analytics} onExport={handleExport} />;
      case 'applications':
        return <ApplicationAnalyticsView data={analytics} onExport={handleExport} />;
      case 'attendance':
        return <AttendanceAnalyticsView data={analytics} />;
      case 'certificates':
        return <CertificateAnalyticsView data={analytics} />;
      case 'rewards':
        return <RewardAnalyticsView data={analytics} />;
      case 'leaderboard':
        return <LeaderboardAnalyticsView data={analytics} onExport={handleExport} />;
      case 'organizations':
        return <OrganizationAnalyticsView data={analytics} />;
      default:
        return null;
    }
  };

  if (dashboardLoading) return <div className="page-container" style={{ padding: '2rem' }}><SkeletonLoader type="dashboard" /></div>;

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-heading)' }}>Platform Analytics</h1>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>Comprehensive analytics and reporting for Disha for India platform.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <tab.Icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && dashboardData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
            <StatCard Icon={Users} value={dashboardData?.users?.totalVolunteers || 0} label="Total Volunteers" color="var(--color-primary)" />
            <StatCard Icon={Users} value={dashboardData?.users?.activeVolunteers || 0} label="Active Volunteers" color="var(--color-success)" />
            <StatCard Icon={Calendar} value={dashboardData?.programs?.activePrograms || 0} label="Active Programs" color="var(--color-accent)" />
            <StatCard Icon={Clock} value={dashboardData?.attendance?.totalAttendance || 0} label="Total Attendance" color="var(--color-info)" />
          </div>

          <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
            <StatCard Icon={Target} value={dashboardData?.applications?.pending || 0} label="Pending Applications" color="#8B5CF6" />
            <StatCard Icon={Award} value={dashboardData?.certificates?.generated || 0} label="Certificates Issued" color="var(--color-warning)" />
            <StatCard Icon={Gift} value={dashboardData?.rewards?.badgesAwarded || 0} label="Badges Awarded" color="#EC4899" />
            <StatCard Icon={TrendingUp} value={`${dashboardData?.attendance?.attendanceRate || 0}%`} label="Attendance Rate" color="var(--color-primary)" />
          </div>

          <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
            <StatCard Icon={Building2} value={dashboardData?.organizations?.totalOrganizations || 0} label="Organizations" color="#10B981" />
            <StatCard Icon={Building2} value={dashboardData?.organizations?.verifiedOrganizations || 0} label="Verified Orgs" color="var(--color-success)" />
            <StatCard Icon={TrendingUp} value={dashboardData?.users?.newVolunteersThisMonth || 0} label="New This Month" color="var(--color-primary)" />
          </div>
        </div>
      )}

      {activeTab !== 'dashboard' && (
        <div>
          {activeTab !== 'leaderboard' && (
            <div style={{ marginBottom: '1rem' }}>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="form-input"
                style={{ maxWidth: '200px' }}
              >
                {DATE_RANGES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          )}

          {renderAnalyticsView()}
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;