import React, { useState, useEffect } from 'react';
import {
  Briefcase, Plus, Edit3, Trash2, Eye, Clock, Users,
  MapPin, CircleDollarSign, Calendar, Loader2, Search,
  Filter, ArrowUpRight, MoreVertical, ChevronRight,
  AlertCircle, CheckCircle2, X, Building2
} from 'lucide-react';
import { getCompanyJobs, deleteJob } from '../../../services/companyApi';
import JobPostingForm from './JobPostingForm';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const JobManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
        <div className={`fixed top-24 right-8 z-[100] animate-slide-left p-4 rounded-2xl shadow-2xl border flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-bold uppercase tracking-wider">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Briefcase size={28} className="text-slate-700" />
            Job Positions
          </h1>
          <p className="text-sm text-slate-500 font-medium">Manage and track your active job postings and pipelines.</p>
        </div>

        <button
          onClick={() => { setSelectedJob(null); setShowJobModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded shadow-sm transition-colors text-sm font-semibold group"
        >
          <Plus size={16} />
          Create Job Posting
        </button>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
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
            placeholder="Search positions..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
          />
        </div>
      </div>

      {/* Jobs Matrix */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded">
          <Briefcase className="text-slate-300 w-16 h-16 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No positions found</h3>
          <p className="text-slate-500 text-sm">Create a new job posting to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredJobs.map((job) => {
            const jobTitle = job.jobTitle || job.title || 'Untitled';
            const jobDept = job.department || job.category || '';
            const jobLocation = job.companyLocation || job.location || '';
            const ctcNum = Number(job.ctc);
            const jobSalary = (!isNaN(ctcNum) && ctcNum > 0) ? `₹${(ctcNum / 100000).toFixed(1)} LPA` : (job.salary || job.stipend ? `₹${job.salary || job.stipend}` : job.ctc || '—');
            const jobDeadline = job.applicationDeadline || job.deadline;
            const jobDesc = job.jobDescription || job.description || '';
            const jobStatus = (job.status || (job.isActive ? 'active' : 'draft')).toLowerCase();
            const statusColors = {
              active: { bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', text: 'text-emerald-700' },
              approved: { bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', text: 'text-emerald-700' },
              draft: { bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', text: 'text-amber-700' },
              pending_approval: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', text: 'text-blue-700' },
              rejected: { bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-500', text: 'text-rose-700' },
              changes_requested: { bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500', text: 'text-orange-700' },
              closed: { bg: 'bg-slate-100', border: 'border-slate-300', dot: 'bg-slate-500', text: 'text-slate-600' },
            };
            const sc = statusColors[jobStatus] || statusColors.draft;

            return (
              <div key={job._id} className="bg-white border border-slate-200 p-6 rounded hover:border-slate-300 transition-colors flex flex-col justify-between min-h-[360px] shadow-sm">
                <div className="space-y-5">
                  {/* Job Header with Logo */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 bg-white rounded border border-slate-200 flex items-center justify-center p-1.5 shrink-0">
                        {user?.logo || user?.profilePicture ? (
                          <img src={user.logo || user.profilePicture} alt="Company" className="w-full h-full object-contain" />
                        ) : (
                          <Building2 size={24} className="text-slate-400" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="font-medium text-slate-500">{jobDept || 'Department Not Specified'}</span>
                          {job.jobId && <span className="text-slate-400">&bull; {job.jobId}</span>}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight">{jobTitle}</h3>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs border flex items-center gap-1.5 shrink-0 ${sc.bg} ${sc.border}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></div>
                      <span className={`font-semibold capitalize ${sc.text}`}>{jobStatus.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 bg-slate-50 p-4 rounded border border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin size={14} />
                        <span className="text-xs font-semibold">Location</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 truncate">{jobLocation}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <CircleDollarSign size={14} />
                        <span className="text-xs font-semibold">Package</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 truncate">{jobSalary}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users size={14} />
                        <span className="text-xs font-semibold">Applied</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-800">{job.applicationCount || 0}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar size={14} />
                        <span className="text-xs font-semibold">Deadline</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 truncate">{jobDeadline ? new Date(jobDeadline).toLocaleDateString() : '—'}</p>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {jobDesc}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/company-dashboard/job-details/${job._id}`)}
                    className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                    <Eye size={16} />
                    View Flow
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="px-3 py-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Delete Position"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Job Posting Form Modal (Edit) */}
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

