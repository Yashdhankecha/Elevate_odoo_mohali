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
  AlertCircle
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
        <p className="text-gray-700 font-semibold">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
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
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Recruitment Console</h1>
          <p className="text-gray-500 font-medium">Live data from your recruitment pipeline</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group glass-card p-6 rounded-[2rem] hover-lift border-white/50 relative overflow-hidden">
              <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-[0.03] rounded-full`}></div>

              <div className="flex flex-col gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                  <Icon className="text-white" size={24} />
                </div>

                <div>
                  <h4 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h4>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.sub}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Trends */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              Application Trends (Last 6 Months)
            </h3>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 min-h-[400px]">
            {applicationTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={applicationTrends}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dx={-10} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#3B82F6', strokeWidth: 2, strokeDasharray: '5 5' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#3B82F6"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorApps)"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
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
          <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2 px-2">
            <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
            Status Breakdown
          </h3>

          <div className="glass-card rounded-[2.5rem] p-8 flex flex-col items-center justify-center min-h-[400px]">
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

                <div className="w-full mt-6 space-y-3">
                  {statusDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-bold text-gray-700 capitalize">{item.name}</span>
                      </div>
                      <span className="text-sm font-black text-gray-900">{item.value}</span>
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
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Recent Applications
            </h3>
          </div>

          <div className="glass-card rounded-[2.5rem] p-4 space-y-3">
            {recentApplications.length > 0 ? recentApplications.map((app, index) => {
              const studentName = app.student?.name || 'Unknown';
              const role = app.jobPosting?.title || 'Unknown Role';
              const appDate = app.appliedDate || app.createdAt;
              const isNew = Date.now() - new Date(appDate).getTime() < 24 * 60 * 60 * 1000;
              return (
                <div key={app._id || index} className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-50 hover:border-blue-100 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-black text-sm group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-500">
                      {getInitials(studentName)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{studentName}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isNew ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {isNew ? 'New' : 'Viewed'}
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 opacity-60">{getTimeAgo(appDate)}</p>
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
          <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2 px-2">
            <Settings size={20} className="text-indigo-600" />
            Operations Console
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Job Board', desc: 'Create & manage active roles', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Talent Pool', desc: 'Review pending applications', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
              { title: 'Interviews', desc: 'Coordinate meeting syncs', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { title: 'Offer Lab', desc: 'Release employment contracts', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' }
            ].map((action, i) => (
              <button key={i} className="flex items-start gap-4 p-6 glass-card rounded-[2.5rem] hover:bg-gray-50/50 transition-all group text-left">
                <div className={`w-12 h-12 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <action.icon size={20} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 tracking-tight uppercase text-xs">{action.title}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{action.desc}</p>
                </div>
              </button>
            ))}

            <div className="sm:col-span-2 p-8 bg-gradient-to-br from-gray-900 to-slate-800 rounded-[2.5rem] relative overflow-hidden group cursor-pointer shadow-xl shadow-slate-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-2">Recruitment Analytics</h4>
                <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">Live metrics powered by your actual recruitment data.</p>
                <button className="flex items-center gap-2 text-blue-400 font-black uppercase text-[10px] tracking-widest hover:gap-4 transition-all">
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
