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
  Zap,
  ArrowUpRight,
  MoreVertical,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import * as XLSX from 'xlsx';
import { getCompanyAnalytics } from '../../../services/companyApi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [exporting, setExporting] = useState({ pdf: false, excel: false, csv: false });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
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
      const res = await getCompanyAnalytics(selectedPeriod);
      if (res) {
        // API returns { summary, jobStats, recentHires }
        // Component state uses { overview, jobStats, recentHires } — map accordingly
        const summary = res.summary || {};
        setAnalyticsData({
          overview: {
            totalJobs:           summary.totalJobs           ?? res.totalJobs           ?? 0,
            activeJobs:          summary.activeJobs          ?? res.activeJobs          ?? 0,
            totalApplications:   summary.totalApplications   ?? res.totalApplications   ?? 0,
            shortlistedCandidates: summary.shortlisted       ?? res.shortlisted         ?? 0,
            hiredCandidates:     summary.hired               ?? res.hired               ?? 0,
            averageResponseTime: summary.averageResponseTime ?? res.averageResponseTime ?? 0,
            topPerformingJob:    summary.topPerformingJob    ?? res.topPerformingJob    ?? 'N/A',
            mostAppliedJob:      summary.mostAppliedJob      ?? res.mostAppliedJob      ?? 'N/A',
          },
          jobStats:           Array.isArray(res.jobStats)           ? res.jobStats           : [],
          applicationStats:   Array.isArray(res.applicationStats)   ? res.applicationStats   : [],
          candidateStats:     Array.isArray(res.candidateStats)     ? res.candidateStats     : [],
          monthlyTrends:      Array.isArray(res.monthlyTrends)      ? res.monthlyTrends      : [],
          recentHires:        Array.isArray(res.recentHires)        ? res.recentHires.map(h => ({
            candidate: h.studentName || h.candidate || 'Unknown',
            position:  h.jobTitle    || h.position  || 'Unknown Role',
            hireDate:  h.hiredAt     ? new Date(h.hiredAt).toLocaleDateString() : (h.hireDate || ''),
          })) : [],
          upcomingInterviews: Array.isArray(res.upcomingInterviews) ? res.upcomingInterviews : [],
        });
      }
    } catch (error) {
      console.error('Analytics error:', error);
      toast.error('Data stream interrupted');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format) => {
    setExporting(prev => ({ ...prev, [format]: true }));
    try {
      if (format === 'pdf') {
        toPDF();
      } else if (format === 'excel') {
        const wsData = analyticsData.jobStats.map(j => ({
          'Job Title': j.title,
          'Type': j.type,
          'Applications': j.applications,
          'Shortlisted': j.shortlisted,
          'Hired': j.hired,
          'Status': j.status,
          'Hire Rate': `${Math.round((j.hired / (j.applications || 1)) * 100)}%`
        }));
        const ws = XLSX.utils.json_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Recruitment Overview");
        XLSX.writeFile(wb, `Elevate_Sector_Analysis_${new Date().toISOString().split('T')[0]}.xlsx`);
      }
      toast.success(`${format.toUpperCase()} Intelligence Exported`);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Manifest Export Failed');
    } finally {
      setExporting(prev => ({ ...prev, [format]: false }));
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Hidden PDF Container for Export Generation */}
      <div ref={targetRef} className="absolute left-[-9999px] p-10 bg-white w-[1000px] text-slate-900 border-[10px] border-slate-900">
         <div className="border-b-8 border-slate-900 pb-8 mb-10">
           <h1 className="text-5xl font-black uppercase tracking-tighter">Elevate Recruiting Intelligence</h1>
           <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm mt-3 flex justify-between">
             <span>Company: {user?.companyName || 'Corporate Internal'}</span>
             <span>Phase: {new Date().toLocaleDateString()}</span>
           </p>
         </div>

         <div className="grid grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Total Jobs', val: analyticsData.overview.totalJobs },
              { label: 'Applications', val: analyticsData.overview.totalApplications },
              { label: 'Hired', val: analyticsData.overview.hiredCandidates },
              { label: 'Hire Rate', val: analyticsData.overview.totalApplications > 0 ? `${((analyticsData.overview.hiredCandidates / analyticsData.overview.totalApplications) * 100).toFixed(1)}%` : '—' }
            ].map((s, i) => (
              <div key={i} className="border-4 border-slate-900 p-6 bg-slate-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{s.label}</p>
                <p className="text-3xl font-black italic">{s.val}</p>
              </div>
            ))}
         </div>

         <h2 className="text-2xl font-black uppercase tracking-widest mb-6 bg-slate-900 text-white px-4 py-2 inline-block">Job Performance</h2>
         <table className="w-full text-left mb-12 border-collapse border-4 border-slate-900">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-4 text-xs font-black uppercase">Job Title</th>
                <th className="p-4 text-xs font-black uppercase text-center">Applications</th>
                <th className="p-4 text-xs font-black uppercase text-center">Shortlisted</th>
                <th className="p-4 text-xs font-black uppercase text-center">Hired</th>
                <th className="p-4 text-xs font-black uppercase text-right">Hire Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-slate-900">
              {analyticsData.jobStats.map((job, i) => (
                <tr key={i} className="hover:bg-slate-50 font-bold">
                  <td className="p-4 border-r-4 border-slate-900">
                    <p className="text-lg leading-none">{job.title}</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase leading-none">{job.type}</p>
                  </td>
                  <td className="p-4 border-r-4 border-slate-900 text-center text-xl">{job.applications}</td>
                  <td className="p-4 border-r-4 border-slate-900 text-center text-xl">{job.shortlisted}</td>
                  <td className="p-4 border-r-4 border-slate-900 text-center text-xl">{job.hired}</td>
                  <td className="p-4 text-right text-xl">{Math.round((job.hired / (job.applications || 1)) * 100)}%</td>
                </tr>
              ))}
            </tbody>
         </table>
         
         <div className="mt-20 text-center border-t-2 border-slate-100 pt-8 opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">End of Automated Intel Report</p>
         </div>
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


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Jobs Posted', value: analyticsData.overview.totalJobs, icon: Briefcase, color: 'text-slate-700', bg: 'bg-slate-100', sub: `${analyticsData.overview.activeJobs} active` },
          { label: 'Total Applications', value: analyticsData.overview.totalApplications, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: 'candidates applied' },
          {
            label: 'Hire Rate',
            value: analyticsData.overview.totalApplications > 0
              ? `${((analyticsData.overview.hiredCandidates / analyticsData.overview.totalApplications) * 100).toFixed(1)}%`
              : '—',
            icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50',
            sub: `${analyticsData.overview.hiredCandidates} offers made`
          },
          { label: 'Shortlisted', value: analyticsData.overview.shortlistedCandidates, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'advancing in pipeline' },
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
      <div className="space-y-6">
         {/* Job Performance — full width */}
         <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Job Performance</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Applications, shortlisted &amp; hired per role</p>
               </div>
               <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                  <Layers size={16} />
               </button>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
               <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                       <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Job Title</th>
                       <th className="px-5 py-3 text-center text-xs font-bold text-slate-500 uppercase">Applications</th>
                       <th className="px-5 py-3 text-center text-xs font-bold text-slate-500 uppercase">Shortlisted</th>
                       <th className="px-5 py-3 text-center text-xs font-bold text-slate-500 uppercase">Hired</th>
                       <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Hire Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {analyticsData.jobStats.length > 0 ? analyticsData.jobStats.map((job, i) => (
                       <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                             <p className="text-sm font-semibold text-slate-900 mb-0.5">{job.title}</p>
                             <p className="text-xs font-medium text-slate-500">{job.type}</p>
                          </td>
                          <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700">{job.applications}</td>
                          <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700">{job.shortlisted}</td>
                          <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700">{job.hired}</td>
                          <td className="px-6 py-4">
                             <div className="flex items-center justify-center gap-3">
                                <span className="text-xs font-bold text-slate-900 w-8">{Math.round((job.hired/(job.applications||1))*100)}%</span>
                                <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                   <div className="h-full bg-slate-800" style={{ width: `${Math.min(100,(job.hired/(job.applications||1))*100)}%` }}></div>
                                </div>
                             </div>
                          </td>
                       </tr>
                     )) : (
                       <tr>
                         <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400 font-medium">No job data available</td>
                       </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Recent Hires — full width below */}
         <div className="bg-white rounded border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Zap size={20} className="text-emerald-500" />
                  Recent Hires
               </h3>
               <span className="text-xs font-semibold text-slate-500 uppercase">Offer Received</span>
            </div>

            {analyticsData.recentHires.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyticsData.recentHires.map((hire, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded border border-slate-100">
                     <div className="w-10 h-10 bg-slate-900 text-white rounded flex items-center justify-center font-bold text-sm shrink-0">
                        {(hire.candidate || '?').charAt(0).toUpperCase()}
                     </div>
                     <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{hire.candidate}</p>
                        <p className="text-xs font-medium text-slate-500 truncate">{hire.position}</p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{hire.hireDate}</p>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 font-medium text-center py-8">No recent hires</p>
            )}
         </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;


