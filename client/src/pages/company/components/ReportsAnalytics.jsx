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
  Target,
  Lightbulb,
  Rocket
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
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
             <Activity size={28} className="text-slate-700" />
             Strategic Intelligence
          </h1>
          <p className="text-sm font-medium text-slate-500 tracking-tight">Real-time telemetry and predictive analytics of the talent ecosystem.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
             onClick={fetchAnalyticsData}
             className="p-2 border border-slate-200 bg-white rounded hover:bg-slate-50 transition-colors text-slate-600 shadow-sm"
          >
             <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

          <button onClick={() => exportReport('excel')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50 rounded shadow-sm text-sm font-semibold transition-colors">
             <FileSpreadsheet size={16} /> Export Excel
          </button>
          <button onClick={() => exportReport('pdf')} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded shadow-sm text-sm font-semibold transition-colors">
             <FilePdf size={16} /> PDF Intel
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
         <div className="flex items-center gap-8 pl-4">
            <div className="flex items-center gap-2">
               <Target size={16} className="text-slate-500" />
               <span className="text-xs font-semibold text-slate-600">Analysis Axis</span>
            </div>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent border-none text-sm font-semibold text-slate-900 focus:ring-0 cursor-pointer p-0"
            >
              {periods.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>

            <label className="flex items-center gap-2 cursor-pointer group">
               <div className="relative flex items-center">
                  <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} className="sr-only" />
                  <div className={`w-8 h-4 rounded-full transition-colors ${autoRefresh ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                  <div className={`absolute left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${autoRefresh ? 'translate-x-4' : ''}`}></div>
               </div>
               <span className="text-xs font-semibold text-slate-500">Auto-Sync</span>
            </label>
         </div>

         <div className="relative group flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Query position benchmarks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
            />
         </div>
      </div>

      {/* Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Vectors', value: analyticsData.overview.totalJobs, icon: Briefcase, color: 'text-slate-700', bg: 'bg-slate-100', sub: `${analyticsData.overview.activeJobs} Live` },
          { label: 'Market Flow', value: analyticsData.overview.totalApplications, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: 'Total Applied' },
          { label: 'Alpha Conversion', value: '4.8%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: `${analyticsData.overview.hiredCandidates} Hires` },
          { label: 'Sync Latency', value: '1.8 Days', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Avg Response' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-2">{stat.value}</h3>
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {stat.sub}
              </p>
            </div>
            <div className={`p-3 rounded border border-slate-100 ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         {/* Performance Matrix */}
         <div className="xl:col-span-2 bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Performance Matrix</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Vector Efficiency Logs</p>
               </div>
               <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                  <Layers size={16} />
               </button>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
               <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                       <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Vector Title</th>
                       <th className="px-5 py-3 text-center text-xs font-bold text-slate-500 uppercase">Impression</th>
                       <th className="px-5 py-3 text-center text-xs font-bold text-slate-500 uppercase">Alpha</th>
                       <th className="px-5 py-3 text-center text-xs font-bold text-slate-500 uppercase">Final</th>
                       <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {analyticsData.jobStats.map((job, i) => (
                       <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                             <p className="text-sm font-semibold text-slate-900 mb-0.5">{job.title}</p>
                             <p className="text-xs font-medium text-slate-500">{job.type} Sector</p>
                          </td>
                          <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700">{job.applications}</td>
                          <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700">{job.shortlisted}</td>
                          <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700">{job.hired}</td>
                          <td className="px-6 py-4">
                             <div className="flex items-center justify-center gap-3">
                                <span className="text-xs font-bold text-slate-900 w-8">{Math.round((job.hired/(job.applications||1))*100)}%</span>
                                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                   <div className="h-full bg-slate-800" style={{ width: `${(job.hired/(job.applications||1))*100}%` }}></div>
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
         <div className="bg-white rounded border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Zap size={20} className="text-emerald-500" />
                  Delta Log
               </h3>
               <span className="text-xs font-semibold text-slate-500 uppercase">Recent Hires</span>
            </div>
            
            <div className="space-y-4">
               {analyticsData.recentHires.map((hire, i) => (
                 <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded flex items-center justify-center text-slate-700 font-bold text-sm shrink-0">
                       {hire.candidate.split(' ')[1].charAt(0)}
                    </div>
                    <div className="flex-1 border-b border-slate-100 pb-3">
                       <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">{hire.candidate}</p>
                          <span className="text-xs font-semibold text-slate-400">{hire.hireDate}</span>
                       </div>
                       <p className="text-xs font-medium text-slate-500">{hire.position}</p>
                    </div>
                 </div>
               ))}
            </div>

            <button className="w-full mt-6 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
               Full Personnel Audit
               <ChevronRight size={16} />
            </button>
         </div>
      </div>

      {/* Analytics Suggestions Roadmap */}
      <div className="mt-8 bg-slate-900 rounded border border-slate-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-3 bg-slate-800 rounded border border-slate-700 text-amber-400">
                  <Lightbulb size={24} />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Analytics Expansion Roadmap</h2>
                  <p className="text-slate-400 text-sm font-medium mt-1">Suggested high-value metrics to implement for deeper recruitment insights.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                  { title: 'Time-to-Hire Analytics', desc: 'Track average days from job posting to offer acceptance to identify pipeline bottlenecks.', icon: Clock, color: 'text-emerald-400' },
                  { title: 'Funnel Drop-off Rate', desc: 'Visualization showing where candidates fall out of the pipeline (Assessment -> Technical -> HR -> Offer).', icon: Target, color: 'text-rose-400' },
                  { title: 'Source & Channel ROI', desc: 'Pie chart or bar graph showing which colleges or sourcing channels yield the highest quality long-term hires.', icon: PieChart, color: 'text-indigo-400' },
                  { title: 'Offer Acceptance Rate', desc: 'Trend line of offers extended vs. offers accepted to gauge company competitiveness.', icon: TrendingUp, color: 'text-amber-400' },
                  { title: 'Diversity & Demographics', desc: 'Basic aggregate metrics on candidate backgrounds to ensure equitable hiring practices.', icon: Users, color: 'text-violet-400' },
                  { title: 'Cost per Hire Metrics', desc: 'If budget data is available, trace recruitment spend ROI across different departments and roles.', icon: Rocket, color: 'text-cyan-400' }
               ].map((suggestion, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded border border-slate-700 p-5 hover:bg-slate-800 transition-colors group">
                     <div className="flex items-center gap-3 mb-3">
                        <suggestion.icon size={20} className={suggestion.color} />
                        <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{suggestion.title}</h4>
                     </div>
                     <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        {suggestion.desc}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
