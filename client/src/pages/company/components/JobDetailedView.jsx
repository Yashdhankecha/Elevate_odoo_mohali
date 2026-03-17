import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, MapPin, CircleDollarSign, Calendar, Users,
  CheckCircle2, AlertCircle, Loader2, ChevronRight, FileText, Download,
  Mail, Phone, Clock
} from 'lucide-react';
import { getJobDetails, getJobApplications, updateApplicationStatus } from '../../../services/companyApi';

const JobDetailedView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Default rounds if none defined
  const defaultRounds = [
    { roundName: 'Applied', statusId: 'applied' },
    { roundName: 'Test Required', statusId: 'test_scheduled' },
    { roundName: 'Interview Scheduled', statusId: 'interview_scheduled' },
    { roundName: 'Offer Received', statusId: 'offer_received' },
    { roundName: 'Rejected', statusId: 'rejected' }
  ];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [jobData, appsData] = await Promise.all([
        getJobDetails(id),
        getJobApplications(id)
      ]);
      setJob(jobData);
      setApplications(appsData);
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      showToast('Applicant status updated successfully');
      // Update local state
      setApplications(prev => prev.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDragStart = (e, appId) => {
    e.dataTransfer.setData('appId', appId);
  };

  const handleDrop = async (e, roundStatusId) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('appId');
    if (appId) {
      const app = applications.find(a => a._id === appId);
      if (app && app.status !== roundStatusId) {
        await handleStatusChange(appId, roundStatusId);
      }
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Job Details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-32 bg-white/40 rounded-[3rem] border-2 border-dashed border-red-200">
        <AlertCircle className="text-red-400 w-16 h-16 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Error</h3>
        <p className="text-slate-500 mb-6">{error || 'Job not found'}</p>
        <button 
          onClick={() => navigate('/company-dashboard/jobs')}
          className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Generate Kanban Columns
  // We map standard job statuses to standard columns
  const rounds = job.selectionRounds?.length > 0 
    ? [
        { roundName: 'Applied', statusId: 'applied' },
        ...job.selectionRounds.map((r, i) => ({ 
          roundName: r.roundName, 
          // For dynamic custom rounds we just use common statuses for now
          // A more robust implementation would map specific round IDs
          statusId: i === 0 ? 'test_scheduled' : 'interview_scheduled' 
        })),
        { roundName: 'Offered', statusId: 'offer_received' },
        { roundName: 'Rejected', statusId: 'rejected' }
      ]
    : defaultRounds;

  const jobSalary = job.ctc ? `₹${(job.ctc / 100000).toFixed(1)} LPA` : (job.salary || job.stipend ? `₹${job.stipend}/mo` : 'Not Specified');
  
  return (
    <div className="space-y-8 pb-20 animate-fade-in relative z-10 w-full min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-8 z-[100] animate-slide-left p-4 rounded-2xl shadow-2xl border flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-bold uppercase tracking-wider">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/company-dashboard/jobs')}
            className="p-2.5 bg-white rounded-full hover:bg-slate-50 transition-colors shadow-sm text-slate-400 hover:text-slate-900"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] uppercase font-black tracking-widest bg-blue-50 text-blue-600 px-2.5 py-1 rounded">
                {job.department || job.category || 'Job'}
              </span>
              <span className={`text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded ${
                job.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {job.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
              {job.jobTitle || job.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Job Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover-lift border-white/50">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
            <p className="font-bold text-slate-900">{job.location || job.companyLocation || 'Not Specified'}</p>
          </div>
        </div>
        
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover-lift border-white/50">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CircleDollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Package</p>
            <p className="font-bold text-slate-900">{jobSalary}</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover-lift border-white/50">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Applications</p>
            <p className="font-bold text-slate-900">{applications.length} Total</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover-lift border-white/50">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deadline</p>
            <p className="font-bold text-slate-900">
              {job.deadline || job.applicationDeadline ? new Date(job.deadline || job.applicationDeadline).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area: Kanban Board */}
      <div className="mt-8">
        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <Users className="text-blue-500" size={24} />
          Applicant Pipeline
        </h2>
        
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
          {rounds.map((round) => {
            // Filter applications for this round by mapping common statuses
            const roundApps = applications.filter(app => {
              if (round.statusId === 'applied') return ['applied'].includes(app.status);
              if (round.statusId === 'test_scheduled') return ['test_scheduled', 'test_completed'].includes(app.status);
              if (round.statusId === 'interview_scheduled') return ['interview_scheduled', 'interview_completed'].includes(app.status);
              if (round.statusId === 'offer_received') return ['offer_received'].includes(app.status);
              if (round.statusId === 'rejected') return ['rejected'].includes(app.status);
              return false;
            });

            return (
              <div 
                key={round.statusId}
                onDrop={(e) => handleDrop(e, round.statusId)}
                onDragOver={allowDrop}
                className="bg-slate-100/50 border border-slate-200/60 rounded-3xl p-4 min-w-[320px] max-w-[320px] flex-shrink-0 flex flex-col snap-center h-[600px]"
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="font-black text-slate-800 text-sm tracking-wide">{round.roundName}</h3>
                  <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {roundApps.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                  {roundApps.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4 border-2 border-dashed border-slate-200 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drop Candidates</p>
                    </div>
                  ) : (
                    roundApps.map(app => (
                      <div 
                        key={app._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app._id)}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-slate-900">{app.student?.name || 'Unknown Candidate'}</p>
                            <p className="text-xs text-slate-500">{app.student?.email}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {(app.student?.name || 'U').charAt(0)}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {app.testScore && (
                            <span className="text-[9px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 px-2 py-1 rounded">
                              Score: {app.testScore}
                            </span>
                          )}
                          <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-50 text-slate-500 px-2 py-1 rounded">
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
                          {app.student?.resume && (
                            <a 
                              href={app.student.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                              title="View Resume"
                            >
                              <FileText size={14} />
                            </a>
                          )}
                          <button 
                            className="p-1.5 bg-slate-50 text-slate-500 rounded hover:bg-slate-100 transition-colors"
                            title="Contact Email"
                          >
                            <Mail size={14} />
                          </button>
                          
                          {/* Status Dropdown for mobile/accessibility */}
                          <select 
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className="ml-auto text-[10px] font-bold bg-slate-50 border-none rounded-lg focus:ring-0 text-slate-600 cursor-pointer"
                          >
                            <option value="applied">Applied</option>
                            <option value="test_scheduled">Test Phase</option>
                            <option value="interview_scheduled">Interviewing</option>
                            <option value="offer_received">Offered</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default JobDetailedView;
