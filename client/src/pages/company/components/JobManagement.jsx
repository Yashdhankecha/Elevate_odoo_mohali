import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Clock, 
  Users,
  MapPin,
  CircleDollarSign,
  Calendar,
  Loader2,
  Search,
  Filter,
  ArrowUpRight,
  MoreVertical,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { 
  getCompanyJobs, 
  createJob, 
  updateJob, 
  deleteJob 
} from '../../../services/companyApi';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmitJob = async (formData) => {
    try {
      setSubmitting(true);
      if (selectedJob) {
        const updatedJob = await updateJob(selectedJob._id, formData);
        setJobs(jobs.map(job => job._id === selectedJob._id ? updatedJob : job));
        showToast('Posting manifest updated');
      } else {
        const newJob = await createJob(formData);
        setJobs([...jobs, newJob]);
        showToast('New position deployed to market');
      }
      setShowJobModal(false);
    } catch (err) {
      showToast('Strategic manifest update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const statusMatch = filterStatus === 'all' || job.status.toLowerCase() === filterStatus.toLowerCase();
    const deptMatch = !filterDepartment || job.department.toLowerCase() === filterDepartment.toLowerCase();
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
          Deploy New Position
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
              <option value="active">Active Market</option>
              <option value="draft">Draft Protocol</option>
              <option value="closed">Closed Legacy</option>
            </select>

            <select 
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-slate-900 focus:ring-0 cursor-pointer"
            >
              <option value="">Global Depts</option>
              {['Engineering', 'Data Science', 'Product', 'Marketing', 'Sales'].map(d => (
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
          {filteredJobs.map((job) => (
            <div key={job._id} className="group glass-card p-8 rounded-[2.5rem] hover-lift border-white/50 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded tracking-widest">{job.department}</span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{job.title}</h3>
                   </div>
                   <div className={`p-2 rounded-xl border ${
                     job.status === 'Active' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'
                   }`}>
                      <div className={`w-2 h-2 rounded-full ${job.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                         <MapPin size={12} />
                         <span className="text-[9px] font-black uppercase tracking-tighter">Coordinates</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 truncate">{job.location}</p>
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                         <CircleDollarSign size={12} />
                         <span className="text-[9px] font-black uppercase tracking-tighter">Treasury</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 truncate">{job.salary}</p>
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                         <Users size={12} />
                         <span className="text-[9px] font-black uppercase tracking-tighter">Applied</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <p className="text-xs font-bold text-slate-700">{job.applications || 0}</p>
                         <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                            <div className="h-full bg-blue-500" style={{ width: `${Math.min((job.applications || 0) * 10, 100)}%` }}></div>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                         <Calendar size={12} />
                         <span className="text-[9px] font-black uppercase tracking-tighter">Expiry</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 truncate">{new Date(job.deadline).toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="h-px bg-slate-50 w-full my-6"></div>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                   {job.description}
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
          ))}
        </div>
      )}

      {/* Modern Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => !submitting && setShowJobModal(false)}></div>
           
           <div className="bg-white rounded-[3rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar relative z-10 animate-slide-up shadow-2xl">
              <JobForm 
                job={selectedJob} 
                onClose={() => setShowJobModal(false)}
                onSubmit={handleSubmitJob}
                submitting={submitting}
              />
           </div>
        </div>
      )}
    </div>
  );
};

const JobForm = ({ job, onClose, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    department: job?.department || '',
    location: job?.location || '',
    salary: job?.salary || '',
    deadline: job?.deadline ? job.deadline.split('T')[0] : '',
    description: job?.description || '',
    requirements: job?.requirements?.join(', ') || '',
    status: job?.status || 'Active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req)
    });
  };

  return (
    <div className="relative">
      <div className="p-8 md:p-12 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-xl z-20">
         <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
               {job ? 'Modify Vector' : 'Initiate Position'}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Strategic Manifesto</p>
         </div>
         <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all text-slate-400">
            <X size={24} />
         </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Designation Title</label>
               <input
                 type="text"
                 value={formData.title}
                 onChange={(e) => setFormData({...formData, title: e.target.value})}
                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                 placeholder="e.g., Sr. Systems Architect"
                 required
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Organization Sector</label>
               <select
                 value={formData.department}
                 onChange={(e) => setFormData({...formData, department: e.target.value})}
                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                 required
               >
                 <option value="">Global Assignment</option>
                 {['Engineering', 'Data Science', 'Product', 'Marketing', 'Sales'].map(d => (
                   <option key={d} value={d}>{d}</option>
                 ))}
               </select>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Physical/Remote Coords</label>
               <input
                 type="text"
                 value={formData.location}
                 onChange={(e) => setFormData({...formData, location: e.target.value})}
                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                 placeholder="e.g., Remote / Tokyo, JP"
                 required
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Compensation Range</label>
               <input
                 type="text"
                 value={formData.salary}
                 onChange={(e) => setFormData({...formData, salary: e.target.value})}
                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                 placeholder="e.g., $120k - $160k"
                 required
               />
            </div>
         </div>

         <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Market Expiration (Deadline)</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              required
            />
         </div>

         <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Role Manifesto (Description)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-6 text-sm font-medium text-slate-700 min-h-[200px] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              placeholder="Synthesize the primary objectives and expectations..."
              required
            />
         </div>

         <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Neural Stack (Requirements - comma separated)</label>
            <input
              type="text"
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              placeholder="React, Distributed Systems, Rust..."
            />
         </div>

         <div className="space-y-2 pb-6">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Lifecycle Status</label>
            <div className="grid grid-cols-3 gap-3">
               {['Draft', 'Active', 'Closed'].map(s => (
                 <button
                   key={s}
                   type="button"
                   onClick={() => setFormData({...formData, status: s})}
                   className={`p-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${
                     formData.status === s ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                   }`}
                 >
                   {s} Protocol
                 </button>
               ))}
            </div>
         </div>

         <div className="flex gap-4 pt-8 sticky bottom-0 bg-white/90 backdrop-blur-md pb-8 z-20">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-slate-900 text-white py-5 rounded-[1.8rem] font-black uppercase text-xs tracking-widest hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <>
                   {job ? 'Execute Modification' : 'Deploy Deployment'}
                   <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-5 border border-slate-100 rounded-[1.8rem] text-slate-400 font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all"
            >
              Abort
            </button>
         </div>
      </form>
    </div>
  );
};

export default JobManagement;
