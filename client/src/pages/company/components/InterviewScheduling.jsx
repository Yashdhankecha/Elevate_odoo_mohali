import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Clock, 
  Users, 
  Video, 
  MapPin,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  MoreVertical,
  ChevronRight,
  UserCheck,
  Zap,
  Star,
  Layers,
  FileText,
  Clock3,
  Play,
  Check,
  X
} from 'lucide-react';
import { 
  getCompanyInterviews, 
  createInterview, 
  updateInterview, 
  deleteInterview,
  updateInterviewStatus
} from '../../../services/companyApi';

const InterviewScheduling = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const data = await getCompanyInterviews();
      setInterviews(data);
    } catch (err) {
      setError('Neural link to schedule vault failed.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteInterview = async (interviewId) => {
    if (!window.confirm('Abort this evaluation session?')) return;
    try {
      await deleteInterview(interviewId);
      setInterviews(interviews.filter(interview => interview._id !== interviewId));
      showToast('Session purged from schedule');
    } catch (err) {
      showToast('Purge protocol failed', 'error');
    }
  };

  const handleStatusUpdate = async (interviewId, newStatus) => {
    try {
      await updateInterviewStatus(interviewId, newStatus);
      setInterviews(interviews.map(interview => 
        interview._id === interviewId ? { ...interview, status: newStatus } : interview
      ));
      showToast(`Session transitioned to ${newStatus}`);
    } catch (err) {
      showToast('Status transition failed', 'error');
    }
  };

  const handleSubmitInterview = async (formData) => {
    try {
      setSubmitting(true);
      if (selectedInterview) {
        const updatedInterview = await updateInterview(selectedInterview._id, formData);
        setInterviews(interviews.map(interview => 
          interview._id === selectedInterview._id ? updatedInterview : interview
        ));
        showToast('Evaluation protocol updated');
      } else {
        const newInterview = await createInterview(formData);
        setInterviews([...interviews, newInterview]);
        showToast('New session synchronized');
      }
      setShowInterviewModal(false);
    } catch (err) {
      showToast('Synchronization failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'in progress': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Evaluation Cores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Toast HUD */}
      {toast && (
        <div className={`fixed top-24 right-8 z-[100] animate-slide-left p-4 rounded-2xl shadow-2xl border flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <p className="text-sm font-bold uppercase tracking-wider">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
             <Calendar size={32} className="text-blue-600" />
             Evaluation Matrix
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Deploying and controlling neural evaluation sessions for alpha talent.</p>
        </div>
        
        <button 
          onClick={() => { setSelectedInterview(null); setShowInterviewModal(true); }}
          className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 hover:shadow-2xl transition-all font-black uppercase text-[10px] tracking-widest active:scale-95 group"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform" />
          Provision New Session
        </button>
      </div>

      {/* Interviews Grid */}
      {interviews.length === 0 ? (
        <div className="text-center py-32 bg-white/40 rounded-[3rem] border-2 border-dashed border-slate-100">
          <Calendar className="text-slate-200 w-20 h-20 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Cycle Empty</h3>
          <p className="text-slate-400 max-w-xs mx-auto text-sm">Synchronize your first evaluation session with candidate vectors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {interviews.map((interview) => (
            <div key={interview._id} className="group glass-card p-8 rounded-[2.5rem] hover-lift border-white/50 relative overflow-hidden flex flex-col justify-between min-h-[450px]">
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded tracking-widest">{interview.type} PROTOCAL</span>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight transition-colors">{interview.candidate}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{interview.role}</p>
                   </div>
                   <div className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${getStatusColor(interview.status)}`}>
                      {interview.status}
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Clock3 size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">{new Date(interview.date).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{interview.time} ({interview.duration} MIN)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Users size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">{interview.interviewer}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">CONTROLLER</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      {interview.location.includes('Virtual') ? <Video size={18} className="text-blue-600" /> : <MapPin size={18} className="text-blue-600" />}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 truncate max-w-[150px]">{interview.location}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">COORDS</p>
                    </div>
                  </div>
                </div>

                {interview.notes && (
                  <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 italic text-[11px] text-slate-500 leading-relaxed font-medium">
                     "{interview.notes}"
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-8 relative z-10">
                {interview.status === 'Scheduled' && (
                  <button 
                    onClick={() => handleStatusUpdate(interview._id, 'In Progress')}
                    className="flex-1 p-3.5 bg-blue-600 text-white rounded-[1.2rem] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <Play size={14} className="fill-white group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Execute</span>
                  </button>
                )}
                {interview.status === 'In Progress' && (
                  <button 
                    onClick={() => handleStatusUpdate(interview._id, 'Completed')}
                    className="flex-1 p-3.5 bg-emerald-600 text-white rounded-[1.2rem] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Finalize</span>
                  </button>
                )}
                
                <button 
                   onClick={() => { setSelectedInterview(interview); setShowInterviewModal(true); }}
                   className="p-3.5 bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white rounded-[1.2rem] transition-all"
                >
                  <Edit3 size={16} />
                </button>
                
                <button 
                  onClick={() => handleDeleteInterview(interview._id)}
                  className="p-3.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-[1.2rem] transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Decorative Vector */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 rotate-12 pointer-events-none group-hover:opacity-[0.07] transition-opacity">
                <Zap size={200} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal HUD */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => !submitting && setShowInterviewModal(false)}></div>
           
           <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar relative z-10 animate-slide-up shadow-2xl">
              <div className="p-8 md:p-10 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-xl z-20">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                       {selectedInterview ? 'Resync Evaluation' : 'Provision Session'}
                    </h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Evaluation Blueprint</p>
                 </div>
                 <button onClick={() => setShowInterviewModal(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all text-slate-400">
                    <X size={24} />
                 </button>
              </div>

              <InterviewForm 
                interview={selectedInterview} 
                onSubmit={handleSubmitInterview}
                submitting={submitting}
              />
           </div>
        </div>
      )}
    </div>
  );
};

const InterviewForm = ({ interview, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    candidate: interview?.candidate || '',
    role: interview?.role || '',
    date: interview?.date ? interview.date.split('T')[0] : '',
    time: interview?.time || '',
    type: interview?.type || 'Technical',
    interviewer: interview?.interviewer || '',
    location: interview?.location || '',
    duration: interview?.duration || '60',
    notes: interview?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Target Candidate</label>
          <input
            type="text"
            value={formData.candidate}
            onChange={(e) => setFormData({...formData, candidate: e.target.value})}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
            placeholder="Candidate Sigma ID"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Structural Role</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
            placeholder="Vector Designation"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Sync Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Neural Time</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Evaluation Protocol</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
          >
            {['Technical', 'HR Round', 'Managerial', 'Final'].map(t => (
              <option key={t} value={t}>{t} Protocol</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Cycle Duration</label>
           <div className="grid grid-cols-4 gap-2">
              {[30, 45, 60, 90].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFormData({...formData, duration: m.toString()})}
                  className={`py-4 rounded-xl border text-[10px] font-black uppercase transition-all ${
                    formData.duration === m.toString() ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {m}M
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Session Controller</label>
        <input
          type="text"
          value={formData.interviewer}
          onChange={(e) => setFormData({...formData, interviewer: e.target.value})}
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
          placeholder="Controller Identity"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Neural Link (Location)</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
          placeholder="Virtual Link / Briefing Room X"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Manifest Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-6 text-sm font-medium text-slate-700 h-32 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
          placeholder="Additional telemetry for the session..."
        />
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-slate-900 text-white py-5 rounded-[1.8rem] font-black uppercase text-xs tracking-widest hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
        >
          {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : (
            <>
               Sync Session
               <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InterviewScheduling;
