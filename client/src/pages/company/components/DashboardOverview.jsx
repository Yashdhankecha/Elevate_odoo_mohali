import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  CheckCircle,
  Trophy,
  Clock,
  TrendingUp,
  Calendar,
  ChevronRight,
  Plus,
  Settings,
  Loader2,
  AlertCircle,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  getCompanyDashboardStats,
  getCompanyJobs,
  getAllApplications
} from '../../../services/companyApi';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Build a simple monthly application trend from applications array
const buildApplicationTrends = (applications) => {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ month: MONTHS[d.getMonth()], year: d.getFullYear(), applications: 0 });
  }
  applications.forEach(app => {
    const appDate = new Date(app.appliedDate || app.createdAt);
    const label = MONTHS[appDate.getMonth()];
    const entry = months.find(m => m.month === label && m.year === appDate.getFullYear());
    if (entry) entry.applications += 1;
  });
  return months;
};

// Build status distribution pie data from applications array
const buildStatusDistribution = (applications) => {
  const counts = {};
  applications.forEach(app => {
    const s = app.status || 'applied';
    counts[s] = (counts[s] || 0) + 1;
  });
  const colorMap = {
    applied: '#3B82F6',
    shortlisted: '#10B981',
    interview_scheduled: '#F59E0B',
    offered: '#8B5CF6',
    rejected: '#EF4444',
    hired: '#06B6D4'
  };
  return Object.entries(counts).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value,
    color: colorMap[name] || '#94A3B8'
  }));
};

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [applicationTrends, setApplicationTrends] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, applicationsData] = await Promise.all([
        getCompanyDashboardStats(),
        getAllApplications({})
      ]);

      setStats(statsData);

      // Build recent applications list (latest 4)
      const sorted = [...applicationsData].sort((a, b) =>
        new Date(b.appliedDate || b.createdAt) - new Date(a.appliedDate || a.createdAt)
      );
      setRecentApplications(sorted.slice(0, 4));

      // Build chart data
      setApplicationTrends(buildApplicationTrends(applicationsData));
      setStatusDistribution(buildStatusDistribution(applicationsData));
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${Math.floor(hours / 24)} day(s) ago`;
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={36} className="text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertCircle size={36} className="text-rose-500" />
        <p className="text-slate-700 font-semibold">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-5 py-2.5 bg-slate-900 text-white rounded font-bold hover:bg-slate-800 transition-colors shadow-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const dashboardStats = [
    {
      label: 'Total Jobs Posted',
      value: stats?.totalJobs ?? 0,
      sub: `${stats?.activeJobs ?? 0} active`,
      icon: Briefcase,
      gradient: 'from-blue-600 to-indigo-600',
    },
    {
      label: 'Applications Received',
      value: stats?.totalApplications ?? 0,
      sub: `${stats?.pendingApplications ?? 0} pending`,
      icon: Users,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Shortlisted',
      value: stats?.shortlistedApplications ?? 0,
      sub: 'Candidates advancing',
      icon: CheckCircle,
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      label: 'Interviews Scheduled',
      value: stats?.scheduledInterviews ?? 0,
      sub: `${stats?.completedInterviews ?? 0} completed`,
      icon: Trophy,
      gradient: 'from-amber-500 to-orange-600',
    }
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Activity size={28} className="text-slate-700" />
            Recruitment Overview
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Real-time data from your recruitment pipeline</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-5 rounded border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded border border-slate-100 flex items-center justify-center bg-slate-50 flex-shrink-0`}>
                <Icon className="text-slate-600" size={24} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <h4 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-1">{stat.value}</h4>
                <p className="text-xs text-slate-500">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Trends */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp size={20} className="text-slate-500" />
              Application Trends (Last 6 Months)
            </h3>
          </div>

          <div className="bg-white rounded border border-slate-200 p-6 shadow-sm min-h-[350px]">
            {applicationTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={applicationTrends}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dx={-10} />
                  <Tooltip
                    contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                    cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#475569"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorApps)"
                    dot={{ fill: '#f8fafc', strokeWidth: 2, r: 4, stroke: '#475569' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#334155' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
                <TrendingUp size={40} className="opacity-30" />
                <p className="font-medium">No application data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Application Status Distribution */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 px-1">
            <PieChart size={20} className="text-slate-500" />
            Status Breakdown
          </h3>

          <div className="bg-white rounded border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[350px] shadow-sm">
            {statusDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      dataKey="value"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="w-full mt-6 space-y-2">
                  {statusDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs font-semibold text-slate-700 capitalize">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 space-y-3">
                <CheckCircle size={40} className="opacity-30" />
                <p className="font-medium">No applications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time Applicant Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock size={20} className="text-slate-500" />
              Recent Applications
            </h3>
          </div>

          <div className="bg-white rounded border border-slate-200 p-4 space-y-2 shadow-sm">
            {recentApplications.length > 0 ? recentApplications.map((app, index) => {
              const studentName = app.student?.name || 'Unknown';
              const role = app.jobPosting?.title || 'Unknown Role';
              const appDate = app.appliedDate || app.createdAt;
              const isNew = Date.now() - new Date(appDate).getTime() < 24 * 60 * 60 * 1000;
              return (
                <div key={app._id || index} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100 hover:border-slate-300 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-600 font-bold text-sm">
                      {getInitials(studentName)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{studentName}</p>
                      <p className="text-xs text-slate-500 font-medium">{role}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    {isNew && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">New</span>}
                    <p className="text-xs font-semibold text-slate-400">{getTimeAgo(appDate)}</p>
                  </div>
                </div>
              );
            }) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-2">
                <Users size={36} className="opacity-30" />
                <p className="font-medium text-sm">No applications yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Operations Console */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 px-1">
            <Settings size={20} className="text-slate-500" />
            Operations Console
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Job Board', desc: 'Manage active roles', icon: Briefcase },
              { title: 'Talent Pool', desc: 'Review applications', icon: Users },
              { title: 'Interviews', desc: 'Coordinate syncs', icon: Calendar },
              { title: 'Offer Lab', desc: 'Release contracts', icon: Trophy }
            ].map((action, i) => (
              <button key={i} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 p-4 bg-white border border-slate-200 rounded shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-colors group">
                <div className={`w-10 h-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 group-hover:bg-white group-hover:border group-hover:border-slate-200`}>
                  <action.icon size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{action.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">{action.desc}</p>
                </div>
              </button>
            ))}

            <div className="sm:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded shadow-sm relative overflow-hidden group cursor-pointer block">
              <div className="relative z-10">
                <h4 className="text-base font-bold text-white mb-1">Recruitment Analytics</h4>
                <p className="text-slate-400 text-sm font-medium mb-4 leading-relaxed">Live metrics powered by your recruitment data.</p>
                <button className="flex items-center gap-1 text-slate-300 font-semibold text-xs hover:text-white transition-colors">
                  Access Intelligence Suite
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
