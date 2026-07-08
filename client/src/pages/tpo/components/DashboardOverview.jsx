import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Building2, Trophy, TrendingUp, Target, Calendar,
  RefreshCw, Briefcase, ArrowUpRight, ShieldCheck, Loader2,
  GraduationCap, CheckCircle2, Clock, AlertCircle, ChevronRight,
  Activity, BarChart3
} from 'lucide-react';
import tpoApi from '../../../services/tpoApi';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserDisplayName } from '../../../utils/helpers';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
};

const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n ?? 0));

const fmtPkg = (v) => {
  const n = Number(v);
  if (!isNaN(n) && n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return v ? `₹${v}` : '—';
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, color, bg, sub, trend }) => (
  <div className="bg-white rounded border border-slate-200 shadow-sm p-5 flex items-start justify-between group hover:shadow-md transition-all duration-200">
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{value}</p>
      {sub && (
        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          {trend === 'up' && <ArrowUpRight size={12} className="text-emerald-500" />}
          {sub}
        </p>
      )}
    </div>
    <div className={`p-3 rounded border border-slate-100 ${bg} ${color} shrink-0 group-hover:scale-110 transition-transform`}>
      <Icon size={20} />
    </div>
  </div>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded shadow-lg px-4 py-3 text-sm">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DashboardOverview = () => {
  const { user } = useAuth();
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]       = useState(null);
  const [data, setData]         = useState(null);
  const [trends, setTrends]     = useState([]);

  const fetchAll = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      const [statsRes, trendsRes] = await Promise.allSettled([
        tpoApi.getDashboardStats(),
        tpoApi.getPlacementTrends?.(),
      ]);

      if (statsRes.status === 'fulfilled') setData(statsRes.value);
      if (trendsRes.status === 'fulfilled') {
        const t = trendsRes.value;
        // tpoApi returns the unwrapped data object: { trends: [...] }
        const arr = t?.trends || t?.data?.trends || [];
        if (arr.length) setTrends(arr);
      }
    } catch (e) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const iv = setInterval(() => fetchAll(true), 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, [fetchAll]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-slate-400 animate-spin mb-4" />
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Dashboard…</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertCircle className="w-12 h-12 text-rose-400 mb-4" />
      <p className="font-bold text-slate-800 mb-1">Something went wrong</p>
      <p className="text-sm text-slate-500 mb-6">{error}</p>
      <button onClick={() => fetchAll()} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded hover:bg-slate-800 transition-colors">
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );

  const s = data?.stats || {};
  const drives = data?.upcomingDrives || [];

  const stats = [
    { title: 'Total Students',       value: fmt(s.totalStudents),    icon: Users,        color: 'text-blue-600',    bg: 'bg-blue-50',    sub: `${fmt(s.placedStudents)} placed`, trend: 'up' },
    { title: 'Placement Rate',       value: `${s.placementRate ?? 0}%`, icon: Target,    color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'of enrolled students', trend: 'up' },
    { title: 'Total Offers',         value: fmt(s.totalOffers),      icon: Trophy,       color: 'text-purple-600',  bg: 'bg-purple-50',  sub: `${fmt(s.totalApplications)} applications` },
    { title: 'Average Package',      value: fmtPkg(s.averagePackage), icon: TrendingUp,  color: 'text-amber-600',   bg: 'bg-amber-50',   sub: 'CTC per annum' },
    { title: 'Active Companies',     value: fmt(s.activeCompanies),  icon: Building2,    color: 'text-indigo-600',  bg: 'bg-indigo-50',  sub: 'partner organisations' },
    { title: 'Upcoming Drives',      value: fmt(s.upcomingDrives),   icon: Calendar,     color: 'text-rose-600',    bg: 'bg-rose-50',    sub: 'scheduled this cycle' },
  ];

  // Chart: placement growth
  const chartData = trends.length > 0 ? trends : [
    { month: 'Now', applications: s.totalApplications ?? 0, placements: s.placedStudents ?? 0 },
  ];

  // Dept bar chart — use real API data, fallback to empty
  const departmentData = (data?.departmentStats || []).slice(0, 7).map(d => ({
    dept: d.department,
    rate: d.rate ?? 0,
  }));
  const BAR_COLORS = ['#3b82f6','#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#14b8a6'];

  return (
    <div className="space-y-8 pb-20">

      {/* ── Hero Banner ──────────────────────────────────────────── */}
      <div className="relative bg-slate-900 rounded overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 border border-white/20 rounded flex items-center justify-center">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">TPO Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              {greeting()} <span className="text-blue-400">{getUserDisplayName(user)}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium max-w-md">
              {user?.instituteName || 'Your institution'} · Placement cycle management
            </p>
          </div>
          <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white text-sm font-bold rounded hover:bg-white/20 transition-colors self-start md:self-auto"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {/* Quick stat strip */}
        <div className="relative z-10 grid grid-cols-3 border-t border-white/10">
          {[
            { label: 'Students',    val: fmt(s.totalStudents) },
            { label: 'Offers Out',  val: fmt(s.totalOffers) },
            { label: 'Placed',      val: `${s.placementRate ?? 0}%` },
          ].map((q, i) => (
            <div key={i} className={`px-6 py-4 text-center ${i < 2 ? 'border-r border-white/10' : ''}`}>
              <p className="text-2xl font-black text-white">{q.val}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{q.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stat Cards Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {stats.map((st, i) => <StatCard key={i} {...st} />)}
      </div>

      {/* ── Charts Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Placement Growth Area Chart */}
        <div className="xl:col-span-2 bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity size={16} className="text-blue-500" /> Placement Growth
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Applications vs placements — last 12 months</p>
            </div>
          </div>
          <div className="p-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPlace" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gApps)" dot={false} />
                <Area type="monotone" dataKey="placements"   name="Placements"   stroke="#10b981" strokeWidth={2.5} fill="url(#gPlace)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Placement Bar Chart */}
        <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 size={16} className="text-violet-500" /> By Department
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Placement rate per branch</p>
          </div>
          <div className="p-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barSize={10}>
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="dept" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} width={32} />
                <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(v) => [`${v}%`, 'Placed']} />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                  {departmentData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Upcoming Drives */}
        <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target size={16} className="text-rose-500" /> Active Drives
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Upcoming placement drives</p>
            </div>
            {drives.length > 0 && (
              <span className="text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded uppercase tracking-widest">
                {drives.length} Active
              </span>
            )}
          </div>
          <div className="divide-y divide-slate-100">
            {drives.length > 0 ? drives.slice(0, 5).map((d, i) => (
              <div key={d._id || i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-blue-600 transition-colors">
                  <Building2 size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{d.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {d.company || 'Company'} · {d.applications ?? 0} applied
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold text-blue-600 uppercase">
                    {d.deadline ? new Date(d.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                  </p>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded uppercase">Live</span>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Calendar size={28} className="text-slate-200 mb-3" />
                <p className="text-sm font-semibold text-slate-400">No active drives</p>
                <p className="text-xs text-slate-300 mt-1">Drive requests will appear here once approved</p>
              </div>
            )}
          </div>
        </div>

        {/* Pipeline Status */}
        <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap size={16} className="text-indigo-500" /> Placement Pipeline
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Current batch overview</p>
          </div>
          <div className="p-6 space-y-5">
            {[
              { label: 'Enrolled Students',  val: s.totalStudents,    icon: Users,         color: 'bg-blue-500',    pct: 100 },
              { label: 'Applications Filed', val: s.totalApplications, icon: Briefcase,     color: 'bg-indigo-500',  pct: s.totalStudents > 0 ? Math.round((s.totalApplications / s.totalStudents) * 100) : 0 },
              { label: 'Offers Received',    val: s.totalOffers,       icon: Trophy,        color: 'bg-purple-500',  pct: s.totalApplications > 0 ? Math.round((s.totalOffers / s.totalApplications) * 100) : 0 },
              { label: 'Placed Students',    val: s.placedStudents,    icon: CheckCircle2,  color: 'bg-emerald-500', pct: s.totalStudents > 0 ? Math.round((s.placedStudents / s.totalStudents) * 100) : 0 },
            ].map((row, i) => {
              const Icon = row.icon;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon size={13} className="text-slate-500" />
                      <span className="text-xs font-bold text-slate-700">{row.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{fmt(row.val ?? 0)}</span>
                      <span className="text-[10px] font-bold text-slate-400">{row.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${row.color} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.min(100, row.pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="mt-4 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded border border-slate-200 p-4 text-center">
                <p className="text-2xl font-black text-slate-900">{fmt(s.activeCompanies)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Partner Companies</p>
              </div>
              <div className="bg-emerald-50 rounded border border-emerald-200 p-4 text-center">
                <p className="text-2xl font-black text-emerald-700">{s.placementRate ?? 0}%</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Overall Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
