import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, MapPin, CircleDollarSign, Calendar, Users,
  CheckCircle2, AlertCircle, Loader2, FileText, Mail, ExternalLink,
  ToggleLeft, ToggleRight, GraduationCap, Phone, Star, ChevronDown, Download
} from 'lucide-react';
import { getJobDetails, getJobApplications, updateApplicationStatus, toggleJobActive } from '../../../services/companyApi';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  applied:              { label: 'Applied',             color: 'bg-blue-100 text-blue-700 border-blue-200' },
  test_scheduled:       { label: 'Test Scheduled',      color: 'bg-amber-100 text-amber-700 border-amber-200' },
  test_completed:       { label: 'Test Completed',      color: 'bg-orange-100 text-orange-700 border-orange-200' },
  interview_scheduled:  { label: 'Interviewing',        color: 'bg-purple-100 text-purple-700 border-purple-200' },
  interview_completed:  { label: 'Interview Done',      color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  offer_received:       { label: 'Offered 🎉',          color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  rejected:             { label: 'Rejected',            color: 'bg-rose-100 text-rose-700 border-rose-200' },
};

const ApplicantCard = ({ app, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
  const resumeUrl = app.resume || app.student?.resume; // prefer application-level resume

  return (
    <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-4 flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow">
          {app.student?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-slate-900 truncate">{app.student?.name || 'Unknown Candidate'}</p>
              <p className="text-[11px] text-slate-500 truncate">{app.student?.email}</p>
            </div>
            <span className={`shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>

          {/* Quick meta */}
          <div className="flex flex-wrap gap-2 mt-2">
            {app.student?.branch && (
              <span className="flex items-center gap-1 text-[10px] text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-bold">
                <GraduationCap size={10} /> {app.student.branch}
              </span>
            )}
            {app.student?.cgpa && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                <Star size={10} /> {app.student.cgpa} CGPA
              </span>
            )}
            {app.student?.graduationYear && (
              <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-bold">
                Batch '{String(app.student.graduationYear).slice(-2)}
              </span>
            )}
            <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded border border-slate-100 font-bold">
              {new Date(app.appliedDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50 flex items-center gap-2 flex-wrap">
        {resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded transition-colors"
          >
            <Download size={12} /> View Resume
          </a>
        ) : (
          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded flex items-center gap-1.5">
            <FileText size={12} /> No Resume
          </span>
        )}

        {app.student?.email && (
          <a
            href={`mailto:${app.student.email}`}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded transition-colors"
          >
            <Mail size={12} /> Email
          </a>
        )}

        {/* Status Dropdown */}
        <div className="ml-auto">
          <select
            value={app.status}
            onChange={(e) => onStatusChange(app._id, e.target.value)}
            className="text-[11px] font-bold bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-700 cursor-pointer"
          >
            <option value="applied">Applied</option>
            <option value="test_scheduled">Test Scheduled</option>
            <option value="test_completed">Test Completed</option>
            <option value="interview_scheduled">Interviewing</option>
            <option value="interview_completed">Interview Done</option>
            <option value="offer_received">Offer Sent</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Toggle expand for cover letter */}
        {app.coverLetter && (
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Expandable Cover Letter */}
      {open && app.coverLetter && (
        <div className="px-4 py-3 border-t border-slate-100 bg-white">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cover Letter</p>
          <p className="text-xs text-slate-600 leading-relaxed">{app.coverLetter}</p>
        </div>
      )}
    </div>
  );
};

const JobDetailedView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true); setError(null);
      const [jobData, appsData] = await Promise.all([getJobDetails(id), getJobApplications(id)]);
      setJob(jobData);
      setApplications(appsData);
    } catch (err) {
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      toast.success('Status updated');
      setApplications(prev => prev.map(app => app._id === appId ? { ...app, status: newStatus } : app));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleToggleActive = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      const result = await toggleJobActive(id);
      setJob(prev => ({ ...prev, isActive: result.isActive, status: result.status }));
      toast.success(result.message);
    } catch {
      toast.error('Failed to toggle job status');
    }
    setToggling(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Job Details...</p>
    </div>
  );

  if (error || !job) return (
    <div className="text-center py-32 border-2 border-dashed border-red-200 rounded-lg mt-4">
      <AlertCircle className="text-red-400 w-14 h-14 mx-auto mb-4" />
      <p className="text-slate-500 mb-6">{error || 'Job not found'}</p>
      <button onClick={() => navigate('/company-dashboard/jobs')} className="px-6 py-2 bg-slate-900 text-white rounded font-bold text-xs uppercase tracking-widest">
        Go Back
      </button>
    </div>
  );

  const ctcNum = Number(job.ctc);
  const jobSalary = (!isNaN(ctcNum) && ctcNum > 0)
    ? `₹${(ctcNum / 100000).toFixed(1)} LPA`
    : (job.stipend ? `₹${job.stipend}/mo` : job.salary || 'Not Specified');

  const filteredApps = statusFilter === 'all' ? applications : applications.filter(a => a.status === statusFilter);

  return (
    <div className="space-y-6 pb-20 w-full">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded border border-slate-200 shadow-sm mt-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/company-dashboard/jobs')} className="p-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors text-slate-500">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold capitalize">
                {job.department || job.jobCategory || job.category || 'Job'}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${
                job.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}>
                {job.isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />}
                {job.isActive ? 'Open' : 'Closed'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{job.jobTitle || job.title}</h1>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={handleToggleActive}
          disabled={toggling}
          className={`flex items-center gap-3 px-5 py-2.5 rounded border-2 font-bold text-sm transition-all ${
            job.isActive
              ? 'border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
          } ${toggling ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {job.isActive
            ? <><ToggleRight size={22} className="text-emerald-500" /> Applications Open</>
            : <><ToggleLeft size={22} className="text-slate-400" /> Applications Closed</>
          }
          {toggling && <Loader2 size={14} className="animate-spin" />}
        </button>
      </div>

      {/* Job Info Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: MapPin, label: 'Location', value: job.location || job.companyLocation || 'N/A', color: 'text-slate-600 bg-slate-50' },
          { icon: CircleDollarSign, label: 'Package', value: jobSalary, color: 'text-emerald-600 bg-emerald-50' },
          { icon: Users, label: 'Applicants', value: `${applications.length} Total`, color: 'text-indigo-600 bg-indigo-50' },
          { icon: Calendar, label: 'Deadline', value: (job.deadline || job.applicationDeadline) ? new Date(job.deadline || job.applicationDeadline).toLocaleDateString() : 'N/A', color: 'text-rose-600 bg-rose-50' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white p-4 rounded border border-slate-200 flex items-center gap-3 shadow-sm">
            <div className={`w-9 h-9 rounded ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">{label}</p>
              <p className="text-sm font-bold text-slate-800 truncate max-w-[120px]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Applicants Section */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users size={18} className="text-slate-500" /> Applicants
            <span className="text-sm font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{applications.length}</span>
          </h2>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 ml-auto">
            {['all', 'applied', 'test_scheduled', 'interview_scheduled', 'offer_received', 'rejected'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded border transition-colors ${
                  statusFilter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                }`}
              >
                {s === 'all' ? 'All' : (STATUS_CONFIG[s]?.label || s)}
              </button>
            ))}
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-lg py-20 text-center">
            <Users size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">No applicants in this stage yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredApps.map(app => (
              <ApplicantCard key={app._id} app={app} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>

      {/* Job Description */}
      {(job.jobDescription || job.description) && (
        <div className="bg-white rounded border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FileText size={16} className="text-slate-400" /> Role Description
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{job.jobDescription || job.description}</p>
          {(job.requiredSkills || job.skills)?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {(job.requiredSkills || job.skills).map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded capitalize">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetailedView;
