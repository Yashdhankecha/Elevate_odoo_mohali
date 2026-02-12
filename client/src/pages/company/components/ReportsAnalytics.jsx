import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  FileJson as FilePdf, 
  FileStack as FileCsv,
  RefreshCcw,
  Search,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Building2,
  TrendingUp,
  PieChart,
  Zap,
  ArrowUpRight,
  MoreVertical,
  Activity,
  Layers,
  ChevronRight,
  Target
} from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [exporting, setExporting] = useState({ pdf: false, excel: false, csv: false });
  const [loading, setLoading] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: `Elevate_Sector_Analysis_${new Date().toISOString().split('T')[0]}.pdf` });
  
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      shortlistedCandidates: 0,
      hiredCandidates: 0,
      averageResponseTime: 0,
      topPerformingJob: 'N/A',
      mostAppliedJob: 'N/A'
    },
    jobStats: [],
    applicationStats: [],
    candidateStats: [],
    monthlyTrends: [],
    recentHires: [],
    upcomingInterviews: []
  });

  const periods = [
    { value: '2024', label: 'Cycle 2024' },
    { value: 'last_6_months', label: 'T-6 Months' },
    { value: 'last_3_months', label: 'T-3 Months' },
    { value: 'current_month', label: 'Current Phase' }
  ];

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(() => {
      if (autoRefresh) fetchAnalyticsData();
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedPeriod, selectedJobType, searchTerm, autoRefresh]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Simulate API lag for neural sync feel
      await new Promise(r => setTimeout(r, 600));
      const dynamicData = generateDynamicData();
      setAnalyticsData(dynamicData);
    } catch (error) {
      toast.error('Data stream interrupted');
    } finally {
      setLoading(false);
    }
  };

  const generateDynamicData = () => {
    const baseMultiplier = selectedPeriod === 'current_month' ? 0.3 : 1;
    const jobTitles = ['Cloud Architect', 'Systems Lead', 'AI Researcher', 'Product Core', 'Fullstack Sigma'];
    
    const jobStats = jobTitles.map(title => {
      const appCount = Math.floor(Math.random() * 150) + 10;
      return {
        title,
        type: ['Full-time', 'Internship'][Math.floor(Math.random() * 2)],
        applications: Math.floor(appCount * baseMultiplier),
        shortlisted: Math.floor(appCount * 0.2 * baseMultiplier),
        hired: Math.floor(appCount * 0.05 * baseMultiplier),
        status: Math.random() > 0.2 ? 'Active' : 'Closed',
        postedDate: '2024-11-01',
        salary: Math.floor(80000 + Math.random() * 40000)
      };
    });

    return {
      overview: {
        totalJobs: 12,
        activeJobs: 8,
        totalApplications: 842,
        shortlistedCandidates: 124,
        hiredCandidates: 42,
        averageResponseTime: 1.8,
        topPerformingJob: 'Cloud Architect',
        mostAppliedJob: 'Fullstack Sigma'
      },
      jobStats,
      recentHires: Array.from({length: 4}, (_, i) => ({
        candidate: `Candidate Alpha-${i+1}`,
        position: jobTitles[i % jobTitles.length],
        department: 'Core Eng',
        hireDate: '2024-11-15'
      })),
      upcomingInterviews: Array.from({length: 3}, (_, i) => ({
        candidate: `Vector-${i+100}`,
        position: jobTitles[i % jobTitles.length],
        date: '2024-11-20',
        time: '14:00 GMT',
        type: 'Neural Sync',
        status: 'Locked'
      }))
    };
  };

  const exportReport = async (format) => {
    setExporting(prev => ({ ...prev, [format]: true }));
    try {
      await new Promise(r => setTimeout(r, 1000));
      if (format === 'pdf') toPDF();
      toast.success(`${format.toUpperCase()} Manifest Exported`);
    } finally {
      setExporting(prev => ({ ...prev, [format]: false }));
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Hidden PDF Container */}
      <div ref={targetRef} className="absolute left-[-9999px] p-10 bg-white w-[1000px]">
         <h1 className="text-3xl font-black">Elevate Recruitment Intelligence</h1>
         <p className="text-slate-500">Generated: {new Date().toLocaleString()}</p>
      </div>

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
             <Activity size={32} className="text-blue-600" />
             Strategic Intelligence
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Real-time telemetry and predictive analytics of the talent ecosystem.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
             onClick={fetchAnalyticsData}
             className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-slate-400"
          >
             <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <div className="h-10 w-px bg-slate-100 mx-2 hidden md:block"></div>

          <button onClick={() => exportReport('excel')} className="flex items-center gap-2 px-5 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
             <FileSpreadsheet size={16} /> Excel manifest
          </button>
          <button onClick={() => exportReport('pdf')} className="flex items-center gap-2 px-5 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
             <FilePdf size={16} /> PDF Intel
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="glass-card rounded-[2rem] p-4 flex flex-wrap items-center justify-between gap-4 border-white/50">
         <div className="flex items-center gap-8 pl-4">
            <div className="flex items-center gap-3">
               <Target size={14} className="text-slate-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analysis Axis</span>
            </div>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent border-none text-sm font-black text-slate-900 focus:ring-0 cursor-pointer"
            >
              {periods.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>

            <label className="flex items-center gap-3 cursor-pointer group">
               <div className="relative">
                  <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} className="sr-only" />
                  <div className={`w-8 h-4 rounded-full transition-colors ${autoRefresh ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${autoRefresh ? 'translate-x-4' : ''}`}></div>
               </div>
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Auto-Sync Sync</span>
            </label>
         </div>

         <div className="relative group flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Query position benchmarks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner"
            />
         </div>
      </div>

      {/* Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Vectors', value: analyticsData.overview.totalJobs, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', sub: `${analyticsData.overview.activeJobs} Live` },
          { label: 'Market Flow', value: analyticsData.overview.totalApplications, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: 'Total Applied' },
          { label: 'Alpha Conversion', value: '4.8%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: `${analyticsData.overview.hiredCandidates} Hires` },
          { label: 'Sync Latency', value: '1.8 Days', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Avg Response' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[2.5rem] border-white/50 hover-lift relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={24} />
              </div>
              <ArrowUpRight className="text-slate-200 group-hover:text-slate-900 transition-colors" size={20} />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              <p className="text-[10px] font-bold text-slate-500 mt-2 flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {stat.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         {/* Performance Matrix */}
         <div className="xl:col-span-2 glass-card rounded-[2.5rem] border-white/50 overflow-hidden shadow-2xl shadow-slate-200/50">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Performance Matrix</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vector Efficiency Logs</p>
               </div>
               <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                  <Layers size={18} />
               </button>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
               <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/30">
                       <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Vector Title</th>
                       <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Impression</th>
                       <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Alpha</th>
                       <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Final</th>
                       <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {analyticsData.jobStats.map((job, i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-all font-sans">
                          <td className="px-8 py-5">
                             <p className="text-sm font-bold text-slate-900 leading-tight">{job.title}</p>
                             <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">{job.type} Sector</p>
                          </td>
                          <td className="px-6 py-5 text-center text-sm font-bold text-slate-700">{job.applications}</td>
                          <td className="px-6 py-5 text-center text-sm font-bold text-slate-700">{job.shortlisted}</td>
                          <td className="px-6 py-5 text-center text-sm font-bold text-slate-700">{job.hired}</td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3 justify-center">
                                <span className="text-xs font-black text-slate-900">{Math.round((job.hired/(job.applications||1))*100)}%</span>
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-500" style={{ width: `${(job.hired/(job.applications||1))*100}%` }}></div>
                                </div>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Delta Log (Recent Hires) */}
         <div className="glass-card rounded-[2.5rem] border-white/50 p-8 shadow-2xl shadow-slate-200/50">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Zap size={20} className="text-amber-500 fill-amber-500" />
                  Delta Log
               </h3>
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recent Hires</span>
            </div>
            
            <div className="space-y-6">
               {analyticsData.recentHires.map((hire, i) => (
                 <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-110 transition-transform">
                       {hire.candidate.split(' ')[1].charAt(0)}
                    </div>
                    <div className="flex-1 border-b border-slate-50 pb-4">
                       <div className="flex justify-between items-start">
                          <p className="text-sm font-black text-slate-900 leading-none mb-1">{hire.candidate}</p>
                          <span className="text-[9px] font-black text-slate-400 uppercase">{hire.hireDate}</span>
                       </div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{hire.position}</p>
                    </div>
                 </div>
               ))}
            </div>

            <button className="w-full mt-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all group">
               Full Personnel Audit
               <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
