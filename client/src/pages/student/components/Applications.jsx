import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[200] p-4 sm:p-6 overflow-hidden">
      <div className="bg-white rounded max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-sm border border-slate-200 flex flex-col">

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
              className="w-10 h-10 rounded bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors border border-slate-200 shadow-sm"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-12 custom-scrollbar scroll-smooth">
          {mode === 'view' ? (
            <div className="space-y-12 animate-in fade-in duration-700">

              {/* Premium Core Card */}
              <div className={`relative group overflow-hidden rounded p-6 md:p-8 text-white ${status.color.replace('text-', 'bg-').split(' ')[0]} shadow-sm border border-slate-200 bg-slate-900`}>
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
                  <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center shadow-sm"><FaPaperPlane size={12} /></div>
                  <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.1em]">Cover Strategy</h4>
                </div>
                <div className="pl-11">
                  <div className="bg-slate-50 border border-slate-200 rounded p-6 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {application.coverLetter || 'The standard protocol cover letter was utilized for this mission.'}
                  </div>
                </div>
              </div>

              {/* Timeline Section */}
              {application.timeline && (
                <div className="space-y-8 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center shadow-sm"><FaHistory size={12} /></div>
                    <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.1em]">Mission Milestones</h4>
                  </div>
                  <div className="pl-11 relative space-y-8 before:content-[''] before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
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
                    className="w-full text-sm font-medium border border-slate-200 bg-white rounded p-6 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors resize-none shadow-sm placeholder:text-slate-400"
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
                      className="w-full text-sm font-bold border border-slate-200 bg-white rounded px-4 py-3 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors font-mono"
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
                      className="w-full text-sm font-bold border border-slate-200 bg-white rounded px-4 py-3 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
                      placeholder="Internal observation..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-3 bg-slate-900 text-white rounded font-bold uppercase tracking-widest text-sm shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  {updating ? 'Synchronizing Vault...' : 'Commit Revisions'}
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange('view')}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded font-bold uppercase tracking-widest text-sm hover:bg-slate-50 transition-colors"
                >
                  Discard
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        {mode === 'view' && (
          <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onModeChange('edit')}
              className="flex-1 py-4 bg-slate-900 text-white rounded font-bold uppercase tracking-widest text-xs shadow-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-3"
            >
              <FaEdit /> Modify Transmission
            </button>
            <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-3">
              <FaBriefcase /> Original Brief
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Applications = () => {
  const navigate = useNavigate();
  const [applicationsData, setApplicationsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'internships'
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
      'interview_completed': { color: 'bg-indigo-50 text-indigo-600', label: 'Interview Completed', icon: FaCheckCircle },
      'offer_received': { color: 'bg-emerald-50 text-emerald-600', label: 'Offer Received', icon: FaTrophy },
      'rejected': { color: 'bg-rose-50 text-rose-600', label: 'Rejected', icon: FaTimes },
      'withdrawn': { color: 'bg-gray-50 text-gray-600', label: 'Withdrawn', icon: FaHistory },
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

  const { applications, stats } = applicationsData;
  const filteredApps = applications.filter(app =>
    activeTab === 'internships' ? app.type === 'internship' : app.type !== 'internship'
  );

  return (
    <div className="space-y-10 pb-20 mt-4">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="flex items-center gap-4 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-2.5 text-sm font-bold rounded-md transition-all ${
              activeTab === 'jobs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Job Applications
          </button>
          <button
            onClick={() => setActiveTab('internships')}
            className={`px-6 py-2.5 text-sm font-bold rounded-md transition-all ${
              activeTab === 'internships' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Internship Offers
          </button>
        </div>

      </div>

      {/* Main List Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApps?.map((app, idx) => {
            const info = getStatusInfo(app.status);
            return (
              <div 
                key={app.id || idx} 
                onClick={() => navigate(`/student-dashboard/application-tracking/${app.id}`)}
                className="group bg-white rounded-none border-2 border-slate-200 hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col cursor-pointer relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors"></div>
                
                <div className="p-8 relative z-10 space-y-8">
                  {/* Status & Date */}
                  <div className="flex justify-between items-start">
                    <div className={`px-4 py-1.5 rounded-none text-[10px] font-black uppercase tracking-[0.2em] ${info.color} flex items-center gap-1.5 border-2 border-current bg-white shadow-sm`}>
                      <info.icon size={12} />
                      {info.label}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded">{app.appliedDate}</span>
                  </div>

                  {/* Body */}
                  <div className="space-y-4">
                    <h4 className="text-2xl font-black text-slate-900 leading-none tracking-tighter group-hover:text-blue-600 transition-colors">{app.role}</h4>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <FaBuilding size={14} className="text-slate-400" />
                      {app.company}
                    </div>
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="pt-8 border-t-2 border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{activeTab === 'jobs' ? 'Launch Package' : 'Stipend Protocol'}</p>
                      <p className="text-lg font-black text-emerald-600 tracking-tight">{app.salary}</p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-900 group-hover:translate-x-1 transition-transform">
                       <span className="text-[10px] font-black uppercase tracking-widest">Track Mission</span>
                       <ChevronRight size={16} strokeWidth={3} className="text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredApps?.length === 0 && (
          <div className="bg-white border border-slate-200 shadow-sm rounded py-32 text-center max-w-2xl mx-auto mt-12">
            <div className="w-20 h-20 bg-slate-50 text-slate-400 border border-slate-100 rounded flex items-center justify-center mx-auto mb-6">
              <FaBriefcase size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No {activeTab} found</h3>
            <p className="text-gray-500 font-medium text-sm max-w-sm mx-auto">
              You haven't submitted any {activeTab === 'internships' ? 'internship' : 'job'} applications matching this criteria yet.
            </p>
          </div>
        )}
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
