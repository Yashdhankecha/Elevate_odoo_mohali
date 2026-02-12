import React, { useState } from 'react';
import { 
  Users, 
  Filter, 
  Search, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Calendar,
  Download,
  MoreVertical,
  ChevronRight,
  UserCheck,
  Zap,
  Star,
  Layers,
  FileText
} from 'lucide-react';

const ApplicationsTracking = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplications, setSelectedApplications] = useState([]);

  const applications = [
    {
      id: 1,
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 9876543210',
      role: 'Software Engineer',
      department: 'CSE',
      cgpa: '8.9',
      status: 'Shortlisted',
      appliedDate: '2024-11-15',
      skills: ['React', 'Node.js', 'JavaScript', 'Git'],
      experience: '1 year',
      location: 'Bangalore, India',
      resume: 'priya_sharma_resume.pdf'
    },
    {
      id: 2,
      name: 'Arjun Patel',
      email: 'arjun.patel@email.com',
      phone: '+91 9876543211',
      role: 'Data Analyst',
      department: 'IT',
      cgpa: '8.7',
      status: 'Interview',
      appliedDate: '2024-11-14',
      skills: ['Python', 'SQL', 'Tableau', 'Statistics'],
      experience: '2 years',
      location: 'Mumbai, India',
      resume: 'arjun_patel_resume.pdf'
    },
    {
      id: 3,
      name: 'Kavya Reddy',
      email: 'kavya.reddy@email.com',
      phone: '+91 9876543212',
      role: 'Product Manager',
      department: 'ECE',
      cgpa: '9.1',
      status: 'Applied',
      appliedDate: '2024-11-13',
      skills: ['Analytics', 'Communication', 'Leadership'],
      experience: '3 years',
      location: 'Delhi, India',
      resume: 'kavya_reddy_resume.pdf'
    },
    {
      id: 4,
      name: 'Rahul Kumar',
      email: 'rahul.kumar@email.com',
      phone: '+91 9876543213',
      role: 'Frontend Developer',
      department: 'CSE',
      cgpa: '8.5',
      status: 'Rejected',
      appliedDate: '2024-11-12',
      skills: ['React', 'TypeScript', 'CSS', 'UI/UX'],
      experience: '1.5 years',
      location: 'Hyderabad, India',
      resume: 'rahul_kumar_resume.pdf'
    },
    {
      id: 5,
      name: 'Anjali Singh',
      email: 'anjali.singh@email.com',
      phone: '+91 9876543214',
      role: 'Backend Developer',
      department: 'CSE',
      cgpa: '8.8',
      status: 'Shortlisted',
      appliedDate: '2024-11-11',
      skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
      experience: '2.5 years',
      location: 'Pune, India',
      resume: 'anjali_singh_resume.pdf'
    }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
  };

  const handleSelectApplication = (id) => {
    if (selectedApplications.includes(id)) {
      setSelectedApplications(selectedApplications.filter(appId => appId !== id));
    } else {
      setSelectedApplications([...selectedApplications, id]);
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'shortlisted':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'interview':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'applied':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'rejected':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
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
          <p className="text-slate-500 font-medium tracking-tight">Real-time tracking and evaluation of incoming global talent assets.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
            <Download size={18} />
            Export Manifest
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
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter By</span>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-slate-900 focus:ring-0 cursor-pointer"
            >
              <option value="all">Global Status</option>
              <option value="applied">New Applied</option>
              <option value="shortlisted">Alpha Candidates</option>
              <option value="interview">Eval Sessions</option>
              <option value="rejected">Rejected Vectors</option>
            </select>

            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-900 hover:text-white transition-all">
               Advanced Evaluation
            </button>
         </div>

         <div className="relative group flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Query candidate name, ID or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner"
            />
         </div>
      </div>

      {/* Applications Data Matrix */}
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
                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate Intel</th>
                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Position Vector</th>
                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Academia Score</th>
                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline Status</th>
                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Logs</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-sans">
              {filteredApplications.map((app) => (
                <tr key={app.id} className={`group hover:bg-slate-50/50 transition-all ${selectedApplications.includes(app.id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-8 py-6">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(app.id)}
                      onChange={() => handleSelectApplication(app.id)}
                      className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                        <span className="text-sm font-black text-slate-900">{app.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none mb-1">{app.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{app.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                       <p className="text-xs font-black text-slate-800 tracking-tight">{app.role}</p>
                       <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded inline-block">{app.department}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                       <div className="text-sm font-black text-slate-900">{app.cgpa}</div>
                       <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${parseFloat(app.cgpa) > 8.5 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${parseFloat(app.cgpa) * 10}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-900">{new Date(app.appliedDate).toLocaleDateString()}</p>
                       <p className="text-[10px] text-slate-400 font-medium">T-Minus Protocol</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button className="p-2.5 bg-white text-slate-400 hover:text-blue-600 rounded-xl shadow-sm border border-slate-100 hover:border-blue-100 transition-all">
                        <Eye size={14} />
                      </button>
                      <button className="p-2.5 bg-white text-slate-400 hover:text-emerald-600 rounded-xl shadow-sm border border-slate-100 hover:border-emerald-100 transition-all">
                        <CheckCircle2 size={14} />
                      </button>
                      <button className="p-2.5 bg-white text-slate-400 hover:text-rose-600 rounded-xl shadow-sm border border-slate-100 hover:border-rose-100 transition-all">
                        <XCircle size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Actions HUD */}
      {selectedApplications.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] w-full max-w-2xl px-4 animate-slide-up">
           <div className="bg-slate-900 border border-white/10 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white ring-4 ring-indigo-500/20">
                    <Layers size={18} />
                 </div>
                 <div>
                    <p className="text-white font-black text-sm tracking-tight">{selectedApplications.length} Assets Selected</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Ready for Bulk Ops</p>
                 </div>
              </div>
              
              <div className="flex gap-2">
                 <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95">Shortlist</button>
                 <button className="px-6 py-3 bg-rose-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95">Reject</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTracking;
