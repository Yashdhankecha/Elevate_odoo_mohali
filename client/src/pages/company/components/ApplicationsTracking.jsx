import React, { useState, useEffect } from 'react';
import {
  Users,
  Filter,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Layers,
  Zap,
  Download,
  UserCheck,
  Loader2,
  AlertCircle,

  RefreshCw,
  X,
  FileText,
  Mail,
  Phone,
  MapPin,
  GraduationCap
} from 'lucide-react';
import { getAllApplications, updateApplicationStatus } from '../../../services/companyApi';
import toast from 'react-hot-toast';

const ApplicantModal = ({ application, onClose }) => {
  if (!application) return null;
  const student = application.student || {};
  const job = application.jobPosting || {};

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl relative z-10 shadow-2xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-slide-up">
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center justify-center transition-all">
          <X size={20} />
        </button>

        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-200">
            {student.name ? student.name.substring(0, 2).toUpperCase() : 'ST'}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{student.name || 'Unknown Student'}</h2>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-1">
              Applied for: <span className="text-slate-900">{job.title || 'Unknown Role'}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><UserCheck size={14} /> Contact Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <Mail size={16} className="text-slate-400" /> {student.email || 'N/A'}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <Phone size={16} className="text-slate-400" /> {student.phoneNumber || student.phone || 'N/A'}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <MapPin size={16} className="text-slate-400" /> {student.location || 'N/A'}
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><GraduationCap size={14} /> Academic Profile</h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-white p-3 rounded-xl border border-blue-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Degree</p>
                <p className="text-sm font-black text-slate-800">{student.degree || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-blue-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Branch</p>
                <p className="text-sm font-black text-slate-800">{student.department || student.branch || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-blue-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Passing Year</p>
                <p className="text-sm font-black text-slate-800">{student.graduationYear || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-blue-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">CGPA/Percentage</p>
                <p className="text-sm font-black text-blue-600">{student.cgpa || student.percentage || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4"><FileText size={14} /> Student Description / Bio</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {student.bio || student.about || 'No bio provided.'}
            </p>
          </div>

          {application.coverLetter && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4"><FileText size={14} /> Cover Letter</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {application.coverLetter}
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-slate-50">
            {student.resume && (
              <a href={student.resume} target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-center flex-1">
                View Resume
              </a>
            )}
            {student.portfolioLink && (
              <a href={student.portfolioLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all text-center flex-1">
                View Portfolio
              </a>
            )}
            {student.linkedinProfile && (
              <a href={student.linkedinProfile} target="_blank" rel="noreferrer" className="px-6 py-3 bg-[#0a66c2] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#004182] transition-all shadow-lg shadow-blue-200/50 text-center flex-1">
                LinkedIn
              </a>
            )}
            {(!student.resume && !student.portfolioLink && !student.linkedinProfile) && (
              <div className="text-sm font-bold text-slate-400 w-full text-center p-4 bg-slate-50 rounded-xl">No external links or resume provided.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ApplicationsTracking = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      const data = await getAllApplications(filters);
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      toast.success(`Application ${newStatus}`);
      setApplications(prev =>
        prev.map(app =>
          (app._id === applicationId) ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredApplications = applications.filter(app => {
    const studentName = app.student?.name || '';
    const role = app.jobPosting?.title || '';
    const dept = app.student?.department || '';
    const matchesSearch = (
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesSearch;
  });

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app._id));
    }
  };

  const handleSelectApplication = (id) => {
    if (selectedApplications.includes(id)) {
      setSelectedApplications(selectedApplications.filter(appId => appId !== id));
    } else {
      setSelectedApplications([...selectedApplications, id]);
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedApplications.length === 0) return;
    const promises = selectedApplications.map(id => updateApplicationStatus(id, newStatus));
    try {
      await Promise.all(promises);
      toast.success(`${selectedApplications.length} application(s) ${newStatus}`);
      setApplications(prev =>
        prev.map(app =>
          selectedApplications.includes(app._id) ? { ...app, status: newStatus } : app
        )
      );
      setSelectedApplications([]);
    } catch (err) {
      toast.error('Failed to update some applications');
    }
  };

  const getStatusStyle = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'shortlisted':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'interview_scheduled':
      case 'interview':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'applied':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'rejected':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'offered':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'hired':
        return 'bg-teal-50 text-teal-600 border-teal-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getDisplayStatus = (status) => {
    return (status || 'applied').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <UserCheck size={32} className="text-blue-600" />
            Acquisition Pipeline
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Live tracking and evaluation of incoming talent applications.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchApplications}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
            <Download size={18} />
            Export
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 hover:shadow-2xl transition-all font-bold text-sm active:scale-95">
            <Zap size={18} />
            Bulk Actions
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="glass-card rounded-[2rem] p-4 flex flex-wrap items-center justify-between gap-4 border-white/50">
        <div className="flex items-center gap-8 pl-4">
          <div className="flex items-center gap-3">
            <Filter size={14} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter By Status</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent border-none text-sm font-bold text-slate-900 focus:ring-0 cursor-pointer"
          >
            <option value="all">All Applications</option>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="offered">Offered</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="relative group flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
          <input
            type="text"
            placeholder="Search by candidate name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 size={36} className="text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading applications...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <AlertCircle size={36} className="text-rose-500" />
          <p className="text-gray-700 font-semibold">{error}</p>
          <button
            onClick={fetchApplications}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Retry
          </button>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="glass-card rounded-[2.5rem] flex flex-col items-center justify-center py-24 space-y-4">
          <Users size={48} className="text-gray-300" />
          <p className="text-gray-500 font-semibold text-lg">No applications found</p>
          <p className="text-gray-400 text-sm">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Applications will appear here once candidates apply to your jobs'}
          </p>
        </div>
      ) : (
        /* Applications Data Table */
        <div className="glass-card rounded-[2.5rem] border-white/50 overflow-hidden shadow-2xl shadow-slate-200/50">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-left">
                    <input
                      type="checkbox"
                      checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                      onChange={handleSelectAll}
                      className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied For</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied On</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-sans">
                {filteredApplications.map((app) => {
                  const studentName = app.student?.name || 'Unknown';
                  const role = app.jobPosting?.title || 'Unknown Role';
                  const email = app.student?.email || '-';
                  const appDate = app.appliedDate || app.createdAt;
                  const isUpdating = updatingStatus === app._id;

                  return (
                    <tr key={app._id} className={`group hover:bg-slate-50/50 transition-all ${selectedApplications.includes(app._id) ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-8 py-6">
                        <input
                          type="checkbox"
                          checked={selectedApplications.includes(app._id)}
                          onChange={() => handleSelectApplication(app._id)}
                          className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                            <span className="text-sm font-black text-slate-900">{getInitials(studentName)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none mb-1">{studentName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{app.student?.phoneNumber || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-slate-800 tracking-tight">{role}</p>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded inline-block">{app.jobPosting?.category || 'General'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-xs text-slate-600 font-medium">{email}</p>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                          {getDisplayStatus(app.status)}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[10px] font-black text-slate-900">{appDate ? new Date(appDate).toLocaleDateString() : '-'}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 transition-all">
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'shortlisted')}
                            disabled={isUpdating}
                            title="Shortlist"
                            className="p-2.5 bg-white text-slate-400 hover:text-emerald-600 rounded-xl shadow-sm border border-slate-100 hover:border-emerald-100 transition-all disabled:opacity-50"
                          >
                            {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'rejected')}
                            disabled={isUpdating}
                            title="Reject"
                            className="p-2.5 bg-white text-slate-400 hover:text-rose-600 rounded-xl shadow-sm border border-slate-100 hover:border-rose-100 transition-all disabled:opacity-50"
                          >
                            <XCircle size={14} />
                          </button>
                          <button
                            title="View details"
                            onClick={() => setSelectedApplication(app)}
                            className="p-2.5 bg-white text-slate-400 hover:text-blue-600 rounded-xl shadow-sm border border-slate-100 hover:border-blue-100 transition-all"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Actions HUD */}
      {selectedApplications.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] w-full max-w-2xl px-4 animate-slide-up">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white ring-4 ring-indigo-500/20">
                <Layers size={18} />
              </div>
              <div>
                <p className="text-white font-black text-sm tracking-tight">{selectedApplications.length} Selected</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Ready for Bulk Actions</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusUpdate('shortlisted')}
                className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
              >
                Shortlist All
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('rejected')}
                className="px-6 py-3 bg-rose-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95"
              >
                Reject All
              </button>
              <button
                onClick={() => setSelectedApplications([])}
                className="px-4 py-3 bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-600 transition-all active:scale-95"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedApplication && (
        <ApplicantModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
};

export default ApplicationsTracking;
