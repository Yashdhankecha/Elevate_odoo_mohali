import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Edit3, Trash2, Eye, Clock, Users,
  MapPin, CircleDollarSign, Calendar, Loader2, Search,
  Filter, ArrowUpRight, MoreVertical, ChevronRight,
  AlertCircle, CheckCircle2, X
} from 'lucide-react';
import { getCompanyJobs, deleteJob } from '../../../services/companyApi';
import JobPostingForm from './JobPostingForm';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getCompanyJobs();
      setJobs(data);
    } catch (err) {
      setError('System failure while accessing job vault');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to terminate this job posting?')) return;
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(job => job._id !== jobId));
      showToast('Position successfully archived');
    } catch (err) {
      showToast('Termination protocol failed', 'error');
    }
  };



  const filteredJobs = jobs.filter(job => {
    const jobStatus = (job.status || (job.isActive ? 'active' : 'draft')).toLowerCase();
    const statusMatch = filterStatus === 'all' || jobStatus === filterStatus.toLowerCase();
    const jobDept = (job.department || job.category || '').toLowerCase();
    const deptMatch = !filterDepartment || jobDept === filterDepartment.toLowerCase();
    return statusMatch && deptMatch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing Market Data Base...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-24 right-8 z-[100] animate-slide-left p-4 rounded-2xl shadow-2xl border flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-bold uppercase tracking-wider">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
             <Briefcase size={32} className="text-blue-600" />
             Talent Pipeline
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Strategize, deploy, and monitor your global workforce acquisitions.</p>
        </div>
        
        <button 
          onClick={() => { setSelectedJob(null); setShowJobModal(true); }}
          className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 hover:shadow-2xl transition-all font-black uppercase text-[10px] tracking-widest active:scale-95 group"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform" />
          New Requirement
        </button>
      </div>

      {/* Control Panel */}
      <div className="glass-card rounded-[2rem] p-4 flex flex-wrap items-center justify-between gap-4 border-white/50">
         <div className="flex items-center gap-8 pl-4">
            <div className="flex items-center gap-3">
               <Filter size={14} className="text-slate-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter By</span>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-slate-900 focus:ring-0 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="closed">Closed</option>
            </select>

            <select 
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-slate-900 focus:ring-0 cursor-pointer"
            >
              <option value="">All Depts</option>
              {['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Product', 'Design', 'Other'].map(d => (
                <option key={d} value={d.toLowerCase()}>{d}</option>
              ))}
            </select>
         </div>

         <div className="relative group flex-1 max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Query position title..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner"
            />
         </div>
      </div>

      {/* Jobs Matrix */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-32 bg-white/40 rounded-[3rem] border-2 border-dashed border-slate-100">
          <Briefcase className="text-slate-200 w-20 h-20 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No active vectors found</h3>
          <p className="text-slate-400 max-w-xs mx-auto text-sm">Deploy your first position to the talent marketplace to begin acquisitions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredJobs.map((job) => {
            const jobTitle = job.jobTitle || job.title || 'Untitled';
            const jobDept = job.department || job.category || '';
            const jobLocation = job.companyLocation || job.location || '';
            const jobSalary = job.ctc ? `₹${(job.ctc / 100000).toFixed(1)} LPA` : (job.salary || job.stipend ? `₹${job.stipend}/mo` : '—');
            const jobDeadline = job.applicationDeadline || job.deadline;
            const jobDesc = job.jobDescription || job.description || '';
            const jobStatus = (job.status || (job.isActive ? 'active' : 'draft')).toLowerCase();
            const statusColors = {
              active: { bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500 animate-pulse', text: 'text-emerald-700' },
              approved: { bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500', text: 'text-emerald-700' },
              draft: { bg: 'bg-amber-50', border: 'border-amber-100', dot: 'bg-amber-500', text: 'text-amber-700' },
              pending_approval: { bg: 'bg-blue-50', border: 'border-blue-100', dot: 'bg-blue-500 animate-pulse', text: 'text-blue-700' },
              rejected: { bg: 'bg-rose-50', border: 'border-rose-100', dot: 'bg-rose-500', text: 'text-rose-700' },
              changes_requested: { bg: 'bg-orange-50', border: 'border-orange-100', dot: 'bg-orange-500', text: 'text-orange-700' },
              closed: { bg: 'bg-slate-50', border: 'border-slate-200', dot: 'bg-slate-400', text: 'text-slate-500' },
            };
            const sc = statusColors[jobStatus] || statusColors.draft;

            return (
            <div key={job._id} className="group glass-card p-8 rounded-[2.5rem] hover-lift border-white/50 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded tracking-widest">{jobDept}</span>
                      {job.jobId && <span className="text-[9px] font-bold text-slate-400 ml-2">{job.jobId}</span>}
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{jobTitle}</h3>
                   </div>
                   <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${sc.bg} ${sc.border}`}>
                      <div className={`w-2 h-2 rounded-full ${sc.dot}`}></div>
                      <span className={`text-[9px] font-bold uppercase ${sc.text}`}>{jobStatus.replace('_', ' ')}</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                         <MapPin size={12} />
                         <span className="text-[9px] font-black uppercase tracking-tighter">Location</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 truncate">{jobLocation}</p>
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                         <CircleDollarSign size={12} />
                         <span className="text-[9px] font-black uppercase tracking-tighter">Package</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 truncate">{jobSalary}</p>
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                         <Users size={12} />
                         <span className="text-[9px] font-black uppercase tracking-tighter">Applied</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <p className="text-xs font-bold text-slate-700">{job.applicationCount || 0}</p>
                         <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                            <div className="h-full bg-blue-500" style={{ width: `${Math.min((job.applicationCount || 0) * 10, 100)}%` }}></div>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                         <Calendar size={12} />
                         <span className="text-[9px] font-black uppercase tracking-tighter">Deadline</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 truncate">{jobDeadline ? new Date(jobDeadline).toLocaleDateString() : '—'}</p>
                   </div>
                </div>

                <div className="h-px bg-slate-50 w-full my-6"></div>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                   {jobDesc}
                </p>
              </div>

              <div className="flex gap-2 mt-8">
                <button 
                  onClick={() => { setSelectedJob(job); setShowJobModal(true); }}
                  className="flex-1 p-3.5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-[1.2rem] transition-all flex items-center justify-center gap-2"
                >
                  <Edit3 size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Blueprint</span>
                </button>
                <button className="p-3.5 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-[1.2rem] transition-all group/btn">
                  <Eye size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteJob(job._id)}
                  className="p-3.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-[1.2rem] transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )})}
        </div>
      )}

      {/* Job Posting Form Modal */}
      {showJobModal && (
        <JobPostingForm
          job={selectedJob}
          onClose={() => setShowJobModal(false)}
          onSuccess={() => { setShowJobModal(false); fetchJobs(); }}
        />
      )}
    </div>
  );
};

export default JobManagement;

