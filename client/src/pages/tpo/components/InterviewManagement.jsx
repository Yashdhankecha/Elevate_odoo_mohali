import React, { useState, useEffect } from 'react';
import { tpoApi } from '../../../services/tpoApi';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  User,
  Building2,
  MapPin,
  BarChart3,
  Download,
  ChevronRight,
  MoreVertical,
  Zap,
  Star,
  Layers,
  Activity,
  UserCheck,
  Target,
  ArrowUpRight,
  X,
  Loader2,
  FileText,
  Clock3,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const InterviewManagement = () => {
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    type: 'All',
    dateFrom: '',
    dateTo: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInterviews: 0
  });

  const [formData, setFormData] = useState({
    candidate: '',
    candidateId: '',
    role: '',
    date: '',
    time: '',
    type: 'Technical',
    interviewer: '',
    location: '',
    duration: '60',
    notes: '',
    company: ''
  });

  useEffect(() => {
    fetchInterviews();
    fetchStats();
    fetchCompanies();
    fetchStudents();
  }, [filters, pagination.currentPage]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const params = { ...filters, page: pagination.currentPage, limit: 10 };
      const response = await tpoApi.getInterviews(params);
      setInterviews(response.interviews);
      setPagination(prev => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalInterviews: response.pagination.totalInterviews
      }));
    } catch (error) {
      toast.error('Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await tpoApi.getInterviewStats();
      setStats(response);
    } catch (error) {}
  };

  const fetchCompanies = async () => {
    try {
      const response = await tpoApi.getCompanies();
      setCompanies(response);
    } catch (error) {}
  };

  const fetchStudents = async () => {
    try {
      const response = await tpoApi.getStudents({ limit: 1000 });
      setStudents(response.students || []);
    } catch (error) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInterview) {
        await tpoApi.updateInterview(editingInterview._id, formData);
        toast.success('Interview updated successfully');
      } else {
        const interviewResponse = await tpoApi.createInterview(formData);
        if (formData.candidateId) {
          try {
            await tpoApi.createNotification({
              recipient: formData.candidateId,
              type: 'interview_scheduled',
              title: 'Interview Scheduled',
              message: `Your interview for ${formData.role} at ${companies.find(c => c._id === formData.company)?.companyName || 'the company'} has been scheduled.`,
              interviewId: interviewResponse.data?.interview?._id
            });
          } catch (e) {}
        }
        toast.success('Interview scheduled and student notified');
      }
      setShowForm(false);
      setEditingInterview(null);
      resetForm();
      fetchInterviews();
    } catch (error) {
      toast.error('Failed to schedule interview');
    }
  };

  const handleEdit = (interview) => {
    setEditingInterview(interview);
    setFormData({
      candidate: interview.candidate,
      candidateId: interview.candidateId || '',
      role: interview.role,
      date: (interview.date || '').split('T')[0],
      time: interview.time,
      type: interview.type,
      interviewer: interview.interviewer,
      location: interview.location,
      duration: interview.duration,
      notes: interview.notes || '',
      company: interview.company?._id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this interview?')) return;
    try {
      await tpoApi.deleteInterview(id);
      toast.success('Interview cancelled');
      fetchInterviews();
    } catch (error) {
      toast.error('Failed to cancel interview');
    }
  };

  const resetForm = () => {
    setFormData({ candidate: '', candidateId: '', role: '', date: '', time: '', type: 'Technical', interviewer: '', location: '', duration: '60', notes: '', company: '' });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
             <Clock3 size={32} className="text-blue-600" />
             Interview Management
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Schedule and track interview sessions for your students.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button onClick={() => {}} className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-all font-bold uppercase text-[10px] tracking-widest text-slate-600">
              <Download size={16} /> Export Data
           </button>
           <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 hover:shadow-2xl transition-all font-bold uppercase text-[10px] tracking-widest active:scale-95 group">
              <Plus size={16} className="group-hover:rotate-90 transition-transform" />
              Schedule Interview
           </button>
        </div>
      </div>

      {/* Stats HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Interviews', value: stats?.overview.totalInterviews || 0, icon: Layers, color: 'text-slate-900', bg: 'bg-slate-50' },
           { label: 'Upcoming', value: stats?.overview.scheduledInterviews || 0, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Completed', value: stats?.overview.completedInterviews || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Completion Rate', value: `${stats?.overview.completionRate || 0}%`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
         ].map((stat, i) => (
           <div key={i} className="glass-card p-6 rounded-[2rem] border-white/50 hover-lift flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                 <stat.icon size={20} />
              </div>
           </div>
         ))}
      </div>

      {/* Control Center */}
      <div className="glass-card rounded-[2.5rem] p-6 border-white/50 shadow-2xl shadow-slate-200/40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-2">Search Students</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-2">Interview Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">Interviewing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-2">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-2">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="glass-card rounded-[2.5rem] border-white/50 overflow-hidden shadow-2xl shadow-slate-200/50">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Name</th>
                <th className="px-6 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Role</th>
                <th className="px-6 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                <th className="px-6 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</th>
                <th className="px-8 py-6 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-sans">
              {loading ? (
                <tr>
                   <td colSpan="6" className="py-20 text-center">
                      <Loader2 className="animate-spin w-10 h-10 text-blue-600 mx-auto" />
                   </td>
                </tr>
              ) : interviews.map((interview) => (
                <tr key={interview._id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                          <span className="text-sm font-black text-slate-900">{interview.candidate[0]}</span>
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">{interview.candidate}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Interviewer: {interview.interviewer}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg font-bold uppercase tracking-widest text-[9px]">
                       {interview.role}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1.5 slice">
                       <span className={`px-2.5 py-1 rounded-xl border text-[9px] font-bold uppercase tracking-widest ${getStatusStyle(interview.status)}`}>
                          {interview.status}
                       </span>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{interview.type}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar size={10} className="text-blue-500" />
                          {new Date(interview.date).toLocaleDateString()}
                       </p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={10} className="text-slate-400" />
                          {interview.time} ({interview.duration}m)
                       </p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                       <Building2 size={14} className="text-slate-400" />
                       <p className="text-[11px] font-bold text-slate-700 truncate max-w-[120px] uppercase tracking-tighter">{interview.company?.companyName || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                       <button onClick={() => handleEdit(interview)} className="p-2.5 bg-white text-slate-400 hover:text-blue-600 rounded-xl shadow-sm border border-slate-100 hover:border-blue-100 transition-all">
                          <Edit3 size={14} />
                       </button>
                       <button onClick={() => handleDelete(interview._id)} className="p-2.5 bg-white text-slate-400 hover:text-rose-600 rounded-xl shadow-sm border border-slate-100 hover:border-rose-100 transition-all">
                          <Trash2 size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => { setShowForm(false); setEditingInterview(null); resetForm(); }}></div>
           <div className="bg-white rounded-[3rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar relative z-10 animate-slide-up shadow-2xl">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-xl z-20">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                       {editingInterview ? 'Update Interview' : 'Schedule New Interview'}
                    </h2>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Enter interview details for the candidate</p>
                 </div>
                 <button onClick={() => setShowForm(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all text-slate-400">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Select Student</label>
                    <select
                      required
                      value={formData.candidateId}
                      onChange={(e) => {
                        const s = students.find(s => s._id === e.target.value);
                        setFormData(prev => ({ ...prev, candidateId: e.target.value, candidate: s ? s.name : '' }));
                      }}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Candidate</option>
                      {students.map(s => (
                        <option key={s._id} value={s._id}>{s.name} - {s.student?.rollNumber || 'ID'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Job Role</label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                      placeholder="e.g. Software Developer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Interview Date</label>
                      <input type="date" required value={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Time</label>
                      <input type="time" required value={formData.time} onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Interview Type</label>
                      <select required value={formData.type} onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none">
                         {['Technical', 'HR Round', 'Managerial', 'Final'].map(t => <option key={t} value={t}>{t} Round</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Company</label>
                      <select required value={formData.company} onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none">
                         <option value="">Select Company</option>
                         {companies.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Interviewer Name</label>
                      <input type="text" required value={formData.interviewer} onChange={(e) => setFormData(prev => ({ ...prev, interviewer: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none" placeholder="Enter interviewer name" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Location / Link</label>
                      <input type="text" required value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none" placeholder="Office location or meeting link" />
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Additional Notes</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-6 text-sm font-medium text-slate-700 h-32 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Any special instructions for the interviewer or student..." />
                </div>

                <div className="flex gap-4 pt-6">
                   <button type="submit" className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-bold uppercase text-[11px] tracking-widest hover:shadow-2xl transition-all shadow-xl active:scale-95">Save Interview Schedule</button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default InterviewManagement;
