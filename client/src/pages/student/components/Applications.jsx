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
      'applied': { color: 'bg-blue-50 text-blue-600', label: 'Applied', icon: FaClock },
      'test_scheduled': { color: 'bg-amber-50 text-amber-600', label: 'Test Scheduled', icon: FaCalendarAlt },
      'test_completed': { color: 'bg-orange-50 text-orange-600', label: 'Test Completed', icon: FaCheckCircle },
      'interview_scheduled': { color: 'bg-purple-50 text-purple-600', label: 'Interview Scheduled', icon: FaUser },
      'interview_completed': { color: 'bg-indigo-50 text-indigo-600', label: 'Interview Completed', icon: FaCheckCircle },
      'offer_received': { color: 'bg-emerald-50 text-emerald-600', label: 'Offer Received', icon: FaTrophy },
      'rejected': { color: 'bg-rose-50 text-rose-600', label: 'Rejected', icon: FaTimes },
      'withdrawn': { color: 'bg-gray-50 text-gray-600', label: 'Withdrawn', icon: FaTrash }
    };
    return configs[status] || configs['applied'];
  };

  const status = getStatusInfo(application.status || 'applied');

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-3 md:p-4 animate-fade-in">
      <div className="glass-morphism bg-white rounded-[1.5rem] md:rounded-[2.5rem] max-w-2xl w-full max-h-[92vh] md:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 md:p-8 border-b border-gray-100/50">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-800">
              {mode === 'view' ? 'Application Dossier' : 'Update Application'}
            </h2>
            <p className="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Ref: {application.id?.slice(-8) || 'Elevate-8291'}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all duration-300"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
          {mode === 'view' ? (
            <div className="space-y-8">
              {/* Job Information Card */}
               <div className="relative group overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 text-white shadow-xl shadow-blue-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                
                <div className="relative z-10 space-y-4 md:space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black mb-1">{application.role}</h3>
                      <p className="text-xs md:text-blue-100 font-bold opacity-80 flex items-center gap-2">
                        <FaBuilding size={12} />
                        {application.company}
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md border border-white/20 whitespace-nowrap`}>
                      {status.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-blue-200 tracking-tighter mb-0.5">Applied</p>
                      <p className="font-bold text-xs md:text-sm">{application.appliedDate}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-blue-200 tracking-tighter mb-0.5">Package</p>
                      <p className="font-bold text-xs md:text-sm">{application.salary}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[9px] uppercase font-bold text-blue-200 tracking-tighter mb-0.5">Location</p>
                      <p className="font-bold text-xs md:text-sm">On-site, Mohali</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[9px] uppercase font-bold text-blue-200 tracking-tighter mb-0.5">Match</p>
                      <p className="font-bold text-xs md:text-sm">94%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="grid gap-6">
                <div>
                  <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                    Cover Letter
                  </h4>
                  <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 text-gray-600 text-sm leading-relaxed whitespace-pre-wrap italic">
                    {application.coverLetter || 'Initial cover letter was submitted at the time of application.'}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-3">Resume Source</h4>
                    <div className="bg-white border-2 border-dashed border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:border-blue-200 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                          <FaFileAlt size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600 transition-colors">Resume_Aug_2024.pdf</span>
                      </div>
                      <a href={application.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                        View File
                      </a>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-3">Internal Notes</h4>
                    <div className="bg-amber-50/30 border border-amber-100 rounded-2xl p-4 text-xs text-amber-800 font-medium italic">
                      {application.notes || 'No specific notes recorded for this cycle.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {application.timeline && (
                <div>
                   <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6">Process Milestones</h4>
                   <div className="space-y-6 relative ml-4">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-100"></div>
                      {application.timeline.map((event, idx) => (
                        <div key={idx} className="relative pl-8 group">
                          <div className={`absolute left-[-5px] top-1 w-[11px] h-[11px] rounded-full ring-4 ring-white transition-all duration-300 ${idx === 0 ? 'bg-blue-600 ring-blue-100 scale-125' : 'bg-gray-300'}`}></div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{event.date}</p>
                          <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{event.action}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); onUpdate(formData); }} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-gray-800 uppercase tracking-widest mb-3">
                    Refined Cover Letter
                  </label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-3xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300"
                    placeholder="Tailor your message for this specific role..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black text-gray-800 uppercase tracking-widest mb-3">
                      Dynamic Resume Link
                    </label>
                    <input
                      type="url"
                      name="resume"
                      value={formData.resume}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Google Drive Link"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-800 uppercase tracking-widest mb-3">
                      Personal Strategy Notes
                    </label>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add key talking points..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all duration-300"
                >
                  {updating ? 'Synchronizing...' : 'Save Revisions'}
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange('view')}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all duration-300"
                >
                  Discard Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        {mode === 'view' && (
          <div className="p-5 md:p-8 bg-gray-50/50 border-t border-gray-100/50 flex flex-col sm:flex-row gap-3 md:gap-4">
            <button
               onClick={() => onModeChange('edit')}
               className="flex-1 py-4 bg-blue-600 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
               <FaEdit />
               Edit Application
            </button>
            <button className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2">
               <FaBriefcase />
               View Original Job
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
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                filter === f 
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
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Vault', val: stats.total, color: 'from-blue-600 to-indigo-600', icon: FaBriefcase },
          { label: 'Pipeline', val: stats.inProgress, color: 'from-amber-500 to-orange-600', icon: FaClock },
          { label: 'Secured', val: stats.offers, color: 'from-emerald-600 to-teal-700', icon: FaTrophy },
          { label: 'Missed', val: stats.rejected, color: 'from-rose-500 to-pink-600', icon: FaTimes }
        ].map((s, idx) => (
          <div key={idx} className="glass-card group p-4 md:p-6 rounded-2xl md:rounded-[2rem] hover-lift relative overflow-hidden border-white/50">
             <div className={`absolute -right-4 -top-4 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${s.color} opacity-5 rounded-full`}></div>
             <div className="flex items-center gap-3 md:gap-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg shadow-blue-900/10`}>
                   <s.icon size={18} />
                </div>
                <div>
                   <p className="text-xl md:text-2xl font-black text-gray-800 tracking-tighter">{s.val}</p>
                   <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{s.label}</p>
                </div>
             </div>
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
              <div key={idx} className="glass-card group p-5 rounded-3xl hover-lift border-white/50 cursor-pointer overflow-hidden relative">
                 <div className={`absolute top-0 right-0 w-2 h-full ${cat.color} opacity-20`}></div>
                 <div className="flex justify-between items-start">
                    <div>
                       <p className={`text-sm font-black uppercase tracking-wider ${cat.color}`}>{cat.label}</p>
                       <p className="text-xs text-gray-400 font-bold mt-1">Avg CTC: {cat.salary}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-800 group-hover:bg-gray-100 transition-colors">
                       <span className="text-xs font-black">{cat.count}</span>
                    </div>
                 </div>
                 <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                       <div className={`h-full ${cat.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${(cat.count/stats.total)*100}%` }}></div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications?.map((app, idx) => {
              const info = getStatusInfo(app.status);
              return (
                <div key={app.id || idx} className="glass-card group rounded-[2.5rem] p-8 border-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-500 relative flex flex-col">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-6">
                     <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${info.color} flex items-center gap-1.5`}>
                        <info.icon size={12} />
                        {info.label}
                     </div>
                     <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{app.appliedDate}</span>
                  </div>

                  {/* Body */}
                  <div className="flex-1 space-y-2">
                     <h4 className="text-xl font-black text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">{app.role}</h4>
                     <div className="flex items-center gap-2 text-gray-400">
                        <FaBuilding size={12} />
                        <span className="text-xs font-bold uppercase tracking-wider">{app.company}</span>
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-100/50 flex items-center justify-between">
                     <p className="text-sm font-black text-gray-800">{app.salary}</p>
                     <div className="flex gap-2">
                        <button 
                          onClick={() => { setSelectedApplication(app); setModalMode('view'); setShowModal(true); }}
                          className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center"
                        >
                          <FaEye size={16} />
                        </button>
                        <button 
                          onClick={() => { setSelectedApplication(app); setModalMode('edit'); setShowModal(true); }}
                          className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-emerald-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                        >
                          <FaEdit size={16} />
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
