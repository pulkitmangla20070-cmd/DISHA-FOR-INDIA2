import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp, 
  Target, 
  Gift, 
  Building2, 
  Download,
  Search,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import SkeletonLoader from '../../components/volunteer/SkeletonLoader';
import StatCard from '../../components/volunteer/StatCard';
import { AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

const ChartCard = ({ title, children, actions, loading = false }) => (
  <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {title}
      </h3>
      {actions && <div style={{ display: 'flex', gap: '0.5rem' }}>{actions}</div>}
    </div>
    <div style={{ padding: '1rem', flex: 1 }}>
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      ) : children}
    </div>
  </div>
);

const GrowthChart = ({ data, dataKey, title, color = 'var(--color-primary)' }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title={title}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-body)' }}>
          No data available
        </div>
      </ChartCard>
    );
  }

  const chartData = data.map(item => ({
    ...item,
    monthName: `${MONTH_NAMES[item.month] || ''} ${item.year}`,
  })).slice(-12);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'var(--color-card)', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
          <p style={{ margin: 0, color: color }}>{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard title={<><LineChart size={18} />{title}</>}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="monthName" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#gradient-${title})`} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

const PieChartComponent = ({ data, title, nameKey, valueKey, colors }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title={<><PieChart size={18} />{title}</>}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-body)' }}>
          No data available
        </div>
      </ChartCard>
    );
  }

  const chartData = data.map((item) => ({
    name: item[nameKey],
    value: item[valueKey],
    percentage: item.percentage,
  }));

  const COLORS = colors || ['var(--color-primary)', 'var(--color-success)', 'var(--color-accent)', 'var(--color-warning)', 'var(--color-error)'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div style={{ backgroundColor: 'var(--color-card)', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{entry.name}</p>
          <p style={{ margin: 0 }}>{entry.value} ({entry.payload.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard title={<><PieChart size={18} />{title}</>}>
      <ResponsiveContainer width="100%" height={250}>
        <RePieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label={({ percentage }) => `${percentage}%`}>
            {chartData.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RePieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

const BarChartComponent = ({ data, title, xAxisKey, bars, colors }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title={<><BarChart3 size={18} />{title}</>}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-body)' }}>
          No data available
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title={<><BarChart3 size={18} />{title}</>}>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
          <Tooltip />
          {bars.map((bar, i) => (
            <Bar key={bar.key} dataKey={bar.key} fill={colors?.[i] || 'var(--color-primary)'} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

const VolunteerAnalyticsView = ({ data, dateRange, onExport, searchQuery }) => {
  const analytics = data?.volunteerAnalytics;
  
  const monthlyData = useMemo(() => (analytics?.volunteersJoinedPerMonth || []).map(item => ({
    ...item,
    monthName: `${MONTH_NAMES[item.month] || ''} ${item.year}`.trim(),
  })), [analytics?.volunteersJoinedPerMonth]);

  const exportData = dateRange === 'all' || !dateRange
    ? analytics?.volunteersByState?.map(s => ({ State: s.state, Count: s.count, Percentage: `${s.percentage}%` })) || []
    : [];

  const filteredByState = useMemo(() => {
    if (!searchQuery) return analytics?.volunteersByState || [];
    return analytics?.volunteersByState?.filter(s => 
      s.state.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [analytics?.volunteersByState, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
        <StatCard icon={<Users size={24} />} value={analytics?.totalVolunteers || 0} label="Total Volunteers" color="primary" />
        <StatCard icon={<Users size={24} />} value={analytics?.activeVolunteers || 0} label="Active Volunteers" color="secondary" />
        <StatCard icon={<Users size={24} />} value={analytics?.inactiveVolunteers || 0} label="Inactive" color="error" />
        <StatCard icon={<TrendingUp size={24} />} value={`${analytics?.growthRate?.rate || 0}%`} label="Growth Rate" color="accent" trend={{ value: `${analytics?.growthRate?.rate || 0}%`, direction: analytics?.growthRate?.rate >= 0 ? 'up' : 'down' }} />
      </div>

      <GrowthChart data={monthlyData} dataKey="count" title="Volunteer Growth" color="var(--color-primary)" />

      <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
        <ChartCard title="Volunteers by State" actions={exportData.length > 0 && <button onClick={() => onExport(exportData, 'volunteers-state')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
          <Download size={14} /> Export
        </button>}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
            {filteredByState?.slice(0, 16).map((item, i) => (
              <div key={i} style={{ flex: '1 1 120px', padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.state}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-body)' }}>{item.count} ({item.percentage}%)</div>
              </div>
            ))}
            {filteredByState?.length === 0 && <p style={{ color: 'var(--color-body)' }}>No states match your search</p>}
          </div>
        </ChartCard>

        <ChartCard title="Volunteers by City" actions={exportData.length > 0 && <button onClick={() => onExport(exportData, 'volunteers-state')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
          <Download size={14} /> Export
        </button>}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
            {analytics?.volunteersByCity?.slice(0, 16).map((item, i) => (
              <div key={i} style={{ flex: '1 1 120px', padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.city}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-body)' }}>{item.count} ({item.percentage}%)</div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

const ProgramAnalyticsView = ({ data, onExport, searchQuery }) => {
  const analytics = data?.programAnalytics;

  const categoryExport = analytics?.programsByCategory?.map(c => ({ Category: c.category, Count: c.count })) || [];

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return analytics?.programsByCategory || [];
    return analytics?.programsByCategory?.filter(c => 
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [analytics?.programsByCategory, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
        <StatCard icon={<Calendar size={24} />} value={analytics?.totalPrograms || 0} label="Total Programs" color="primary" />
        <StatCard icon={<Calendar size={24} />} value={analytics?.activePrograms || 0} label="Active Programs" color="secondary" />
        <StatCard icon={<Calendar size={24} />} value={analytics?.completedPrograms || 0} label="Completed" color="accent" />
        <StatCard icon={<Calendar size={24} />} value={analytics?.cancelledPrograms || 0} label="Cancelled" color="error" />
      </div>

      <GrowthChart data={analytics?.programsCreatedPerMonth || []} dataKey="count" title="Program Growth" color="var(--color-success)" />

      <ChartCard title="Programs by Category" actions={categoryExport.length > 0 && <button onClick={() => onExport(categoryExport, 'programs-category')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
        <Download size={14} /> Export
      </button>}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {filteredCategories?.map((item, i) => (
            <div key={i} style={{ flex: '1 1 150px', padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>{item.category}</div>
              <div style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '0.5rem' }}>{item.count}</div>
            </div>
          ))}
          {filteredCategories?.length === 0 && <p style={{ color: 'var(--color-body)' }}>No categories match your search</p>}
        </div>
      </ChartCard>
    </div>
  );
};

const AttendanceAnalyticsView = ({ data }) => {
  const analytics = data?.attendanceAnalytics;

  const monthlyData = useMemo(() => (analytics?.monthlyAttendance || []).map(item => ({
    ...item,
    monthName: `${MONTH_NAMES[item.month] || ''} ${item.year}`.trim(),
  })), [analytics?.monthlyAttendance]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
        <StatCard icon={<Clock size={24} />} value={analytics?.totalHours || 0} label="Total Hours Contributed" color="primary" />
        <StatCard icon={<Users size={24} />} value={analytics?.totalSessions || 0} label="Total Sessions" color="secondary" />
        <StatCard icon={<TrendingUp size={24} />} value={`${analytics?.attendanceRate || 0}%`} label="Attendance Rate" color="success" />
        <StatCard icon={<TrendingUp size={24} />} value={`${analytics?.averageHoursPerSession || 0}h`} label="Avg Hours/Session" color="accent" />
      </div>

      <BarChartComponent 
        data={monthlyData} 
        title="Monthly Attendance Trend"
        xAxisKey="monthName"
        bars={[{ key: 'count', name: 'Sessions' }, { key: 'totalHours', name: 'Hours' }]}
        colors={['var(--color-primary)', 'var(--color-success)']}
      />
    </div>
  );
};

const CertificateAnalyticsView = ({ data, onExport, searchQuery }) => {
  const analytics = data?.certificateAnalytics;

  const programExport = analytics?.certificatesByProgram?.map(c => ({ Program: c.program || 'Unknown', Count: c.count })) || [];

  const filteredPrograms = useMemo(() => {
    if (!searchQuery) return analytics?.certificatesByProgram || [];
    return analytics?.certificatesByProgram?.filter(c => 
      (c.program || '').toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [analytics?.certificatesByProgram, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
        <StatCard icon={<Award size={24} />} value={analytics?.certificatesGenerated || 0} label="Certificates Generated" color="primary" />
        <StatCard icon={<Award size={24} />} value={analytics?.pendingCertificates || 0} label="Pending" color="warning" />
        <StatCard icon={<Award size={24} />} value={analytics?.verifiedCertificates || 0} label="Verified" color="success" />
      </div>

      <BarChartComponent 
        data={analytics?.certificatesByMonth?.map(m => ({
          ...m,
          monthName: `${MONTH_NAMES[m.month] || ''} ${m.year}`.trim(),
        })) || []}
        title="Certificates Trend"
        xAxisKey="monthName"
        bars={[{ key: 'count', name: 'Certificates' }]}
        colors={['var(--color-primary)']}
      />

      <ChartCard title="Certificates by Program" actions={programExport.length > 0 && <button onClick={() => onExport(programExport, 'certificates-program')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
        <Download size={14} /> Export
      </button>}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {filteredPrograms?.map((item, i) => (
            <div key={i} style={{ flex: '1 1 180px', padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.program || 'Unknown'}</div>
              <div style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginTop: '0.25rem' }}>{item.count}</div>
            </div>
          ))}
          {filteredPrograms?.length === 0 && <p style={{ color: 'var(--color-body)' }}>No programs match your search</p>}
        </div>
      </ChartCard>
    </div>
  );
};

const RewardAnalyticsView = ({ data }) => {
  const analytics = data?.rewardAnalytics;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
        <StatCard icon={<Gift size={24} />} value={analytics?.coinsDistributed || 0} label="Coins Distributed" color="primary" />
        <StatCard icon={<Award size={24} />} value={analytics?.badgesAwarded || 0} label="Badges Awarded" color="secondary" />
        <StatCard icon={<Gift size={24} />} value={analytics?.totalRewardsGiven || 0} label="Total Rewards" color="accent" />
        <StatCard icon={<TrendingUp size={24} />} value={analytics?.rewardsRedeemed || 0} label="Rewards Redeemed" color="success" />
      </div>

      <PieChartComponent 
        data={analytics?.rewardsByType || []}
        title="Rewards Distribution"
        nameKey="type"
        valueKey="count"
      />

      <BarChartComponent 
        data={analytics?.rewardsByMonth?.map(m => ({
          ...m,
          monthName: `${MONTH_NAMES[m.month] || ''} ${m.year}`.trim(),
        })) || []}
        title="Monthly Rewards"
        xAxisKey="monthName"
        bars={[{ key: 'count', name: 'Rewards' }]}
        colors={['var(--color-warning)']}
      />
    </div>
  );
};

const LeaderboardAnalyticsView = ({ data, onExport, searchQuery }) => {
  const analytics = data?.leaderboardAnalytics;

  const topVolunteers = useMemo(() => {
    if (!searchQuery) return analytics?.topVolunteers || [];
    return analytics?.topVolunteers?.filter(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [analytics?.topVolunteers, searchQuery]);

  const topCoinEarners = useMemo(() => {
    if (!searchQuery) return analytics?.highestCoinEarners || [];
    return analytics?.highestCoinEarners?.filter(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [analytics?.highestCoinEarners, searchQuery]);

  const hoursExport = topVolunteers?.map(v => ({ Name: v.name, Email: v.email, Hours: v.totalHours || 0 })) || [];
  const coinsExport = topCoinEarners?.map(v => ({ Name: v.name, Email: v.email, Coins: v.coins || 0 })) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} /> Top Volunteers by Hours
          </h3>
          {hoursExport.length > 0 && (
            <button onClick={() => onExport(hoursExport, 'leaderboard-hours')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
              <Download size={14} /> Export
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {topVolunteers?.length === 0 ? (
            <p style={{ color: 'var(--color-body)' }}>No volunteers match your search</p>
          ) : topVolunteers?.map((vol, i) => (
            <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' }}>
              <span style={{ fontWeight: 500 }}>{i + 1}. {vol.name}</span>
              <span>{vol.totalHours || 0} hours</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} /> Highest Coin Earners
          </h3>
          {coinsExport.length > 0 && (
            <button onClick={() => onExport(coinsExport, 'leaderboard-coins')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
              <Download size={14} /> Export
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {topCoinEarners?.length === 0 ? (
            <p style={{ color: 'var(--color-body)' }}>No volunteers match your search</p>
          ) : topCoinEarners?.map((vol, i) => (
            <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' }}>
              <span style={{ fontWeight: 500 }}>{i + 1}. {vol.name}</span>
              <span>{vol.coins || 0} coins</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ApplicationAnalyticsView = ({ data, onExport, searchQuery }) => {
  const analytics = data?.applicationAnalytics;

  const statusExport = analytics?.statusDistribution?.map(s => ({ Status: s.status, Count: s.count })) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
        <StatCard icon={<Target size={24} />} value={analytics?.totalApplications || 0} label="Total Applications" color="primary" />
        <StatCard icon={<Target size={24} />} value={`${analytics?.approvalRate || 0}%`} label="Approval Rate" color="secondary" />
        <StatCard icon={<Target size={24} />} value={`${analytics?.rejectionRate || 0}%`} label="Rejection Rate" color="error" />
        <StatCard icon={<Target size={24} />} value={`${analytics?.pendingRate || 0}%`} label="Pending Rate" color="warning" />
      </div>

      <BarChartComponent 
        data={analytics?.applicationsByMonth?.map(m => ({
          ...m,
          monthName: `${MONTH_NAMES[m.month] || ''} ${m.year}`.trim(),
        })) || []}
        title="Applications Trend"
        xAxisKey="monthName"
        bars={[{ key: 'count', name: 'Applications' }]}
        colors={['var(--color-primary)']}
      />

      <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
        <ChartCard title="Application Status Distribution" actions={statusExport.length > 0 && <button onClick={() => onExport(statusExport, 'applications-status')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
          <Download size={14} /> Export
        </button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {analytics?.statusDistribution?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: 'var(--color-bg)', borderRadius: '4px' }}>
                <span style={{ textTransform: 'capitalize' }}>{item.status.replace('_', ' ')}</span>
                <span style={{ fontWeight: 600 }}>{item.count}</span>
              </div>
            ))}
            {analytics?.statusDistribution?.length === 0 && <p style={{ color: 'var(--color-body)' }}>No applications found</p>}
          </div>
        </ChartCard>

        <ChartCard title="Applications by Program" actions={statusExport.length > 0 && <button onClick={() => onExport(statusExport, 'applications-status')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
          <Download size={14} /> Export
        </button>}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
            {analytics?.applicationsByProgram?.map((item, i) => (
              <div key={i} style={{ flex: '1 1 150px', padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.program || 'Unknown'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-body)' }}>{item.count} applications</div>
              </div>
            ))}
            {analytics?.applicationsByProgram?.length === 0 && <p style={{ color: 'var(--color-body)' }}>No applications found</p>}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

const OrganizationAnalyticsView = ({ data }) => {
  const analytics = data?.organizationAnalytics;

  return (
    <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
      <StatCard icon={<Building2 size={24} />} value={analytics?.organizationsCreated || 0} label="Organizations Created" color="primary" />
      <StatCard icon={<Building2 size={24} />} value={analytics?.verifiedOrganizations || 0} label="Verified Organizations" color="secondary" />
      <StatCard icon={<Building2 size={24} />} value={analytics?.activeOrganizations || 0} label="Active Organizations" color="accent" />
    </div>
  );
};

const AdminAnalytics = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('this_month');
  const [searchQuery, setSearchQuery] = useState('');

  const { analytics: dashboardDataRaw } = useAdminData();
  const [dashboardData, setDashboardData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const dashboardError = null;
  const analyticsError = null;

  useEffect(() => {
    if (dashboardDataRaw) {
      setDashboardData(dashboardDataRaw);
      setDashboardLoading(false);
    }
  }, [dashboardDataRaw]);

  useEffect(() => {
    if (activeTab !== 'dashboard') {
      setAnalyticsLoading(true);
      // Faking the individual fetches with the massive analytics blob 
      setTimeout(() => {
        setAnalytics(dashboardDataRaw);
        setAnalyticsLoading(false);
      }, 500);
    }
  }, [activeTab, dateRange, dashboardDataRaw]);

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
    switch (activeTab) {
      case 'volunteers':
        return <VolunteerAnalyticsView data={analytics} dateRange={dateRange} onExport={handleExport} searchQuery={searchQuery} />;
      case 'programs':
        return <ProgramAnalyticsView data={analytics} onExport={handleExport} searchQuery={searchQuery} />;
      case 'applications':
        return <ApplicationAnalyticsView data={analytics} onExport={handleExport} searchQuery={searchQuery} />;
      case 'attendance':
        return <AttendanceAnalyticsView data={analytics} />;
      case 'certificates':
        return <CertificateAnalyticsView data={analytics} onExport={handleExport} searchQuery={searchQuery} />;
      case 'rewards':
        return <RewardAnalyticsView data={analytics} />;
      case 'leaderboard':
        return <LeaderboardAnalyticsView data={analytics} onExport={handleExport} searchQuery={searchQuery} />;
      case 'organizations':
        return <OrganizationAnalyticsView data={analytics} />;
      default:
        return null;
    }
  };

  const hasError = dashboardError || analyticsError;

  if (dashboardLoading || analyticsLoading) {
    return <div className="page-container" style={{ padding: '2rem' }}><SkeletonLoader type="dashboard" /></div>;
  }

  if (hasError && activeTab !== 'dashboard') {
    return <div className="page-container" style={{ padding: '2rem', color: 'var(--color-error)' }}>{analyticsError?.message || dashboardError?.message}</div>;
  }

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
            <StatCard icon={<Users size={24} />} value={dashboardData?.users?.totalVolunteers || 0} label="Total Volunteers" color="primary" />
            <StatCard icon={<Users size={24} />} value={dashboardData?.users?.activeVolunteers || 0} label="Active Volunteers" color="secondary" />
            <StatCard icon={<Calendar size={24} />} value={dashboardData?.programs?.activePrograms || 0} label="Active Programs" color="accent" />
            <StatCard icon={<Clock size={24} />} value={dashboardData?.attendance?.totalAttendance || 0} label="Total Attendance" color="primary" />
          </div>

          <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
            <StatCard icon={<Target size={24} />} value={dashboardData?.applications?.pending || 0} label="Pending Applications" color="purple" />
            <StatCard icon={<Award size={24} />} value={dashboardData?.certificates?.generated || 0} label="Certificates Issued" color="warning" />
            <StatCard icon={<Gift size={24} />} value={dashboardData?.rewards?.badgesAwarded || 0} label="Badges Awarded" color="secondary" />
            <StatCard icon={<TrendingUp size={24} />} value={`${dashboardData?.attendance?.attendanceRate || 0}%`} label="Attendance Rate" color="success" />
          </div>

          <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
            <StatCard icon={<Gift size={24} />} value={dashboardData?.rewards?.coinsIssued || 0} label="Coins Issued" color="primary" />
            <StatCard icon={<Clock size={24} />} value={dashboardData?.attendance?.hoursServed || 0} label="Hours Served" color="secondary" />
            <StatCard icon={<Users size={24} />} value={dashboardData?.users?.newVolunteersThisMonth || 0} label="New This Month" color="success" />
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <ChartCard title="Volunteer Growth">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dashboardData?.volunteersJoinedPerMonth?.map(m => ({
                  ...m,
                  monthName: `${MONTH_NAMES[m.month] || ''} ${m.year}`.trim(),
                })) || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="volunteerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="monthName" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#volunteerGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <PieChartComponent 
              data={dashboardData?.stateDistribution || []}
              title="State Distribution"
              nameKey="state"
              valueKey="count"
            />
          </div>
        </div>
      )}

      {activeTab !== 'dashboard' && (
        <div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {activeTab !== 'leaderboard' && (
              <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="form-input"
                >
                  {DATE_RANGES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            )}
            
            {['volunteers', 'programs', 'certificates', 'leaderboard'].includes(activeTab) && (
              <div style={{ flex: '2 1 300px', minWidth: '250px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            )}
          </div>

          {renderAnalyticsView()}
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;