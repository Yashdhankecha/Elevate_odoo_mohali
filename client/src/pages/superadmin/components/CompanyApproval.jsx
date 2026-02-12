import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Mail,
  Calendar,
  Zap,
  MoreVertical,
  ChevronRight,
  ShieldAlert,
  Factory,
  Loader2,
  Lock,
  Unlock,
  Eye,
  Globe,
  ArrowUpRight,
  RefreshCw
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

const CompanyApproval = ({ onApprovalProcessed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companyRequests, setCompanyRequests] = useState([]);
  const [processingApproval, setProcessingApproval] = useState(false);

  useEffect(() => {
    fetchCompanyRequests();
  }, []);

  const fetchCompanyRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/pending-registrations');
      setCompanyRequests(response.data.pendingUsers.filter(user => user.role === 'company'));
    } catch (err) {
      toast.error('Failed to load company requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (companyId, action) => {
    try {
      setProcessingApproval(true);
      await api.post(`/admin/${action}-user/${companyId}`);
      toast.success(`Company ${action === 'approve' ? 'Approved' : 'Rejected'}`);
      fetchCompanyRequests();
      setShowModal(false);
      if (onApprovalProcessed) onApprovalProcessed();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setProcessingApproval(false);
    }
  };

  const filteredCompanies = companyRequests.filter(company => 
    (company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (company.instituteName && company.instituteName.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    company.status === 'pending'
  );

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="animate-spin w-12 h-12 text-blue-600 mb-4" />
        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-widest">Loading company requests...</p>
     </div>
  );

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
             <Building2 size={32} className="text-blue-600" />
             Company Approvals
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Review and approve new company registrations on the platform.</p>
        </div>
        
        <div className="flex gap-3">
           <div className="px-6 py-2.5 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 shadow-sm">
              <Lock size={16} className="text-blue-600" />
              <span className="text-[11px] font-bold uppercase tracking-widest">{companyRequests.length} Pending Requests</span>
           </div>
           <button onClick={fetchCompanyRequests} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-blue-600 transition-all">
              <RefreshCw size={18} />
           </button>
        </div>
      </div>

      {/* Search Panel */}
      <div className="glass-card rounded-[3rem] p-6 border-white/50 shadow-2xl shadow-slate-200/40">
        <div className="relative">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
           <input 
             type="text" 
             placeholder="Search by company name or email..." 
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
             className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all shadow-inner"
           />
        </div>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         {filteredCompanies.length > 0 ? filteredCompanies.map((company) => (
            <div key={company.id} className="group glass-card p-10 rounded-[3.5rem] border-white/50 hover-lift relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                  <Factory size={120} className="text-blue-900" />
               </div>

               <div className="relative z-10 flex gap-8">
                  <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden flex-shrink-0 shadow-2xl group-hover:scale-110 transition-transform">
                     <Building2 className="text-white/40 absolute" size={50} />
                     <span className="text-white font-black text-2xl relative">{company.name[0]}</span>
                  </div>
                  <div className="flex-1 space-y-3">
                     <div>
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-amber-100">
                           Pending Review
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight mt-2">{company.name}</h3>
                        <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mt-1">New Company Registration</p>
                     </div>
                  </div>
               </div>

               <div className="mt-10 grid grid-cols-2 gap-5 relative z-10">
                  <div className="p-6 bg-slate-50/70 backdrop-blur-sm rounded-[2rem] border border-slate-100 hover:bg-white transition-colors">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <Mail size={12} /> Email Address
                     </p>
                     <p className="text-sm font-bold text-slate-900 truncate">{company.email}</p>
                  </div>
                  <div className="p-6 bg-slate-50/70 backdrop-blur-sm rounded-[2rem] border border-slate-100 hover:bg-white transition-colors">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <Calendar size={12} /> Registration Date
                     </p>
                     <p className="text-sm font-bold text-slate-900">{new Date(company.createdAt).toLocaleDateString()}</p>
                  </div>
               </div>

               <div className="mt-10 pt-10 border-t border-slate-50 flex justify-between items-center relative z-10">
                  <button 
                    onClick={() => {setSelectedCompany(company); setShowModal(true);}}
                    className="px-8 py-4 bg-slate-100 text-slate-900 rounded-[1.8rem] font-bold uppercase text-[11px] tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95 flex items-center gap-2 group/btn"
                  >
                     View Details <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex gap-2">
                     <button onClick={() => handleAction(company.id, 'approve')} className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-90" title="Approve">
                        <CheckCircle2 size={20} />
                     </button>
                     <button onClick={() => handleAction(company.id, 'reject')} className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20 active:scale-90" title="Reject">
                        <XCircle size={20} />
                     </button>
                  </div>
               </div>
            </div>
         )) : (
            <div className="xl:col-span-2 py-40 text-center">
               <div className="w-24 h-24 bg-white rounded-[3rem] border border-slate-100 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-slate-100">
                  <Zap size={40} className="text-slate-200" />
               </div>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No pending company requests</p>
            </div>
         )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedCompany && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl animate-fade-in" onClick={() => setShowModal(false)} />
            <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl relative z-10 overflow-hidden animate-zoom-in">
               <div className="bg-blue-600 p-12 text-white relative">
                  <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
                     <XCircle size={24} />
                  </button>
                  <div className="flex gap-8 items-center">
                     <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] flex items-center justify-center backdrop-blur-xl border border-white/20">
                        <Building2 size={40} />
                     </div>
                     <div>
                        <h2 className="text-4xl font-black tracking-tighter leading-none">{selectedCompany.name}</h2>
                        <p className="text-blue-100 font-bold uppercase tracking-widest mt-3 text-xs">Pending Approval</p>
                     </div>
                  </div>
               </div>

               <div className="p-12 space-y-12">
                  <div className="grid md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Globe size={12} /> Company Information
                        </p>
                        <div className="space-y-6">
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                              <p className="font-bold text-slate-900 text-lg tracking-tight">{selectedCompany.email}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Account Type</p>
                              <p className="font-bold text-blue-600 text-lg tracking-tight uppercase">{selectedCompany.role}</p>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <ShieldAlert size={12} /> Important Note
                        </p>
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                           <p className="text-sm font-bold text-slate-600 leading-relaxed text-xs">
                              Please verify the company's identity and details before granting access to our platform's marketplace.
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                     <button 
                       onClick={() => handleAction(selectedCompany.id, 'approve')}
                       disabled={processingApproval}
                       className="flex-1 py-5 bg-emerald-600 text-white rounded-[2rem] font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                     >
                        <Unlock size={18} /> Approve Company
                     </button>
                     <button 
                        onClick={() => handleAction(selectedCompany.id, 'reject')}
                        disabled={processingApproval}
                        className="flex-1 py-5 bg-slate-100 text-slate-900 rounded-[2rem] font-bold uppercase text-[11px] tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2"
                     >
                        <Lock size={18} /> Reject Company
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default CompanyApproval;
