import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  CheckCircle2,
  XCircle,
  Clock,
  GraduationCap,
  Users,
  X,
  Mail,
  Phone,
  Briefcase,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Filter,
  Search,
  Check,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
  Loader2,
  Target,
  Award,
  Building2,
  Calendar
} from 'lucide-react';
import tpoApi from '../../../services/tpoApi';

const StudentApprovalSystem = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingStudentId, setRejectingStudentId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await tpoApi.getStudents();
      setStudents(response.students || []);
    } catch (err) {
      setError('Failed to load student data.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStudent = async (studentId) => {
    try {
      setActionLoading(studentId);
      await tpoApi.approveStudent(studentId);
      setStudents(prev => prev.map(s => s._id === studentId ? { ...s, verificationStatus: 'verified' } : s));
      if (selectedStudent && selectedStudent._id === studentId) {
        setSelectedStudent(prev => ({ ...prev, verificationStatus: 'verified' }));
      }
    } catch (error) {
      alert('Failed to approve student.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectStudent = async () => {
    if (!rejectReason.trim()) return;
    try {
      setActionLoading(rejectingStudentId);
      await tpoApi.rejectStudent(rejectingStudentId, rejectReason);
      setStudents(prev => prev.map(s => s._id === rejectingStudentId ? { ...s, verificationStatus: 'rejected', verificationNotes: rejectReason } : s));
      if (selectedStudent && selectedStudent._id === rejectingStudentId) {
        setSelectedStudent(prev => ({ ...prev, verificationStatus: 'rejected', verificationNotes: rejectReason }));
      }
      setShowRejectModal(false);
    } catch (error) {
      alert('Failed to reject student.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStudentStatus = (student) => student.verificationStatus || 'pending';

  const getStatusStyle = (status) => {
    switch (status) {
      case 'verified': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredStudents = students.filter(student => {
    const status = getStudentStatus(student);
    const matchesTab = activeTab === 'all' || status === activeTab;
    const matchesSearch = !searchQuery || 
      (student.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.rollNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: students.length,
    pending: students.filter(s => getStudentStatus(s) === 'pending').length,
    approved: students.filter(s => getStudentStatus(s) === 'verified').length,
    rejected: students.filter(s => getStudentStatus(s) === 'rejected').length
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Student Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
             <ShieldCheck size={32} className="text-indigo-600" />
             Student Verification
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Review and verify student profile credentials for placements.</p>
        </div>
      </div>

      {/* Stats Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Students', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'Verified', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
         ].map((stat, i) => (
           <div key={i} className="glass-card p-6 rounded-[2rem] border-white/50 hover-lift flex items-center justify-between">
              <div>
                 <p className="text-[11px] font-bold uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                 <stat.icon size={20} />
              </div>
           </div>
         ))}
      </div>

      {/* Filter Options */}
      <div className="glass-card rounded-[2.5rem] p-4 flex flex-col xl:flex-row items-center justify-between gap-6 border-white/50">
         <div className="flex flex-wrap items-center gap-2 pl-4">
            {[
              { key: 'all', label: 'All Students' },
              { key: 'pending', label: 'Pending' },
              { key: 'verified', label: 'Verified' },
              { key: 'rejected', label: 'Rejected' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab.key ? 'bg-indigo-600 text-white shadow-xl' : 'bg-transparent text-slate-400 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
         </div>

         <div className="relative group flex-1 max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search by name, roll no or branch..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner"
            />
         </div>
      </div>

      {/* Student List */}
      <div className="glass-card rounded-[2.5rem] border-white/50 overflow-hidden shadow-2xl shadow-slate-200/50">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Student Information</th>
                <th className="px-6 py-6 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Branch</th>
                <th className="px-6 py-6 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">CGPA</th>
                <th className="px-6 py-6 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => (
                <tr key={student._id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                          <span className="text-sm font-bold text-slate-900">{(student.name || 'S')[0]}</span>
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">{student.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{student.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg font-bold uppercase tracking-tight text-[10px]">
                       {student.branch || 'GENERAL'}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                       <span className="text-sm font-bold text-slate-900">{student.cgpa || '0.0'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-widest ${getStatusStyle(getStudentStatus(student))}`}>
                      {getStudentStatus(student)}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => { setSelectedStudent(student); setShowStudentModal(true); }} className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-100 transition-all">
                          <Eye size={14} />
                       </button>
                       {getStudentStatus(student) === 'pending' && (
                         <>
                           <button onClick={() => handleApproveStudent(student._id)} className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-110 transition-all">
                              <ThumbsUp size={14} />
                           </button>
                           <button onClick={() => { setRejectingStudentId(student._id); setShowRejectModal(true); }} className="p-2.5 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/20 hover:scale-110 transition-all">
                              <ThumbsDown size={14} />
                           </button>
                         </>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowStudentModal(false)}></div>
           <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar relative z-10 animate-slide-up shadow-2xl">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-xl z-20">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Student Details</h2>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">Full profile information</p>
                 </div>
                 <button onClick={() => setShowStudentModal(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all text-slate-400">
                    <X size={24} />
                 </button>
              </div>

              <div className="p-10 space-y-10">
                 <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                       <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-2xl">
                          {(selectedStudent.name || 'S')[0]}
                       </div>
                       <div className="text-center md:text-left">
                          <h3 className="text-3xl font-black tracking-tighter mb-1">{selectedStudent.name}</h3>
                          <p className="text-indigo-400 font-bold uppercase tracking-widest text-[11px]">{selectedStudent.rollNumber} • {selectedStudent.branch}</p>
                          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                             <span className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-[10px] font-bold lowercase tracking-wider">
                                {selectedStudent.email}
                             </span>
                             <span className={`px-4 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(getStudentStatus(selectedStudent))}`}>
                                {getStudentStatus(selectedStudent)}
                             </span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                          <GraduationCap size={14} className="text-indigo-600" /> Academic Information
                       </h4>
                       <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: 'Current CGPA', value: selectedStudent.cgpa || '0.0', icon: Target },
                            { label: 'Current Year', value: selectedStudent.year || 'N/A', icon: Calendar },
                            { label: 'College Name', value: selectedStudent.collegeName || 'N/A', icon: Building2 },
                            { label: 'Branch', value: selectedStudent.branch || 'N/A', icon: Briefcase },
                          ].map((item, i) => (
                            <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                               <div className="flex items-center gap-3 mb-2">
                                  <item.icon size={16} className="text-slate-400" />
                                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{item.label}</span>
                               </div>
                               <p className="text-sm font-bold text-slate-900">{item.value}</p>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                          <Zap size={14} className="text-indigo-600" /> Key Skills
                       </h4>
                       <div className="flex flex-wrap gap-2">
                          {(selectedStudent.skills || []).map((skill, i) => (
                             <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest">
                                {skill}
                             </span>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="pt-10 border-t border-slate-50 flex justify-between items-center -mx-10 px-10">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-widest">Select Action</span>
                    <div className="flex gap-3 py-8">
                       <button onClick={() => setShowStudentModal(false)} className="px-8 py-3.5 bg-white text-slate-600 rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-slate-100 transition-all border border-slate-100">Close</button>
                       {getStudentStatus(selectedStudent) === 'pending' && (
                         <>
                           <button onClick={() => handleApproveStudent(selectedStudent._id)} className="px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:shadow-2xl transition-all shadow-xl active:scale-95">Approve Student</button>
                           <button onClick={() => { setRejectingStudentId(selectedStudent._id); setShowRejectModal(true); }} className="px-8 py-3.5 bg-rose-600 text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:shadow-2xl transition-all shadow-xl active:scale-95">Reject Student</button>
                         </>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setShowRejectModal(false)}></div>
           <div className="bg-white rounded-[3rem] w-full max-w-md relative z-10 animate-slide-up shadow-2xl p-10 shadow-indigo-100">
              <div className="text-center space-y-4 mb-8">
                 <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <XCircle size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Reject Student</h3>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Reason for rejection</p>
              </div>
              
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why the profile is being rejected..."
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-sm font-medium focus:ring-4 focus:ring-rose-500/10 transition-all h-40 focus:outline-none"
              />

              <div className="flex gap-2 mt-8">
                 <button onClick={() => setShowRejectModal(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                 <button onClick={handleRejectStudent} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-rose-500/20 active:scale-95 transition-all">Reject Now</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StudentApprovalSystem;
