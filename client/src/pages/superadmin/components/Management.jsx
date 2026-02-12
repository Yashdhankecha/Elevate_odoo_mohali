import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Search, 
  Filter, 
  Eye, 
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Factory,
  Globe,
  Calendar,
  Layers,
  ArrowUpRight,
  MoreVertical,
  Briefcase,
  ChevronRight,
  Zap,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Management = () => {
  const [activeTab, setActiveTab] = useState('tpos');
  const [tpos, setTpos] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tposResponse, companiesResponse] = await Promise.all([
        api.get('/superadmin/registered-tpos'),
        api.get('/superadmin/registered-companies')
      ]);
      setTpos(tposResponse.data || []);
      setCompanies(companiesResponse.data || []);
    } catch (error) {
      toast.error('Failed to load registered users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus, type) => {
    try {
      await api.put(`/superadmin/update-status/${id}`, { status: newStatus, type: type });
      if (type === 'tpo') {
        setTpos(prev => prev.map(tpo => tpo._id === id ? { ...tpo, status: newStatus } : tpo));
      } else {
        setCompanies(prev => prev.map(company => company._id === id ? { ...company, status: newStatus } : company));
      }
      toast.success(`User ${newStatus === 'active' ? 'Activated' : 'Restricted'}`);
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const filteredTpos = tpos.filter(tpo => {
    const matchesSearch = (tpo.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tpo.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tpo.instituteName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tpo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = (company.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (company.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (company.industry || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentData = activeTab === 'tpos' ? filteredTpos : filteredCompanies;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <Loader2 className="animate-spin w-12 h-12 text-blue-600 mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading user list...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
             <Layers size={32} className="text-blue-600" />
             User Management
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage all registered TPO and Company accounts on the platform.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="text-right px-6 border-r border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TPO Accounts</p>
              <p className="text-xl font-black text-slate-900">{tpos.length}</p>
           </div>
           <div className="text-right px-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Companies</p>
              <p className="text-xl font-black text-slate-900">{companies.length}</p>
           </div>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="glass-card rounded-[3rem] p-6 border-white/50 shadow-2xl shadow-slate-200/40">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
           <div className="flex bg-slate-100/50 p-1.5 rounded-[1.5rem] w-full lg:w-auto">
              <button 
                onClick={() => setActiveTab('tpos')}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'tpos' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ShieldCheck size={16} /> TPO Accounts
              </button>
              <button 
                onClick={() => setActiveTab('companies')}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'companies' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Building2 size={16} /> Company Accounts
              </button>
           </div>

           <div className="flex flex-col md:flex-row gap-4 w-full lg:w-3/5">
              <div className="relative flex-1">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                   type="text" 
                   placeholder={`Search ${activeTab === 'tpos' ? 'TPOs' : 'Companies'}...`} 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                 />
              </div>
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-[10px] font-bold text-slate-900 uppercase tracking-widest focus:outline-none appearance-none cursor-pointer pr-12 min-w-[160px]"
              >
                 <option value="all">Registration Status</option>
                 <option value="active">Active</option>
                 <option value="pending">Pending</option>
                 <option value="rejected">Rejected</option>
              </select>
           </div>
        </div>
      </div>

      {/* Registry Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         {currentData.length > 0 ? currentData.map((item) => (
            <div key={item._id} className="group glass-card p-8 rounded-[3rem] border-white/50 hover-lift relative overflow-hidden flex flex-col justify-between">
               <div className="relative z-10 flex gap-6">
                  <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center relative overflow-hidden flex-shrink-0 shadow-2xl group-hover:scale-110 transition-transform">
                     {activeTab === 'tpos' ? <ShieldCheck className="text-white border-2 border-white/20 p-4 rounded-full" size={60} /> : <Building2 className="text-white border-2 border-white/20 p-4 rounded-full" size={60} />}
                  </div>
                  <div className="flex-1 space-y-2">
                     <div className="flex justify-between items-start">
                        <div>
                           <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{activeTab === 'tpos' ? item.name : item.companyName}</h3>
                        </div>
                        <span className={`px-4 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-widest ${statusStyle(item.status)}`}>
                           {item.status}
                        </span>
                     </div>
                     <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-1.5 border border-slate-100">
                           <Mail size={12} className="text-slate-400" /> {item.email}
                        </span>
                        <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-1.5 border border-slate-100">
                           <Phone size={12} className="text-slate-400" /> {item.contactNumber || 'No Phone'}
                        </span>
                     </div>
                  </div>
               </div>

               <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                  <div className="p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{activeTab === 'tpos' ? 'College' : 'Industry'}</p>
                     <p className="text-sm font-bold text-slate-900 truncate">{activeTab === 'tpos' ? item.instituteName : item.industry}</p>
                  </div>
                  <div className="p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Joined On</p>
                     <p className="text-sm font-bold text-slate-900">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center relative z-10">
                  <div className="flex gap-2">
                     {item.status === 'pending' && (
                        <>
                           <button 
                             onClick={() => handleStatusChange(item._id, 'active', activeTab.slice(0, -1))}
                             className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10 active:scale-95 flex items-center gap-2"
                           >
                              <CheckCircle2 size={14} /> Approve User
                           </button>
                           <button 
                             onClick={() => handleStatusChange(item._id, 'rejected', activeTab.slice(0, -1))}
                             className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95 flex items-center gap-2"
                           >
                              <XCircle size={14} /> Reject Access
                           </button>
                        </>
                     )}
                     {item.status !== 'pending' && (
                        <button 
                          onClick={() => {setSelectedItem(item); setShowModal(true);}}
                          className="px-8 py-3 bg-slate-100 text-slate-800 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2 group/btn"
                        >
                           View Details
                           <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                     )}
                  </div>
                  
                  <button className="p-3 text-slate-300 hover:text-rose-500 transition-all">
                     <Trash2 size={20} />
                  </button>
               </div>
            </div>
         )) : (
            <div className="xl:col-span-2 py-40 text-center">
               <div className="w-24 h-24 bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Zap size={40} className="text-slate-200" />
               </div>
               <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">No users found</p>
            </div>
         )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedItem && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl animate-fade-in" onClick={() => setShowModal(false)} />
            <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl relative z-10 overflow-hidden animate-zoom-in">
               <div className="bg-slate-900 p-12 text-white relative">
                  <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
                     <XCircle size={24} />
                  </button>
                  <div className="flex gap-8 items-center">
                     <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl">
                        {activeTab === 'tpos' ? <ShieldCheck size={40} /> : <Building2 size={40} />}
                     </div>
                     <div>
                        <div className="flex items-center gap-3">
                           <h2 className="text-4xl font-black tracking-tighter">{activeTab === 'tpos' ? selectedItem.name : selectedItem.companyName}</h2>
                           <span className={`px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${statusStyle(selectedItem.status)} bg-white/10 border-white/20`}>
                              {selectedItem.status}
                           </span>
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest mt-2 text-[10px]">Registered Account Information</p>
                     </div>
                  </div>
               </div>

               <div className="p-12 overflow-y-auto max-h-[60vh] custom-scrollbar grid md:grid-cols-2 gap-12">
                  <div className="space-y-10">
                     <div className="space-y-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <User size={12} /> Contact Details
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Name</p>
                              <p className="font-bold text-slate-900 text-lg tracking-tight">{activeTab === 'tpos' ? selectedItem.name : selectedItem.companyName}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Phone</p>
                              <p className="font-bold text-slate-900 text-lg tracking-tight">{selectedItem.contactNumber || 'Not Provided'}</p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <MapPin size={12} /> Address / Location
                        </p>
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                           <p className="text-sm font-bold text-slate-600 leading-relaxed text-xs">
                              {selectedItem.address ? Object.values(selectedItem.address).filter(Boolean).join(', ') : 'No address registered'}
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-10">
                     <div className="space-y-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Factory size={12} /> Account Profile
                        </p>
                        <div className="space-y-6">
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">{activeTab === 'tpos' ? 'College Name' : 'Industry'}</p>
                              <p className="font-bold text-slate-900 text-lg tracking-tight">{activeTab === 'tpos' ? selectedItem.instituteName : selectedItem.industry}</p>
                           </div>
                           {activeTab === 'companies' && (
                              <div className="flex gap-8">
                                 <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Website</p>
                                    <a href={selectedItem.website} className="font-bold text-blue-600 text-lg tracking-tight hover:underline flex items-center gap-1">
                                       Visit <Globe size={16} />
                                    </a>
                                 </div>
                                 <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Size</p>
                                    <p className="font-bold text-slate-900 text-lg tracking-tight uppercase">{selectedItem.companySize || 'N/A'}</p>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex justify-between items-center group/btn shadow-2xl shadow-slate-200">
                        <div>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status Action</p>
                           <p className="text-lg font-bold tracking-tight">{selectedItem.status === 'active' ? 'Active User' : 'Pending Review'}</p>
                        </div>
                        {selectedItem.status === 'pending' ? (
                           <div className="flex gap-2">
                              <button onClick={() => {handleStatusChange(selectedItem._id, 'active', activeTab.slice(0, -1)); setShowModal(false);}} className="p-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all">
                                 <CheckCircle2 size={24} />
                              </button>
                           </div>
                        ) : (
                           <div className="p-3 bg-white/10 rounded-2xl">
                              <ShieldCheck className="text-emerald-400" size={24} />
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Management;
