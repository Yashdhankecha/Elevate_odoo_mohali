import React, { useState, useEffect } from 'react';
import {
  Users, Building2, Briefcase, ShieldAlert, TrendingUp, Activity,
  ShieldCheck, UserPlus, ArrowUpRight, Loader2, RefreshCw,
  GraduationCap, CheckCircle2, Clock, Zap, BarChart3, Database
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserDisplayName } from '../../../utils/helpers';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

const StatCard = ({ label, value, icon: Icon, color, bg, sub, subColor = 'text-emerald-600', subBg = 'bg-emerald-50' }) => (
  <div className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
    <div className="flex flex-col gap-4 relative z-10">
      <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon size={22} />
      </div>
      <div>
        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{typeof value === 'number' ? value.toLocaleString() : value}</h4>
        <div className="flex items-center justify-between mt-1.5 gap-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          {sub && <span className={`text-[9px] font-bold ${subColor} ${subBg} px-2 py-0.5 rounded-full whitespace-nowrap`}>{sub}</span>}
        </div>
      </div>
    </div>
    <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
      <Icon size={110} />
    </div>
  </div>
);

const SectionTitle = ({ icon: Icon, title, badge }) => (
  <div className="flex items-center justify-between px-1 mb-5">
    <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
      <Icon size={18} className="text-blue-600" />{title}
    </h3>
    {badge && <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">{badge}</span>}
  </div>
);

const getTimeAgo = (date) => {
  const diff = Date.now() - new Date(date);
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
};

const activityIconMap = {
  student: { bg: 'bg-blue-100', color: 'text-blue-600', Icon: Users },
  tpo: { bg: 'bg-purple-100', color: 'text-purple-600', Icon: ShieldCheck },
  company: { bg: 'bg-emerald-100', color: 'text-emerald-600', Icon: Building2 },
  job: { bg: 'bg-amber-100', color: 'text-amber-600', Icon: Briefcase },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 text-xs font-bold">
      <p className="text-slate-500 uppercase tracking-widest mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const DashboardOverview = ({ onNavigateToSection }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [trendKey, setTrendKey] = useState('students');

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning,';
    if (h < 17) return 'Good afternoon,';
    return 'Good evening,';
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/superadmin/dashboard-stats');
      const payload = res.data?.data ?? res.data;
      setData(payload);
    } catch (e) {
      console.error('Dashboard stats error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading real-time data...</p>
    </div>
  );

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Database size={40} className="text-slate-200 mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Failed to load dashboard</p>
      <button onClick={fetchStats} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2">
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );

  const topStats = [
    { label: 'Total Students', value: data.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', sub: `${data.placedStudents} placed`, subColor: 'text-blue-600', subBg: 'bg-blue-50' },
    { label: 'Companies', value: data.totalCompanies, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: `${data.activeCompanies} active` },
    { label: 'TPO Accounts', value: data.totalTPOs, icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50', sub: `${data.activeTPOs} active`, subColor: 'text-purple-600', subBg: 'bg-purple-50' },
    { label: 'Job Postings', value: data.totalJobs, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50', sub: `${data.activeJobs} active`, subColor: 'text-amber-600', subBg: 'bg-amber-50' },
    { label: 'Applications', value: data.totalApplications, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50', sub: `${data.offerRate}% offer rate`, subColor: 'text-rose-600', subBg: 'bg-rose-50' },
    { label: 'Placement Rate', value: `${data.placementRate}%`, icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50', sub: `${data.placedStudents} placed` , subColor: 'text-teal-600', subBg: 'bg-teal-50' },
    { label: 'Pending TPOs', value: data.pendingTPOs, icon: UserPlus, color: 'text-orange-600', bg: 'bg-orange-50', sub: 'awaiting review', subColor: 'text-orange-600', subBg: 'bg-orange-50' },
    { label: 'Pending Companies', value: data.pendingCompanies, icon: ShieldAlert, color: 'text-pink-600', bg: 'bg-pink-50', sub: 'awaiting review', subColor: 'text-pink-600', subBg: 'bg-pink-50' },
  ];

  const trendOptions = [
    { key: 'students', label: 'Students', color: '#2563eb' },
    { key: 'companies', label: 'Companies', color: '#10b981' },
    { key: 'tpos', label: 'TPOs', color: '#8b5cf6' },
    { key: 'jobs', label: 'Jobs', color: '#f59e0b' },
  ];

  return (
    <div className="space-y-10 pb-24">

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Super Admin</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              {getGreeting()} <span className="text-emerald-400">{getUserDisplayName(user)}</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium max-w-md">Platform overview with live data from all collections.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Users</p>
              <p className="text-4xl font-black text-white">{(data.totalStudents + data.totalTPOs + data.totalCompanies).toLocaleString()}</p>
            </div>
            <button onClick={fetchStats} className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      </div>

      {/* ─── Pending alerts ───────────────────────────────────────── */}
      {(data.pendingTPOs > 0 || data.pendingCompanies > 0) && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <ShieldAlert size={22} className="text-amber-500 animate-pulse flex-shrink-0" />
          <p className="text-amber-700 font-bold text-sm flex-1">
            {data.pendingTPOs > 0 && `${data.pendingTPOs} TPO request${data.pendingTPOs > 1 ? 's' : ''}`}
            {data.pendingTPOs > 0 && data.pendingCompanies > 0 && ' and '}
            {data.pendingCompanies > 0 && `${data.pendingCompanies} company request${data.pendingCompanies > 1 ? 's' : ''}`}
            {' '}awaiting your approval.
          </p>
          <div className="flex gap-2">
            {data.pendingTPOs > 0 && <button onClick={() => onNavigateToSection('tpo-approval')} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-amber-600 transition-all">TPO Approvals <ArrowUpRight size={12} /></button>}
            {data.pendingCompanies > 0 && <button onClick={() => onNavigateToSection('company-approval')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-700 transition-all">Companies <ArrowUpRight size={12} /></button>}
          </div>
        </div>
      )}

      {/* ─── Stat cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {topStats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* ─── Registration Trend + Activity ────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <SectionTitle icon={TrendingUp} title="Registration Trend" badge="Last 12 months" />
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl flex-wrap">
              {trendOptions.map(opt => (
                <button key={opt.key} onClick={() => setTrendKey(opt.key)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${trendKey === opt.key ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data.registrationTrend}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={trendOptions.find(t => t.key === trendKey)?.color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={trendOptions.find(t => t.key === trendKey)?.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey={trendKey} name={trendOptions.find(t => t.key === trendKey)?.label}
                stroke={trendOptions.find(t => t.key === trendKey)?.color} strokeWidth={3}
                fill="url(#grad)" strokeLinecap="round" dot={false} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
              <Clock size={18} className="text-blue-600" /> Activity
            </h3>
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-rose-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" /> Live
            </span>
          </div>
          <div className="space-y-3 overflow-y-auto flex-1 max-h-[340px] pr-1">
            {data.recentActivities?.length > 0 ? data.recentActivities.map((act, i) => {
              const meta = activityIconMap[act.type] || activityIconMap.student;
              return (
                <div key={i} className="flex gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all group">
                  <div className={`w-9 h-9 ${meta.bg} ${meta.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <meta.Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 leading-snug truncate">{act.message}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{getTimeAgo(act.time)}</p>
                  </div>
                </div>
              );
            }) : (
              <div className="flex-1 flex items-center justify-center py-12">
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">No activity yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Application Funnel + Branch Dist ─────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Application Funnel */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <SectionTitle icon={BarChart3} title="Application Funnel" badge="All Time" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.applicationFunnel} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} allowDecimals={false} />
              <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Count" radius={[0, 8, 8, 0]}>
                {data.applicationFunnel.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Branch Distribution */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <SectionTitle icon={GraduationCap} title="Student Branches" badge="Distribution" />
          {data.branchDistribution?.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={240}>
                <PieChart>
                  <Pie data={data.branchDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                    dataKey="value" paddingAngle={3}>
                    {data.branchDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {data.branchDistribution.map((b, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-[11px] font-bold text-slate-600">{b.name}</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-900">{b.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">No student data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Industry Breakdown + Top Companies ───────────────────── */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Industry */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <SectionTitle icon={BarChart3} title="Job Industry Breakdown" badge="By postings" />
          {data.industryBreakdown?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.industryBreakdown} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} interval={0} angle={-20} textAnchor="end" height={45} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Jobs" radius={[8, 8, 0, 0]}>
                  {data.industryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">No job postings yet</p>
            </div>
          )}
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <SectionTitle icon={Building2} title="Top Companies" badge="By postings" />
          {data.topCompanies?.length > 0 ? (
            <div className="space-y-4 mt-2">
              {data.topCompanies.map((c, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all group">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">{c.name || 'Unknown'}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{c.jobs} posting{c.jobs > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 w-24">
                      <div className="h-1.5 rounded-full bg-blue-600 transition-all"
                        style={{ width: `${Math.round((c.jobs / (data.topCompanies[0]?.jobs || 1)) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">No company data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── TPO & Company Status Breakdown ───────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-8">
        {[
          { title: 'TPO Status', data: data.tpoStatus, total: data.totalTPOs },
          { title: 'Company Status', data: data.companyStatus, total: data.totalCompanies },
        ].map(({ title, data: sd, total }) => (
          <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <SectionTitle icon={CheckCircle2} title={title} />
            <div className="space-y-3">
              {[
                { label: 'Active', value: sd?.active || 0, color: 'bg-emerald-500' },
                { label: 'Pending', value: sd?.pending || 0, color: 'bg-amber-400' },
                { label: 'Rejected', value: sd?.rejected || 0, color: 'bg-rose-500' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-600">{label}</span>
                    <span className="text-[11px] font-black text-slate-900">{value}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${color} transition-all duration-700`}
                      style={{ width: total > 0 ? `${Math.round((value / total) * 100)}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DashboardOverview;
