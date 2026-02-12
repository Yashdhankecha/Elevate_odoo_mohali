import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  BookOpen, 
  BarChart3, 
  Briefcase, 
  History,
  Trophy,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  Zap,
  ArrowUpRight,
  Sparkles,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserDisplayName } from '../../../utils/helpers';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
    </div>
  );

  if (!dashboardData) return (
    <div className="glass-card rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 text-center max-w-xl mx-auto mt-10 md:mt-20 border-white/50 shadow-2xl shadow-slate-200/50 flex flex-col items-center">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-rose-50 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mb-6 md:mb-8 border border-rose-100 shadow-inner">
        <Target size={32} className="text-rose-500" />
      </div>
      <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter mb-3 uppercase">Error Connecting</h3>
      <p className="text-slate-500 text-sm font-medium mb-8 md:mb-10 leading-relaxed max-w-md">We couldn't connect to the server. Please check your internet connection.</p>
      <button onClick={fetchDashboardData} className="w-full md:w-auto px-10 md:px-12 py-4 bg-slate-900 text-white rounded-[1.2rem] md:rounded-[1.5rem] font-bold uppercase text-[10px] md:text-[11px] tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">Try Again</button>
    </div>
  );

  const { stats, recentActivities } = dashboardData;

  const metrics = [
    { title: 'Applications', value: stats.applicationsSubmitted, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Submitted' },
    { title: 'Practice Sessions', value: stats.practiceSessions, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'Active' },
    { title: 'Skills Mastered', value: stats.skillsMastered, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Completed' },
    { title: 'Test Score', value: `${stats.averageTestScore}%`, icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Average' },
    { title: 'Interviews', value: stats.interviewsScheduled, icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Scheduled' },
    { title: 'Profile Completion', value: `${stats.profileCompletion}%`, icon: CheckCircle2, color: 'text-cyan-600', bg: 'bg-cyan-50', trend: 'Status' }
  ];

  return (
    <div className="space-y-8 md:space-y-12 pb-24">
      {/* Welcome Area */}
      <div className="relative group overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] bg-[#0f172a] p-8 md:p-14 shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3)]">
         <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]"></div>
         
         <div className="relative z-10 grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3 space-y-6">
               <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest shadow-2xl">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  System Status: Active
               </div>
               
               <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-tight md:leading-none">
                  Hello, <br />
                  <span className="text-blue-400">{getUserDisplayName(user)}!</span>
               </h1>
               
               <p className="text-slate-400 text-base md:text-xl font-medium max-w-xl leading-relaxed">
                  Your progress is looking great! You have <span className="text-white font-bold">{stats.interviewsScheduled} interviews</span> coming up soon.
               </p>
               
               <div className="pt-4 md:pt-6 flex flex-col sm:flex-row gap-4">
                  <button className="px-8 md:px-10 py-4 bg-white text-slate-900 rounded-[1.2rem] md:rounded-[1.5rem] font-bold uppercase text-[10px] md:text-[11px] tracking-widest hover:scale-105 transition-all active:scale-95 flex items-center justify-center md:justify-start gap-2">
                     Manage Resume <ArrowUpRight size={16} />
                  </button>
                  <button className="px-8 md:px-10 py-4 bg-white/5 backdrop-blur-3xl border border-white/10 text-white rounded-[1.2rem] md:rounded-[1.5rem] font-bold uppercase text-[10px] md:text-[11px] tracking-widest hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center md:justify-start gap-2">
                     Ask AI Coach <Sparkles size={16} className="text-blue-400" />
                  </button>
               </div>
            </div>
            
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
               <div className="relative w-full md:w-64 aspect-square md:h-64">
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl flex flex-col items-center justify-center text-center p-6 md:p-10">
                     <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500/10 rounded-[1.2rem] md:rounded-[1.8rem] flex items-center justify-center mb-4 md:mb-6 border border-blue-400/20">
                        <Trophy className="text-3xl md:text-4xl text-blue-400" />
                     </div>
                     <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2">Global Rank</p>
                     <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">#124</p>
                     <div className="mt-6 flex items-center gap-2 px-3 py-1 bg-emerald-400/10 rounded-lg">
                        <TrendingUp size={12} className="text-emerald-400" />
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Top 5% Student</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-8">
         <div className="flex items-end justify-between px-6">
            <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">My Progress</h2>
               <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Live statistics and metrics</p>
            </div>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
            {metrics.map((metric, i) => (
               <div key={i} className="group glass-card p-4 md:p-6 rounded-[1.8rem] md:rounded-[2.5rem] hover-lift border-white/50 relative overflow-hidden transition-all duration-500 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${metric.bg} ${metric.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                     <metric.icon size={22} />
                  </div>
                  
                  <div className="mt-4 space-y-1">
                     <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{metric.value}</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{metric.title}</p>
                  </div>
                  
                  <div className="mt-4 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-1.5 hover:bg-slate-900 transition-colors group">
                     <span className={`text-[9px] font-bold uppercase tracking-widest ${metric.color} group-hover:text-white`}>{metric.trend}</span>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Activity and Deadlines */}
      <div className="grid lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight px-4 uppercase">Recent Activity</h3>
            
            <div className="glass-card rounded-[3.5rem] p-4 md:p-10 border-white/50 shadow-2xl shadow-slate-200/40">
               {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                     {recentActivities.map((activity, idx) => (
                        <div key={idx} className="group flex gap-8 p-6 rounded-[2.5rem] hover:bg-slate-50/50 transition-all duration-500 border border-transparent hover:border-slate-100 flex-col sm:flex-row items-start sm:items-center">
                           <div className="flex-shrink-0">
                              <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-2xl ${
                                 activity.type === 'success' ? 'bg-emerald-500 text-white' : 
                                 activity.type === 'warning' ? 'bg-amber-400 text-slate-900' : 
                                 'bg-blue-600 text-white'
                              }`}>
                                 {activity.type === 'success' ? <CheckCircle2 size={24} /> : 
                                  activity.type === 'warning' ? <Clock size={24} /> : 
                                  <FileText size={24} />}
                              </div>
                           </div>
                           
                           <div className="flex-1 space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.time}</p>
                              <p className="text-slate-800 font-bold text-lg leading-snug group-hover:text-blue-600 transition-colors">{activity.message}</p>
                           </div>
                        </div>
                     ))}
                     <button className="w-full mt-6 py-5 bg-slate-900 text-white rounded-[1.8rem] font-bold uppercase text-[11px] tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
                        View More Activities
                     </button>
                  </div>
               ) : (
                  <div className="py-24 text-center">
                     <History size={40} className="text-slate-200 mx-auto mb-4" />
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No activities recorded</p>
                  </div>
               )}
            </div>
         </div>

         <div className="space-y-10">
            {/* Action Card */}
            <div className="relative group overflow-hidden rounded-[3.5rem] bg-indigo-600 p-10 shadow-2xl hover-lift transition-all duration-700">
               <FileText className="text-5xl text-white/30 mb-8" />
               <h4 className="text-2xl font-black text-white uppercase mb-3">Improve Resume</h4>
               <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-10">Use our AI tool to get professional feedback on your resume and increase your chances by <span className="text-white font-bold underline">200%</span>.</p>
               <button className="w-full py-5 bg-white text-slate-900 rounded-[1.5rem] font-bold uppercase text-[11px] tracking-widest shadow-2xl active:scale-95 transition-all">
                  Open Resume Builder
               </button>
            </div>

            {/* Deadlines */}
            <div className="glass-card rounded-[3.5rem] p-10 border-white/50 bg-white/50 shadow-2xl shadow-slate-200/30">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100">
                     <Clock size={22} className="animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Deadlines</h3>
               </div>

               <div className="space-y-5">
                  {[
                     { title: 'Amazon OA Mock', date: 'In 2 hours', urgency: 'high' },
                     { title: 'TCS Application', date: 'Tomorrow, 5 PM', urgency: 'mid' }
                  ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 hover:shadow-2xl transition-all">
                        <div>
                           <p className="text-sm font-bold text-slate-900 uppercase">{item.title}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center gap-1.5">
                              <Calendar size={10} /> {item.date}
                           </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${item.urgency === 'high' ? 'bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-blue-500'}`}></div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
