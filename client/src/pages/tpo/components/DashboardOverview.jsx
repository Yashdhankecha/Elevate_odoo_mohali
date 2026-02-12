import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Trophy, 
  TrendingUp,
  Briefcase,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Bell,
  RefreshCw,
  Search,
  ArrowRight,
  Target,
  Clock,
  Plus,
  Zap,
  Activity,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Loader2,
  BarChart3 as FileBarChart
} from 'lucide-react';
import tpoApi from '../../../services/tpoApi';
import { useNotifications } from '../../../contexts/NotificationContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0, placedStudents: 0, activeCompanies: 0, totalApplications: 0,
      totalOffers: 0, averagePackage: 0, placementRate: 0, upcomingDrives: 0
    },
    recentActivities: [],
    upcomingDrives: []
  });
  
  const { notifications, unreadCount } = useNotifications();

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => fetchDashboardData(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const response = await tpoApi.getDashboardStats();
      setDashboardData(response);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatPackage = (v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v}`;

  const stats = [
    { title: 'Total Students', value: dashboardData.stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Registered Companies', value: dashboardData.stats.activeCompanies, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Total Offers', value: dashboardData.stats.totalOffers, icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Average Package', value: formatPackage(dashboardData.stats.averagePackage), icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Placement Rate', value: `${dashboardData.stats.placementRate}%`, icon: Target, color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Upcoming Drives', value: dashboardData.stats.upcomingDrives, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' }
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
             <ShieldCheck size={32} className="text-blue-600" />
             TPO Dashboard
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Overview of student placements, company drives, and institutional success.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => fetchDashboardData(true)} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-95 text-slate-400">
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 hover:shadow-2xl transition-all font-bold uppercase text-[11px] tracking-widest active:scale-95 group">
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
             Create New Drive
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="group glass-card p-6 rounded-[2.5rem] hover-lift border-white/50 relative overflow-hidden transition-all duration-500">
             <div className="flex flex-col gap-5 relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                   <stat.icon size={20} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.title}</p>
                </div>
             </div>
             <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <stat.icon size={100} />
             </div>
          </div>
        ))}
      </div>

      {/* Analytics & Drives */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
               <Activity size={20} className="text-blue-600" />
               Placement Growth
            </h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/50 rounded-2xl border border-slate-100">
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Batch 2024 Records</span>
            </div>
          </div>
          
          <div className="glass-card rounded-[3rem] p-10 h-[450px] shadow-2xl shadow-slate-200/50">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={[
                 {name: 'Jan', val: 30}, {name: 'Feb', val: 45}, {name: 'Mar', val: 62}, 
                 {name: 'Apr', val: 85}, {name: 'May', val: 92}, {name: 'Jun', val: 110},
                 {name: 'Jul', val: 140}, {name: 'Aug', val: 180}
               ]}>
                 <defs>
                   <linearGradient id="colorFlux" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                 <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '12px' }} />
                 <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={5} fillOpacity={1} fill="url(#colorFlux)" strokeLinecap="round" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Drives */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight px-4 flex items-center gap-2 uppercase">
             <Target size={20} className="text-rose-600" />
             Current Drives
          </h3>
          <div className="glass-card rounded-[3rem] p-8 space-y-5 relative overflow-hidden h-[450px] flex flex-col justify-between shadow-2xl shadow-slate-200/50">
             <div className="space-y-5 relative z-10 overflow-y-auto custom-scrollbar pr-2">
                {dashboardData.upcomingDrives.length > 0 ? (
                  dashboardData.upcomingDrives.slice(0, 5).map((drive) => (
                    <div key={drive._id || Math.random()} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-md rounded-[2rem] border border-slate-50 hover:border-blue-100 transition-all group cursor-pointer hover:shadow-xl hover:shadow-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-all shadow-xl">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[120px] tracking-tight">{drive.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{drive.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-blue-600">{drive.applications} APPS</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                           {new Date(drive.deadline).toLocaleDateString('en-IN', {month: 'short', day: 'numeric'})}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto ring-4 ring-slate-100/50 shadow-inner">
                       <Calendar size={28} className="text-slate-300" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-xs">No active drives</p>
                  </div>
                )}
             </div>
             
             <button className="w-full py-4 text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50/50 hover:bg-blue-600 hover:text-white rounded-[1.5rem] transition-all border border-blue-100 relative z-10 active:scale-95">
               View All Drives
             </button>
          </div>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="grid lg:grid-cols-2 gap-8">
         <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3 px-4 uppercase">
               <Clock size={20} className="text-amber-500" />
               Recent Activities
            </h3>
            <div className="glass-card rounded-[3rem] p-8 space-y-5 shadow-2xl shadow-slate-200/50">
               {[
                 {msg: 'TCS released shortlist for 45 students', time: '2 hours ago', type: 'info'},
                 {msg: 'Adobe interview schedule finalized', time: '5 hours ago', type: 'success'},
                 {msg: '12 resumes pending for verification', time: '8 hours ago', type: 'warning'}
               ].map((event, i) => (
                 <div key={i} className="flex gap-4 items-start p-5 hover:bg-slate-50/50 rounded-[2rem] transition-all border border-transparent hover:border-slate-100 group">
                    <div className={`w-2.5 h-2.5 rounded-full mt-2.5 flex-shrink-0 ${
                      event.type === 'warning' ? 'bg-amber-500 animate-pulse' : 
                      event.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                    }`}></div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-slate-800 leading-none mb-1 group-hover:text-blue-600 transition-colors tracking-tight">{event.msg}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.time}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl shadow-slate-300">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
               <Layers size={250} className="text-white" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-10">
               <div className="space-y-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                     <Zap className="text-white" size={24} />
                  </div>
                  <h4 className="text-4xl font-black text-white leading-[1.1] tracking-tighter uppercase">
                     Generate <br /> Placement <br /> Reports
                  </h4>
                  <p className="text-slate-400 font-medium opacity-80 max-w-xs leading-relaxed text-sm">Download detailed placement performance reports for the current academic session.</p>
               </div>
               <button className="flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-3xl font-bold uppercase text-[11px] tracking-widest hover:gap-6 transition-all w-fit shadow-2xl active:scale-95 group">
                  Open Reports Portal
                  <ArrowRight size={18} className="group-hover:translate-x-1" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
