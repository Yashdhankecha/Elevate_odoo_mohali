import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Briefcase, 
  ShieldAlert, 
  Clock, 
  RefreshCw,
  Cpu,
  Activity,
  Zap,
  ShieldCheck,
  UserPlus,
  TrendingUp,
  Globe,
  Loader2,
  ArrowUpRight,
  Database
} from 'lucide-react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

const DashboardOverview = ({ onNavigateToSection }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0, totalCompanies: 0, totalJobPostings: 0, totalApplications: 0,
    pendingTPOs: 0, pendingCompanies: 0, recentActivities: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [studentsRes, companiesRes, jobsRes, applicationsRes, pendingRes, activitiesRes] = await Promise.all([
        api.get('/admin/total-students'),
        api.get('/admin/total-companies'),
        api.get('/admin/total-job-postings'),
        api.get('/admin/total-applications'),
        api.get('/admin/pending-registrations'),
        api.get('/admin/recent-activities')
      ]);

      const pendingUsers = pendingRes.data.pendingUsers || [];
      setDashboardData({
        totalStudents: studentsRes.data.count || 0,
        totalCompanies: companiesRes.data.count || 0,
        totalJobPostings: jobsRes.data.count || 0,
        totalApplications: applicationsRes.data.count || 0,
        pendingTPOs: pendingUsers.filter(user => user.role === 'tpo').length,
        pendingCompanies: pendingUsers.filter(user => user.role === 'company').length,
        recentActivities: activitiesRes.data.activities || []
      });
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Dashboard Data...</p>
    </div>
  );

  const stats = [
    { label: 'Total Students', value: dashboardData.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Growing' },
    { label: 'Total Companies', value: dashboardData.totalCompanies, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Active' },
    { label: 'Job Postings', value: dashboardData.totalJobPostings, icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Live' },
    { label: 'Total Applications', value: dashboardData.totalApplications, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Processing' }
  ];

  return (
    <div className="space-y-10 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
             Dashboard Overview
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Overview of all students, companies, and platforms activities.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 shadow-sm rounded-2xl font-bold text-[11px] uppercase tracking-widest text-emerald-600">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
             System Status: Online
          </div>
          <button onClick={fetchDashboardData} className="p-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-blue-600 hover:bg-white transition-all active:scale-95">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="group glass-card p-6 rounded-[2.5rem] hover-lift border-white/50 relative overflow-hidden transition-all duration-500">
             <div className="flex flex-col gap-6 relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                   <stat.icon size={20} />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value.toLocaleString()}</h4>
                  <div className="flex items-center justify-between mt-1">
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                     <p className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.trend}</p>
                  </div>
                </div>
             </div>
             <div className="absolute -bottom-6 -right-6 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity">
                <stat.icon size={120} />
             </div>
          </div>
        ))}
      </div>

      {/* Pending Approvals */}
      {(dashboardData.pendingTPOs > 0 || dashboardData.pendingCompanies > 0) && (
        <div className="bg-slate-900 rounded-[3rem] p-1.5 shadow-2xl shadow-slate-300 overflow-hidden relative group">
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 p-10 opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-1000">
              <Zap size={200} className="text-amber-400" />
           </div>

           <div className="flex flex-col lg:flex-row gap-1.5 relative z-10">
              <div className="p-8 lg:w-1/3 flex flex-col justify-center">
                 <div className="flex items-center gap-3 mb-2">
                    <ShieldAlert size={28} className="text-amber-400 animate-pulse" />
                    <h3 className="text-white font-black text-2xl tracking-tighter uppercase">Approvals Needed</h3>
                 </div>
                 <p className="text-slate-400 font-medium text-sm leading-relaxed">There are registration requests waiting for your approval.</p>
              </div>

              <div className="lg:w-2/3 grid md:grid-cols-2 gap-1.5 p-1.5 bg-slate-800/30 rounded-[2.5rem]">
                 {dashboardData.pendingTPOs > 0 && (
                    <div className="bg-slate-800/60 backdrop-blur-xl hover:bg-slate-800 transition-all p-7 rounded-[2.2rem] flex items-center justify-between group/card border border-white/5">
                       <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-amber-400/10 text-amber-400 rounded-3xl flex items-center justify-center group-hover/card:scale-110 group-hover/card:shadow-[0_0_30px_rgba(251,191,36,0.2)] transition-all">
                             <UserPlus size={28} />
                          </div>
                          <div>
                             <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-1 whitespace-nowrap">Pending TPOs</p>
                             <h4 className="text-2xl font-black text-white leading-none whitespace-nowrap">{dashboardData.pendingTPOs} Requests</h4>
                          </div>
                       </div>
                       <button onClick={() => onNavigateToSection('tpo-approval')} className="p-3 bg-amber-400 text-slate-900 rounded-2xl hover:bg-white transition-all shadow-xl shadow-amber-400/10 active:scale-90">
                          <ArrowUpRight size={20} strokeWidth={3} />
                       </button>
                    </div>
                 )}
                 
                 {dashboardData.pendingCompanies > 0 && (
                    <div className="bg-slate-800/60 backdrop-blur-xl hover:bg-slate-800 transition-all p-7 rounded-[2.2rem] flex items-center justify-between group/card border border-white/5">
                       <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-blue-400/10 text-blue-400 rounded-3xl flex items-center justify-center group-hover/card:scale-110 group-hover/card:shadow-[0_0_30px_rgba(96,165,250,0.2)] transition-all">
                             <Building2 size={28} />
                          </div>
                          <div>
                             <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-1 whitespace-nowrap">Pending Companies</p>
                             <h4 className="text-2xl font-black text-white leading-none whitespace-nowrap">{dashboardData.pendingCompanies} Requests</h4>
                          </div>
                       </div>
                       <button onClick={() => onNavigateToSection('company-approval')} className="p-3 bg-blue-400 text-white rounded-2xl hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-blue-400/10 active:scale-90">
                          <ArrowUpRight size={20} strokeWidth={3} />
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Analytics Graph */}
      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-4">
               <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
                  <TrendingUp size={20} className="text-blue-600" />
                  Growth Overview
               </h3>
               <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  Weekly Progress Analytics
               </div>
            </div>
            <div className="glass-card rounded-[3rem] p-10 h-[450px] shadow-2xl shadow-slate-200/50">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    {name: 'W1', s: 100}, {name: 'W2', s: 220}, {name: 'W3', s: 380}, 
                    {name: 'W4', s: 520}, {name: 'W5', s: 790}, {name: 'W6', s: 1050}
                  ]}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '12px' }} />
                    <Area type="monotone" dataKey="s" name="Total Students" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#colorStudents)" strokeLinecap="round" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Recent Activity */}
         <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight px-4 flex items-center justify-between uppercase">
               Recent Activity
               <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" /> Live Updates
               </span>
            </h3>
            <div className="glass-card rounded-[3rem] p-8 space-y-5 max-h-[450px] overflow-y-auto custom-scrollbar shadow-2xl shadow-slate-200/50">
               {dashboardData.recentActivities.length > 0 ? (
                 dashboardData.recentActivities.map((activity, i) => (
                   <div key={i} className="flex gap-5 p-5 hover:bg-slate-50 rounded-[2rem] transition-all border border-transparent hover:border-slate-100 group">
                      <div className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                         <Clock size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors tracking-tight">{activity.message}</p>
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                               {new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                         </div>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                       <Database size={28} className="text-slate-200" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-xs">No activity yet</p>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
