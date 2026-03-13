import React, { useState, useEffect } from 'react';
import {
  FaBriefcase,
  FaFilter,
  FaUser,
  FaBuilding,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaCalendarAlt,
  FaTrophy,
  FaFileAlt,
  FaHistory,
  FaPaperPlane
} from 'react-icons/fa';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

const ApplicationModal = ({ application, mode, onClose, onUpdate, updating, onModeChange }) => {
  const [formData, setFormData] = useState({
    coverLetter: application?.coverLetter || '',
    notes: application?.notes || '',
    resume: application?.resume || ''
  });

  useEffect(() => {
    setFormData({
      coverLetter: application?.coverLetter || '',
      notes: application?.notes || '',
      resume: application?.resume || ''
    });
  }, [application]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusInfo = (status) => {
    const configs = {
      'applied': { color: 'bg-blue-50 text-blue-600 border-blue-200', label: 'Applied', icon: FaClock, gradient: 'from-blue-600 to-indigo-600' },
      'test_scheduled': { color: 'bg-amber-50 text-amber-600 border-amber-200', label: 'Test Scheduled', icon: FaCalendarAlt, gradient: 'from-amber-500 to-orange-600' },
      'test_completed': { color: 'bg-orange-50 text-orange-600 border-orange-200', label: 'Test Completed', icon: FaCheckCircle, gradient: 'from-orange-500 to-red-600' },
      'interview_scheduled': { color: 'bg-purple-50 text-purple-600 border-purple-200', label: 'Interview Scheduled', icon: FaUser, gradient: 'from-purple-600 to-indigo-700' },
      'interview_completed': { color: 'bg-indigo-50 text-indigo-600 border-indigo-200', label: 'Interview Completed', icon: FaCheckCircle, gradient: 'from-indigo-600 to-blue-700' },
      'offer_received': { color: 'bg-emerald-50 text-emerald-600 border-emerald-200', label: 'Offer Received', icon: FaTrophy, gradient: 'from-emerald-500 to-teal-600' },
      'rejected': { color: 'bg-rose-50 text-rose-600 border-rose-200', label: 'Rejected', icon: FaTimes, gradient: 'from-rose-500 to-pink-600' },
      'withdrawn': { color: 'bg-gray-50 text-gray-600 border-gray-200', label: 'Withdrawn', icon: FaTrash, gradient: 'from-gray-500 to-slate-600' }
    };
    return configs[status] || configs['applied'];
  };

  const status = getStatusInfo(application.status || 'applied');

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl flex items-center justify-center z-[200] p-4 sm:p-6 overflow-hidden animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col animate-in zoom-in-95 duration-300">

        {/* Header Section */}
        <div className="relative p-8 md:p-10 border-b border-slate-100/50 flex-shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 opacity-50 rounded-full blur-3xl -mr-32 -mt-32" />

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
                {mode === 'view' ? 'Application Dossier' : 'Refine Transmission'}
              </h2>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID: {application.id?.slice(-12).toUpperCase() || 'VAULT-X01'}</span>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${status.color} shadow-sm`}>
                  {status.label}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all duration-300 border border-slate-100 shadow-sm"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-12 custom-scrollbar scroll-smooth">
          {mode === 'view' ? (
            <div className="space-y-12 animate-in fade-in duration-700">

              {/* Premium Core Card */}
              <div className={`relative group overflow-hidden rounded-[2rem] bg-gradient-to-br ${status.gradient} p-8 md:p-10 text-white shadow-2xl shadow-blue-900/10`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[64px] -mr-24 -mt-24" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full blur-[64px] -ml-16 -mb-16" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">{application.role}</h3>
                      <div className="flex items-center gap-2 text-white/80 font-bold text-base">
                        <FaBuilding size={14} className="text-white/60" />
                        {application.company}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Quantum Value</p>
                      <p className="text-xl font-black text-white">{application.salary}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-10 pt-8 border-t border-white/10">
                    <div>
                      <p className="text-[9px] uppercase font-black text-white/40 tracking-widest mb-1.5">Launch Date</p>
                      <p className="font-bold text-sm">{application.appliedDate}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-black text-white/40 tracking-widest mb-1.5">Deployment</p>
                      <p className="font-bold text-sm truncate">{application.location || 'Remote Node'}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[9px] uppercase font-black text-white/40 tracking-widest mb-1.5">Cycle Type</p>
                      <p className="font-bold text-sm uppercase tracking-tighter">{application.type || 'Standard'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Letter Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm"><FaPaperPlane size={12} /></div>
                  <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.1em]">Cover Strategy</h4>
                </div>
                <div className="pl-11">
                  <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8 text-slate-600 text-base leading-relaxed whitespace-pre-wrap italic font-medium">
                    {application.coverLetter || 'The standard protocol cover letter was utilized for this mission.'}
                  </div>
                </div>
              </div>

              {/* Timeline Section */}
              {application.timeline && (
                <div className="space-y-8 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm"><FaHistory size={12} /></div>
                    <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.1em]">Mission Milestones</h4>
                  </div>
                  <div className="pl-11 relative space-y-12 before:content-[''] before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                    {application.timeline.map((event, idx) => (
                      <div key={idx} className="relative group">
                        <div className={`absolute -left-[2.1rem] top-1.5 w-4 h-4 rounded-full border-2 border-white ring-4 transition-all duration-500 group-hover:scale-125 ${idx === 0 ? 'bg-blue-600 ring-blue-50' : 'bg-slate-300 ring-slate-50'}`}></div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors">{event.date}</p>
                          <p className="text-base font-black text-slate-800 tracking-tight mb-1">{event.action}</p>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); onUpdate(formData); }} className="space-y-12 animate-in fade-in duration-500">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Refined Cover Protocol</label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full text-base font-medium border-2 border-slate-100 bg-slate-50/50 rounded-[2.5rem] p-10 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all duration-500 resize-none shadow-sm placeholder:text-slate-300"
                    placeholder="Tailor your mission statement..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Dynamic Resume Nexus</label>
                    <input
                      type="url"
                      name="resume"
                      value={formData.resume}
                      onChange={handleInputChange}
                      className="w-full text-sm font-bold border-2 border-slate-100 bg-slate-50/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono"
                      placeholder="Cloud link to PDF..."
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Strategy Notes</label>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full text-sm font-bold border-2 border-slate-100 bg-slate-50/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      placeholder="Internal observation..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:-translate-y-1 disabled:opacity-50 transition-all duration-300"
                >
                  {updating ? 'Synchronizing Vault...' : 'Commit Revisions'}
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange('view')}
                  className="flex-1 py-6 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all duration-300"
                >
                  Discard
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        {mode === 'view' && (
          <div className="p-8 md:p-10 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onModeChange('edit')}
              className="flex-1 py-6 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <FaEdit className="group-hover:rotate-12 transition-transform" />
              Modify Transmission
            </button>
            <button className="flex-1 py-6 bg-white border border-slate-200 text-slate-500 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-3">
              <FaBriefcase />
              Original Brief
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Applications = () => {
  const [applicationsData, setApplicationsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getApplications({ status: filter });
      setApplicationsData(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplication = async (updatedData) => {
    try {
      setUpdating(true);
      await studentApi.updateApplication(selectedApplication.id, updatedData);
      toast.success('Successfully updated in vault');
      setShowModal(false);
      fetchApplications();
    } catch (error) {
      toast.error('Sync failed. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusInfo = (status) => {
    const configs = {
      'applied': { color: 'bg-blue-50 text-blue-600', label: 'Applied', icon: FaClock },
      'test_scheduled': { color: 'bg-amber-50 text-amber-600', label: 'Test Scheduled', icon: FaCalendarAlt },
      'test_completed': { color: 'bg-orange-50 text-orange-600', label: 'Test Completed', icon: FaCheckCircle },
      'interview_scheduled': { color: 'bg-purple-50 text-purple-600', label: 'Interview Scheduled', icon: FaUser },
      'offer_received': { color: 'bg-emerald-50 text-emerald-600', label: 'Offer Received', icon: FaTrophy },
      'rejected': { color: 'bg-rose-50 text-rose-600', label: 'Rejected', icon: FaTimes },
    };
    return configs[status] || configs['applied'];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
        <div className="w-16 h-16 border-4 border-blue-50 flex items-center justify-center rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600 animate-grow h-1 origin-bottom"></div>
          <FaBriefcase className="text-blue-200 animate-pulse" size={24} />
        </div>
        <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Accessing Vault Data</p>
      </div>
    );
  }

  if (!applicationsData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Failed to load vault data. Please try again later.</p>
      </div>
    );
  }

  const { applications, stats, categoryStats } = applicationsData;

  return (
    <div className="space-y-10 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Application Vault</h2>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1 italic">Totaling {stats.total} professional reach-outs</p>
        </div>

        <div className="flex gap-2 p-1.5 md:p-2 bg-gray-100/50 rounded-xl md:rounded-2xl backdrop-blur-sm overflow-x-auto no-scrollbar max-w-full">
          {['all', 'applied', 'interview_scheduled', 'offer_received'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${filter === f
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {f === 'interview_scheduled' ? 'Interviews' : f === 'offer_received' ? 'Offers' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Vault', val: stats.total, color: 'from-blue-600 to-indigo-600', icon: FaBriefcase, shadow: 'shadow-blue-200' },
          { label: 'Pipeline', val: stats.inProgress, color: 'from-amber-500 to-orange-600', icon: FaClock, shadow: 'shadow-amber-200' },
          { label: 'Secured', val: stats.offers, color: 'from-emerald-600 to-teal-700', icon: FaTrophy, shadow: 'shadow-emerald-200' },
          { label: 'Missed', val: stats.rejected, color: 'from-rose-500 to-pink-600', icon: FaTimes, shadow: 'shadow-rose-200' }
        ].map((s, idx) => (
          <div key={idx} className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-200 transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center">
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${s.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />

            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-2xl ${s.shadow}/40 mb-4 group-hover:scale-110 transition-transform duration-500`}>
              <s.icon size={22} />
            </div>

            <p className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{s.val}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Categories Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <FaFilter size={14} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Industry Reach</h3>
          </div>

          <div className="space-y-4">
            {categoryStats?.map((cat, idx) => (
              <div key={idx} className="group p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-[0_20px_40px_-12px_rgba(79,70,229,0.08)] transition-all duration-500 cursor-pointer overflow-hidden relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${cat.color}`}>{cat.label}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Avg CTC: {cat.salary}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-800 font-black text-xs">
                    {cat.count}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color.replace('text', 'bg')} transition-all duration-1000 shadow-[0_0_12px_rgba(0,0,0,0.1)]`} style={{ width: `${(cat.count / stats.total) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main List Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
              <FaHistory size={14} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Pipeline Inventory</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {applications?.map((app, idx) => {
              const info = getStatusInfo(app.status);
              return (
                <div key={app.id || idx} className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-blue-200 hover:shadow-[0_32px_64px_-16px_rgba(59,130,246,0.1)] transition-all duration-500 flex flex-col">
                  {/* Status & Date */}
                  <div className="flex justify-between items-start mb-8">
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] ${info.color} flex items-center gap-2 border shadow-sm`}>
                      <info.icon size={10} />
                      {info.label}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{app.appliedDate}</span>
                  </div>

                  {/* Body */}
                  <div className="flex-1 space-y-3">
                    <h4 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-700 transition-colors tracking-tight">{app.role}</h4>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                      <FaBuilding size={12} className="text-blue-400" />
                      {app.company}
                    </div>
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Quantum Package</p>
                      <p className="text-sm font-black text-emerald-600 tracking-tight">{app.salary}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedApplication(app); setModalMode('view'); setShowModal(true); }}
                        className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-500 flex items-center justify-center border border-slate-100 shadow-sm"
                        title="Quantum View"
                      >
                        <FaEye size={18} />
                      </button>
                      <button
                        onClick={() => { setSelectedApplication(app); setModalMode('edit'); setShowModal(true); }}
                        className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-500 flex items-center justify-center border border-slate-100 shadow-sm"
                        title="Refine Data"
                      >
                        <FaEdit size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {applications?.length === 0 && (
            <div className="glass-card rounded-[2.5rem] py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <FaBriefcase size={32} />
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No records found matching this filter</p>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onUpdate={handleUpdateApplication}
          updating={updating}
          onModeChange={setModalMode}
        />
      )}
    </div>
  );
};

export default Applications;
