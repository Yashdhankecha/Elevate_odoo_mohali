import React, { useState, useEffect } from 'react';
import { tpoApi } from '../../../services/tpoApi';
import { 
  Search, 
  Filter, 
  Eye,
  Building2,
  MapPin,
  BarChart3,
  Download,
  Briefcase,
  Calendar,
  Users,
  Banknote,
  ChevronRight,
  MoreVertical,
  Zap,
  Target,
  Activity,
  ArrowUpRight,
  Clock,
  Layers,
  Star,
  Globe,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    type: 'All',
    category: 'All'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0
  });

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [filters, pagination.currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = { ...filters, page: pagination.currentPage, limit: 10 };
      const response = await tpoApi.getJobs(params);
      setJobs(response.jobs);
      setPagination(prev => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalJobs: response.pagination.totalJobs
      }));
    } catch (error) {
      toast.error('Failed to load job listings.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await tpoApi.getJobStats();
      setStats(response);
    } catch (error) {}
  };

  const getStatusStyle = (isActive, deadline) => {
    if (!isActive) return 'bg-rose-50 text-rose-600 border-rose-100';
    if (new Date(deadline) < new Date()) return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  };

  const getStatusText = (isActive, deadline) => {
    if (!isActive) return 'Restricted';
    if (new Date(deadline) < new Date()) return 'Expired';
    return 'Active';
  };

  const formatPackage = (p) => {
    if (!p) return 'TBD';
    return `${p.min/100000}-${p.max/100000} LPA`;
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
             <Briefcase size={32} className="text-blue-600" />
             Job Management
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage all active job and internship postings for your students.</p>
        </div>
        
        <button onClick={() => {}} className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 hover:shadow-2xl transition-all font-bold uppercase text-[10px] tracking-widest active:scale-95 group">
           <Download size={16} /> Export Listings
        </button>
      </div>

      {/* Stats HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Jobs', value: stats?.overview.totalJobs || 0, icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Active Jobs', value: stats?.overview.activeJobs || 0, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Expired', value: stats?.overview.expiredJobs || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'Active Rate', value: `${stats?.overview.activeRate || 0}%`, icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
         ].map((stat, i) => (
           <div key={i} className="glass-card p-6 rounded-[2rem] border-white/50 hover-lift flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                 <stat.icon size={20} />
              </div>
           </div>
         ))}
      </div>

      {/* Filtering */}
      <div className="glass-card rounded-[2.5rem] p-6 border-white/50 shadow-2xl shadow-slate-200/40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-2">Search Jobs</label>
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
                 <input
                   type="text"
                   placeholder="Search by role or company..."
                   value={filters.search}
                   onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                   className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner"
                 />
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-2">Job Status</label>
              <select value={filters.status} onChange={e => setFilters(p => ({...p, status: e.target.value}))} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none appearance-none cursor-pointer">
                 <option value="All">All Status</option>
                 <option value="active">Active Only</option>
                 <option value="expired">Expired Only</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-2">Job Type</label>
              <select value={filters.type} onChange={e => setFilters(p => ({...p, type: e.target.value}))} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none appearance-none cursor-pointer">
                 <option value="All">All Types</option>
                 <option value="full-time">Full-Time</option>
                 <option value="internship">Internship</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-2">Category</label>
              <select value={filters.category} onChange={e => setFilters(p => ({...p, category: e.target.value}))} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none appearance-none cursor-pointer">
                 <option value="All">All Categories</option>
                 <option value="software-engineering">Engineering</option>
                 <option value="data-science">Data Science</option>
              </select>
           </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         {loading ? (
            <div className="xl:col-span-2 py-32 text-center">
               <Loader2 className="animate-spin w-12 h-12 text-blue-600 mx-auto" />
            </div>
         ) : jobs.map((job) => (
           <div key={job._id} className="group glass-card p-8 rounded-[3rem] border-white/50 hover-lift relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10 flex gap-6">
                 <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center relative overflow-hidden flex-shrink-0 shadow-2xl group-hover:scale-110 transition-transform">
                    <Building2 className="text-white opacity-40 absolute" size={40} />
                    <span className="text-white font-black text-xl relative">{(job.company?.companyName || 'C')[0]}</span>
                 </div>
                 <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                       <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{job.title}</h3>
                          <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">{job.company?.companyName}</p>
                       </div>
                       <span className={`px-3 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-widest ${getStatusStyle(job.isActive, job.deadline)}`}>
                          {getStatusText(job.isActive, job.deadline)}
                       </span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                       <span className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-bold uppercase text-slate-400 tracking-widest border border-slate-100">{job.type}</span>
                       <span className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-bold uppercase text-slate-400 tracking-widest border border-slate-100">{job.category}</span>
                       <span className="px-3 py-1 bg-indigo-50 rounded-lg text-[9px] font-bold uppercase text-indigo-600 tracking-widest border border-indigo-100 flex items-center gap-1">
                          <Banknote size={10} /> {formatPackage(job.package)}
                       </span>
                    </div>
                 </div>
              </div>

               <div className="mt-8 grid grid-cols-3 gap-4 relative z-10">
                  <div className="p-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-100">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Applications</p>
                     <p className="text-sm font-bold text-slate-900">{job.totalApplications}</p>
                  </div>
                  <div className="p-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-100">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Date</p>
                     <p className="text-sm font-bold text-slate-900">{new Date(job.deadline).toLocaleDateString()}</p>
                  </div>
                  <div className="p-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-100">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                     <p className="text-sm font-bold text-slate-900 truncate">{job.location}</p>
                  </div>
               </div>

              <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center relative z-10">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                       <Target size={14} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       {job.acceptedApplications} Placements
                    </p>
                 </div>
                 <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 rounded-2xl font-bold uppercase text-[9px] tracking-widest hover:bg-slate-900 hover:text-white transition-all group/btn active:scale-95">
                    View Details
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>

              {/* Background Decoration */}
              <div className="absolute -bottom-10 -right-10 opacity-[0.02] rotate-12 scale-150 pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                 <Briefcase size={200} />
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default JobManagement;
