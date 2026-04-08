import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, MapPin, CircleDollarSign, Calendar, Users,
  CheckCircle2, AlertCircle, Loader2, FileText, Mail, ExternalLink,
  ToggleLeft, ToggleRight, GraduationCap, Phone, Star, ChevronDown, Download, FastForward, Check
} from 'lucide-react';
import { getJobDetails, getJobApplications, updateApplicationStatus, toggleJobActive, advanceApplicantsToRound } from '../../../services/companyApi';
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

const AdvanceRoundModal = ({ isOpen, onClose, selectedCount, onConfirm, selectionRounds }) => {
  const [newStatusObj, setNewStatusObj] = useState(
    selectionRounds?.length > 0 
      ? JSON.stringify({ status: selectionRounds[0].roundType.includes('interview') ? 'interview_scheduled' : 'test_scheduled', roundName: selectionRounds[0].roundName })
      : JSON.stringify({ status: 'test_scheduled', roundName: '' })
  );
  const [advancing, setAdvancing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setAdvancing(true);
    const parsed = JSON.parse(newStatusObj);
    await onConfirm(parsed.status, parsed.roundName);
    setAdvancing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FastForward size={18} className="text-blue-500" />
            Update Application Status
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            &times;
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm font-medium border border-blue-100">
            You are updating the status of <strong>{selectedCount}</strong> applicant{selectedCount !== 1 && 's'}. They will be automatically notified via email.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Assign New Status</label>
            <select
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newStatusObj}
              onChange={(e) => setNewStatusObj(e.target.value)}
            >
              <option value={JSON.stringify({ status: 'applied', roundName: '' })}>Applied</option>
              
              {selectionRounds?.length > 0 ? (
                <>
                  {selectionRounds.map((round) => (
                    <option key={round.roundName} value={JSON.stringify({
                      status: round.roundType.includes('interview') ? 'interview_scheduled' : 'test_scheduled',
                      roundName: `Round ${round.roundNumber}: ${round.roundName}`
                    })}>
                      Advance to: Round {round.roundNumber} ({round.roundName})
                    </option>
                  ))}
                </>
              ) : (
                <>
                  <option value={JSON.stringify({ status: 'test_scheduled', roundName: '' })}>Test Scheduled</option>
                  <option value={JSON.stringify({ status: 'test_completed', roundName: '' })}>Test Completed</option>
                  <option value={JSON.stringify({ status: 'interview_scheduled', roundName: '' })}>Interviewing</option>
                  <option value={JSON.stringify({ status: 'interview_completed', roundName: '' })}>Interview Done</option>
                </>
              )}

              <option value={JSON.stringify({ status: 'offer_received', roundName: 'Offer Sent' })}>Offer Sent</option>
              <option value={JSON.stringify({ status: 'rejected', roundName: 'Rejected' })}>Rejected</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={advancing}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-200 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {advancing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Confirm Update
          </button>
        </div>
      </div>
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

  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAdvanceConfirm = async (newStatus, roundName) => {
    try {
      const response = await advanceApplicantsToRound(id, selectedApplicants, newStatus, roundName);
      toast.success(response.message || 'Status updated successfully!');
      
      // Update local state
      setApplications(prev => prev.map(app => 
        selectedApplicants.includes(app._id) ? { ...app, status: newStatus } : app
      ));
      setSelectedApplicants([]);
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to update status.');
    }
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

  const toggleSelectAll = () => {
    if (selectedApplicants.length === filteredApps.length && filteredApps.length > 0) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(filteredApps.map(app => app._id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedApplicants.includes(id)) {
      setSelectedApplicants(prev => prev.filter(appId => appId !== id));
    } else {
      setSelectedApplicants(prev => [...prev, id]);
    }
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return '?';
    return name.substring(0, 2).toUpperCase();
  };

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

      {/* Info Cards */}
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

      {/* Selection Rounds Timeline */}
      {job.selectionRounds && job.selectionRounds.length > 0 && (
        <div className="bg-white rounded border border-slate-200 p-5 shadow-sm overflow-x-auto">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Selection Process Timeline</h3>
          <div className="flex items-center min-w-max">
            {job.selectionRounds.sort((a,b) => a.roundNumber - b.roundNumber).map((round, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col justify-center w-40 relative group">
                  <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-2 z-10 mx-auto shadow-sm">
                    {round.roundNumber}
                  </div>
                  <p className="text-center text-[11px] font-bold text-slate-800 truncate px-1">{round.roundName}</p>
                  <p className="text-center text-[9px] font-semibold text-slate-500 uppercase">{round.roundType.replace('_', ' ')}</p>
                </div>
                {index < job.selectionRounds.length - 1 && (
                  <div className="flex-1 h-0.5 bg-slate-200 w-16 -mt-8 -mx-4 z-0"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Applicants Section */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-slate-100 gap-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users size={18} className="text-slate-500" /> Applicants
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{applications.length}</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="test_scheduled">Test Scheduled</option>
              <option value="test_completed">Test Completed</option>
              <option value="interview_scheduled">Interviewing</option>
              <option value="interview_completed">Interview Done</option>
              <option value="offer_received">Offered</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Bulk Actions Button */}
            {selectedApplicants.length > 0 && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-bold transition-colors shadow-md shadow-blue-200 animate-fade-in"
              >
                <FastForward size={14} /> Update Status ({selectedApplicants.length})
              </button>
            )}
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="py-20 text-center">
            <Users size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">No applicants in this stage yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-5 py-4 w-12">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                      checked={selectedApplicants.length === filteredApps.length && filteredApps.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Academics</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied & Resume</th>
                  <th className="px-4 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map(app => {
                  const isSelected = selectedApplicants.includes(app._id);
                  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
                  const resumeUrl = app.resume || app.student?.resume;
                  
                  return (
                    <tr key={app._id} className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-blue-50/30 w-full' : ''}`}>
                      <td className="px-5 py-4">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                          checked={isSelected}
                          onChange={() => toggleSelect(app._id)}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs shrink-0">
                            {getInitials(app.student?.name)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{app.student?.name || 'Unknown Candidate'}</p>
                            <p className="text-[11px] text-slate-500">{app.student?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          {app.student?.branch && (
                            <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                              <GraduationCap size={12} className="text-slate-400" /> {app.student.branch} ({app.student?.graduationYear})
                            </span>
                          )}
                          {app.student?.cgpa && (
                            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                              <Star size={12} className="text-emerald-500" /> {app.student.cgpa} CGPA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded border ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2 items-start">
                          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                            <Calendar size={12} /> {new Date(app.appliedDate).toLocaleDateString()}
                          </span>
                          {resumeUrl ? (
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                              <Download size={10} /> View Resume
                            </a>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                              <FileText size={10} /> No Resume
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="text-[11px] font-bold bg-white border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 cursor-pointer max-w-[130px]"
                        >
                          <option value="applied">Applied</option>
                          <option value="test_scheduled">Test Scheduled</option>
                          <option value="test_completed">Test Completed</option>
                          <option value="interview_scheduled">Interviewing</option>
                          <option value="interview_completed">Interview Done</option>
                          <option value="offer_received">Offer Sent</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Description */}
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

      {/* Bulk Status Update Modal */}
      <AdvanceRoundModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCount={selectedApplicants.length}
        onConfirm={handleAdvanceConfirm}
        selectionRounds={job?.selectionRounds}
      />
    </div>
  );
};

export default JobDetailedView;
