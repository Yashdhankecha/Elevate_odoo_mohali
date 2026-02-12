import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Mail,
  Building2,
  Calendar,
  User,
  GraduationCap,
  Zap,
  MoreVertical,
  ChevronRight,
  ShieldAlert,
  Archive,
  Loader2,
  Lock,
  Unlock,
  Clock
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

const TPOApproval = ({ onApprovalProcessed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [pendingTPOs, setPendingTPOs] = useState([]);
  const [processingApproval, setProcessingApproval] = useState(false);
  const [selectedTPOs, setSelectedTPOs] = useState([]);

  useEffect(() => {
    fetchPendingTPOs();
  }, []);

  const fetchPendingTPOs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/pending-registrations');
      setPendingTPOs(response.data.pendingUsers.filter(user => user.role === 'tpo'));
    } catch (err) {
      toast.error('Failed to load TPO requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (tpoId, action) => {
    try {
      setProcessingApproval(true);
      await api.post(`/admin/${action}-user/${tpoId}`);
      toast.success(`TPO ${action === 'approve' ? 'Approved' : 'Rejected'}`);
      fetchPendingTPOs();
      if (onApprovalProcessed) onApprovalProcessed();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setProcessingApproval(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedTPOs.length === 0) return;
    try {
      setProcessingApproval(true);
      await Promise.all(selectedTPOs.map(id => api.post(`/admin/${action}-user/${id}`)));
      toast.success(`${selectedTPOs.length} requests ${action === 'approve' ? 'approved' : 'rejected'}`);
      setSelectedTPOs([]);
      fetchPendingTPOs();
      if (onApprovalProcessed) onApprovalProcessed();
    } catch (error) {
      toast.error('Bulk operation failed');
    } finally {
      setProcessingApproval(false);
    }
  };

  const filteredTPOs = pendingTPOs.filter(tpo => 
    tpo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tpo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tpo.instituteName && tpo.instituteName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="animate-spin w-12 h-12 text-blue-600 mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading requests...</p>
     </div>
  );

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
             <ShieldAlert size={32} className="text-blue-600" />
             TPO Approvals
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Approve or reject TPO registration requests. Only verified TPOs can manage placements.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="px-6 py-2.5 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 shadow-xl shadow-slate-200">
              <Lock size={16} className="text-blue-600" />
              <span className="text-[11px] font-bold uppercase tracking-widest">{pendingTPOs.length} Pending Requests</span>
           </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="glass-card rounded-[3rem] p-6 border-white/50 shadow-2xl shadow-slate-200/40">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
           <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by name or college..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
              />
           </div>

           {selectedTPOs.length > 0 && (
              <div className="flex items-center gap-3 animate-fade-in w-full lg:w-auto">
                 <button onClick={() => handleBulkAction('approve')} className="flex-1 lg:flex-none px-8 py-4 bg-emerald-600 text-white rounded-3xl font-bold uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95">Approve Selected</button>
                 <button onClick={() => handleBulkAction('reject')} className="flex-1 lg:flex-none px-8 py-4 bg-rose-600 text-white rounded-3xl font-bold uppercase text-[10px] tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20 active:scale-95">Reject Selected</button>
                 <button onClick={() => setSelectedTPOs([])} className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all"><XCircle size={18} /></button>
              </div>
           )}
        </div>
      </div>

      {/* Request Cards */}
      <div className="space-y-6">
         {filteredTPOs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {filteredTPOs.map((tpo) => (
                  <div key={tpo.id} className="group glass-card p-10 rounded-[3.5rem] border-white/50 hover-lift relative overflow-hidden flex flex-col justify-between">
                     <div className="relative z-10 flex gap-8">
                        <div className="relative">
                           <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden flex-shrink-0 shadow-2xl group-hover:scale-110 transition-transform">
                              <User className="text-white/40 absolute" size={50} />
                              <span className="text-white font-black text-2xl relative">{tpo.name[0]}</span>
                           </div>
                           <input 
                             type="checkbox" 
                             checked={selectedTPOs.includes(tpo.id)}
                             onChange={() => setSelectedTPOs(prev => prev.includes(tpo.id) ? prev.filter(id => id !== tpo.id) : [...prev, tpo.id])}
                             className="absolute -top-2 -left-2 w-8 h-8 rounded-xl border-4 border-white bg-slate-100 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer appearance-none shadow-lg" 
                           />
                        </div>
                        <div className="flex-1 space-y-3">
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-amber-100 flex items-center gap-1">
                                    <Clock size={10} /> Pending Review
                                 </span>
                              </div>
                              <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight">{tpo.name}</h3>
                              <p className="text-slate-400 text-sm font-semibold">{tpo.email}</p>
                           </div>
                        </div>
                     </div>

                     <div className="mt-10 grid grid-cols-2 gap-5 relative z-10">
                        <div className="p-6 bg-slate-50/70 backdrop-blur-sm rounded-[2rem] border border-slate-100 group-hover:bg-white transition-colors">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                              <Building2 size={12} /> College / Institute
                           </p>
                           <p className="text-sm font-bold text-slate-900 truncate">{tpo.instituteName || 'Not Provided'}</p>
                        </div>
                        <div className="p-6 bg-slate-50/70 backdrop-blur-sm rounded-[2rem] border border-slate-100 group-hover:bg-white transition-colors">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                              <GraduationCap size={12} /> Account Role
                           </p>
                           <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter">{tpo.role}</p>
                        </div>
                     </div>

                     <div className="mt-10 pt-10 border-t border-slate-50 flex justify-between items-center relative z-10">
                        <div className="flex gap-3">
                           <button 
                             onClick={() => handleAction(tpo.id, 'approve')}
                             disabled={processingApproval}
                             className="px-8 py-4 bg-slate-900 text-white rounded-[1.8rem] font-bold uppercase text-[11px] tracking-widest hover:bg-emerald-600 transition-all shadow-2xl active:scale-95 flex items-center gap-2"
                           >
                              <Unlock size={14} /> Approve TPO
                           </button>
                           <button 
                             onClick={() => handleAction(tpo.id, 'reject')}
                             disabled={processingApproval}
                             className="px-8 py-4 bg-slate-100 text-slate-900 rounded-[1.8rem] font-bold uppercase text-[11px] tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95 flex items-center gap-2"
                           >
                              <XCircle size={14} /> Reject
                           </button>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sign Up Date</p>
                           <p className="text-[11px] font-bold text-slate-500">{new Date(tpo.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="py-20 text-center">
               <div className="w-24 h-24 bg-white rounded-[3rem] border border-slate-100 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-slate-100">
                  <Unlock size={40} className="text-slate-200" />
               </div>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-xs">No pending TPO requests</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default TPOApproval;
