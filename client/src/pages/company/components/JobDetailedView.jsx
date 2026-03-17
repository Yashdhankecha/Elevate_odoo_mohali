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

  const ctcNum = Number(job.ctc);
  const jobSalary = (!isNaN(ctcNum) && ctcNum > 0) ? `₹${(ctcNum / 100000).toFixed(1)} LPA` : (job.salary || job.stipend ? `₹${job.salary || job.stipend}` : job.ctc || 'Not Specified');
  
  return (
    <div className="space-y-6 pb-20 w-full min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-8 z-[100] p-4 rounded shadow-md border flex items-center gap-3 transition-opacity ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded border border-slate-200 shadow-sm mt-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/company-dashboard/jobs')}
            className="p-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors text-slate-500"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold">
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">
                {job.department || job.category || 'Job Description'}
              </span>
              <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                job.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}>
                {job.isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                {job.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
              {job.jobTitle || job.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Job Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-0.5">Location</p>
            <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{job.location || job.companyLocation || 'Not Specified'}</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 rounded border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CircleDollarSign size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-0.5">Package</p>
            <p className="text-sm font-bold text-slate-800">{jobSalary}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 rounded border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-0.5">Applications</p>
            <p className="text-sm font-bold text-slate-800">{applications.length} Total</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-rose-50 rounded border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-0.5">Deadline</p>
            <p className="text-sm font-bold text-slate-800">
              {job.deadline || job.applicationDeadline ? new Date(job.deadline || job.applicationDeadline).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Job Details Overview */}
      <div className="bg-white rounded p-6 shadow-sm border border-slate-200 mt-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText size={18} className="text-slate-500" />
          Role Description & Requirements
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">About The Role</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {job.description || job.jobDescription || 'No description provided.'}
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Requirements</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {job.requirements || 'N/A'}
              </p>
            </div>
            {job.skills && job.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded capitalize shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {job.responsibilities && (
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Responsibilities</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {job.responsibilities}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area: Kanban Board */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Briefcase className="text-slate-500" size={20} />
          Applicant Pipeline
        </h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
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
                className="bg-slate-50 border border-slate-200 rounded p-3 min-w-[300px] max-w-[300px] flex-shrink-0 flex flex-col snap-center h-[550px]"
              >
                <div className="flex items-center justify-between mb-3 px-1 border-b border-slate-200 pb-2">
                  <h3 className="font-semibold text-slate-800 text-sm">{round.roundName}</h3>
                  <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-0.5 rounded">
                    {roundApps.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
                  {roundApps.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4 border border-dashed border-slate-300 bg-white/50 rounded">
                      <p className="text-xs font-medium text-slate-400">Empty Stage</p>
                    </div>
                  ) : (
                    roundApps.map(app => (
                      <div 
                        key={app._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app._id)}
                        className="bg-white p-3.5 rounded border border-slate-200 cursor-grab active:cursor-grabbing hover:border-slate-300 shadow-sm transition-colors group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{app.student?.name || 'Unknown Candidate'}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{app.student?.email}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {app.testScore && (
                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              Score: {app.testScore}
                            </span>
                          )}
                          <span className="text-[10px] font-medium text-slate-400 px-1.5 py-0.5 border border-slate-100 rounded">
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100">
                          {app.student?.resume && (
                            <a 
                              href={app.student.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                              title="View Resume"
                            >
                              <FileText size={16} />
                            </a>
                          )}
                          <button 
                            className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                            title="Contact Email"
                          >
                            <Mail size={16} />
                          </button>
                          
                          {/* Status Dropdown for mobile/accessibility */}
                          <select 
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className="ml-auto text-xs font-medium bg-white border border-slate-200 rounded px-1.5 py-1 focus:outline-none focus:border-slate-300 text-slate-700 cursor-pointer"
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
