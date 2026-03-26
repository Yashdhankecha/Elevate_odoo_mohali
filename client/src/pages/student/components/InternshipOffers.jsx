import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Briefcase, MapPin, Clock, Building2, Calendar, 
  ChevronRight, ChevronLeft, Award, TrendingUp, Send, X,
  CheckCircle2, AlertCircle, Globe, Wifi, Monitor, RefreshCw,
  Rocket, Zap, DollarSign, Timer, BookOpen, Filter, XCircle, Eye,
  File, Layers
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmtDeadline = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const diff = Math.ceil((d - Date.now()) / 86400000);
  if (diff < 0) return { label: 'Expired', cls: 'text-rose-500' };
  if (diff <= 3) return { label: `${diff}d left!`, cls: 'text-orange-500 font-black' };
  if (diff <= 7) return { label: `${diff}d left`, cls: 'text-amber-500' };
  return { label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), cls: 'text-slate-400' };
};

const WORK_ICON = { office: Monitor, remote: Wifi, hybrid: Globe };

const initials = (n = '') => n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'CO';
const GRAD = ['from-blue-500 to-indigo-600','from-violet-500 to-purple-600','from-teal-500 to-emerald-600','from-rose-500 to-pink-600','from-amber-500 to-orange-600'];
const grad = (name) => GRAD[(name || '').charCodeAt(0) % GRAD.length];

// ─── Company Avatar ──────────────────────────────────────────────────────────
const Avatar = ({ name, logo, size = 'md' }) => {
  const [error, setError] = useState(false);
  const sz = size === 'lg' ? 'w-16 h-16 rounded text-xl' : 'w-11 h-11 rounded text-sm';
  if (logo && !error) {
    return (
      <img src={logo} alt={name} className={`${sz} object-contain bg-white border border-slate-100 p-1 flex-shrink-0 shadow-sm`} 
        onError={() => setError(true)} 
      />
    );
  }
  return (
    <div className={`${sz} bg-gradient-to-br ${grad(name)} flex items-center justify-center text-white font-black shadow-sm flex-shrink-0 capitalize`}>
      {initials(name)}
    </div>
  );
};

// ─── Internship Card ─────────────────────────────────────────────────────────
const InternshipCard = ({ internship, onView }) => {
  const deadline = fmtDeadline(internship.deadline);
  const mode     = internship.workMode || 'office';
  const Icon     = WORK_ICON[mode] || Monitor;

  return (
    <div 
      onClick={() => onView(internship)}
      className="group bg-white rounded border border-slate-200 hover:border-slate-800 transition-all p-6 shadow-sm flex flex-col cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-slate-800 transition-colors"></div>
      
      <div className="flex items-start gap-4 mb-6 relative z-10">
        <div className="flex-shrink-0 group-hover:shadow-md transition-shadow relative">
          <Avatar name={internship.company?.companyName || internship.companyName} logo={internship.companyLogo} />
          {internship.hasApplied && (
            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-sm border-2 border-white z-20">
              <CheckCircle2 size={10} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-bold text-lg text-slate-900 leading-tight line-clamp-1 tracking-tight">
            {internship.title}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm mt-1">
            <Building2 size={13} className="text-slate-400" />
            <span className="line-clamp-1">{internship.companyName || internship.company?.companyName}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-[10px] font-black px-2.5 py-1 rounded bg-slate-50 text-slate-600 border border-slate-200 uppercase tracking-widest shadow-sm">
          {internship.category || internship.department || 'General'}
        </span>
        <span className="text-[10px] font-black px-2.5 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest shadow-sm flex items-center gap-1.5">
          <Icon size={10} /> {mode}
        </span>
        {internship.hasApplied && (
          <span className="text-[10px] font-black px-2.5 py-1 rounded bg-emerald-500 text-white border border-emerald-600 uppercase tracking-widest shadow-sm flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={10} /> Applied
          </span>
        )}
        {internship.ppoPossibility && internship.ppoPossibility !== 'no' && (
          <span className="text-[10px] font-black px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest shadow-sm">
            PPO Possible
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 pt-5 border-t border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <DollarSign size={14} className="text-emerald-500" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Stipend</p>
            <p className="text-xs font-black text-emerald-700 truncate">
              {internship.stipend > 0 ? `₹${Number(internship.stipend).toLocaleString()}/mo` : 'Unpaid'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Timer size={14} className="text-blue-500" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Duration</p>
            <p className="text-xs font-black text-slate-700 truncate">{internship.internshipDuration || 'Multiple'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 font-black">
         <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-widest">
            <Calendar size={12} />
            {deadline?.label || 'TBD'}
         </div>
         <div className="text-[10px] text-slate-900 border-b-2 border-slate-900 pb-0.5 group-hover:pr-2 transition-all">
           VIEW DETAILS
         </div>
      </div>
    </div>
  );
};

// ─── Modal Components ────────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm text-slate-600">
        <Icon size={14} />
      </div>
      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">{title}</h4>
    </div>
    <div className="pl-11">{children}</div>
  </div>
);

const DetailChip = ({ label, value, color = "blue" }) => (
  <div className="bg-slate-50 border border-slate-200 rounded p-4 shadow-sm">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-black text-slate-900">{value}</p>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const InternshipOffers = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    location: 'All',
    workMode: 'All',
    duration: 'All',
    ppo: 'All',
    stipend: 'All',
  });
  const [pagination, setPagination] = useState({ current: 1, total: 1 });
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const fetchInternships = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        search,
        ...filters
      };
      const res = await studentApi.getInternshipOffers(params);
      if (res.success) {
        setInternships(res.data.internships || []);
        setPagination({
          current: page,
          total: res.data.pagination?.totalPages || 1
        });
      }
    } catch (err) {
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => { fetchInternships(1); }, [fetchInternships]);

  // Auto-select profile resume if the user already has one saved
  useEffect(() => {
    if (user?.resume) setUseProfileResume(true);
  }, [user]);

  const handleApply = async (id) => {
    // Resume is mandatory
    const hasProfileResume = !!user?.resume;
    const usingProfile = useProfileResume && hasProfileResume;
    if (!usingProfile && !resumeFile) {
      toast.error('A resume is required to apply. Upload one below or save a resume to your profile first.');
      return;
    }

    setApplying(true);
    try {
      const res = await studentApi.applyForInternship(id, {
        coverLetter,
        resume: usingProfile ? null : resumeFile,
      });
      if (res.success) {
        toast.success('Successfully applied!');
        setSelectedJob(prev => ({ ...prev, hasApplied: true }));
        fetchInternships(pagination.current);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  const handleModalClose = () => {
    setSelectedJob(null);
    setResumeFile(null);
    setUseProfileResume(!!user?.resume);
    setCoverLetter('');
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
            <Zap size={12} fill="currentColor" />
            <span>Internship Portal</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Opportunities</h1>
          <p className="text-slate-500 font-medium">Find the perfect launchpad for your tech career</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by role, skill, or company..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex items-center gap-3">
            <select 
              value={filters.category}
              onChange={e => setFilters(p => ({ ...p, category: e.target.value }))}
              className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer appearance-none"
            >
              <option value="All">All Categories</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>

            <select 
              value={filters.duration}
              onChange={e => setFilters(p => ({ ...p, duration: e.target.value }))}
              className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer appearance-none"
            >
              <option value="All">Duration</option>
              <option value="2">2 Months</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
            </select>

            <select 
              value={filters.workMode}
              onChange={e => setFilters(p => ({ ...p, workMode: e.target.value }))}
              className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer appearance-none"
            >
              <option value="All">All Modes</option>
              <option value="office">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>

            <select 
              value={filters.ppo}
              onChange={e => setFilters(p => ({ ...p, ppo: e.target.value }))}
              className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer appearance-none"
            >
              <option value="All">PPO Status</option>
              <option value="Yes">PPO Possible</option>
              <option value="No">No PPO</option>
            </select>

            <select 
              value={filters.stipend}
              onChange={e => setFilters(p => ({ ...p, stipend: e.target.value }))}
              className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer appearance-none"
            >
              <option value="All">Stipend Type</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse border border-slate-200"></div>
          ))}
        </div>
      ) : internships.length === 0 ? (
        <div className="py-20 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Briefcase size={24} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No opportunities found</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map(intern => (
            <InternshipCard key={intern._id} internship={intern} onView={setSelectedJob} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="flex items-center justify-center gap-4 pt-10">
          <button 
            disabled={pagination.current === 1}
            onClick={() => fetchInternships(pagination.current - 1)}
            className="p-3 rounded-lg border border-slate-200 hover:border-slate-900 disabled:opacity-50 transition-all shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="px-6 py-3 bg-slate-900 text-white rounded-lg font-black text-xs uppercase tracking-widest shadow-lg">
            Page {pagination.current} / {pagination.total}
          </div>
          <button 
             disabled={pagination.current === pagination.total}
             onClick={() => fetchInternships(pagination.current + 1)}
             className="p-3 rounded-lg border border-slate-200 hover:border-slate-900 disabled:opacity-50 transition-all shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={handleModalClose} />
          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-8 text-white relative">
              <button onClick={handleModalClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                <X size={20} />
              </button>
              
              <div className="flex gap-6 items-start pr-12">
                <Avatar name={selectedJob.companyName || selectedJob.company?.companyName} logo={selectedJob.companyLogo} size="lg" />
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-[9px] font-black uppercase tracking-widest text-white/80">
                      {selectedJob.category || 'General'}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-400/30 rounded text-[9px] font-black uppercase tracking-widest text-blue-300">
                      {selectedJob.workMode}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight leading-tight">{selectedJob.title}</h2>
                  <p className="text-slate-400 font-bold">{selectedJob.companyName || selectedJob.company?.companyName}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <DetailChip label="Stipend" value={selectedJob.stipend > 0 ? `₹${Number(selectedJob.stipend).toLocaleString()}` : "Unpaid"} />
                <DetailChip label="Duration" value={selectedJob.internshipDuration || "TBD"} />
                <DetailChip label="Deadline" value={new Date(selectedJob.deadline).toLocaleDateString('en-IN', {month:'short', day:'numeric'})} />
                <DetailChip label="Openings" value={selectedJob.numberOfOpenings || "Multiple"} />
              </div>

              <Section title="Description" icon={BookOpen}>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                  {selectedJob.description || selectedJob.jobDescription}
                </p>
              </Section>

              {selectedJob.skills?.length > 0 && (
                <Section title="Required Skills" icon={Zap}>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map(s => (
                      <span key={s} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px] font-black uppercase tracking-widest shadow-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {selectedJob.ppoPossibility && selectedJob.ppoPossibility !== 'no' && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-emerald-900 text-sm uppercase tracking-widest">PPO Opportunity</h4>
                    <p className="text-emerald-700 text-xs font-medium mt-0.5">Successful candidates may receive full-time job offers.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
              {/* ── Resume section ── */}
              {!selectedJob.hasApplied && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <File size={12} /> Resume <span className="text-red-500">*</span>
                  </p>

                  {/* No resume warning */}
                  {!user?.resume && !resumeFile && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                      <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700 font-medium">No resume found. Upload one below or save a resume to your profile to apply.</p>
                    </div>
                  )}

                  {/* Use profile resume toggle */}
                  {user?.resume && (
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:border-slate-400 transition-colors">
                      <input
                        type="checkbox"
                        checked={useProfileResume}
                        onChange={e => {
                          setUseProfileResume(e.target.checked);
                          if (e.target.checked) setResumeFile(null);
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900">Use resume from profile</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[220px]">{user.resume.split('/').pop()}</p>
                      </div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </label>
                  )}

                  {/* Upload new resume */}
                  <div className={`p-3 rounded-lg border-2 border-dashed transition-colors ${
                    !useProfileResume ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}>
                    <input
                      type="file"
                      id="intern-resume-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      disabled={useProfileResume}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) { setResumeFile(file); setUseProfileResume(false); }
                      }}
                    />
                    <label
                      htmlFor="intern-resume-upload"
                      className={`flex flex-col items-center justify-center gap-1 cursor-pointer ${useProfileResume ? 'cursor-not-allowed' : ''}`}
                    >
                      <Layers size={20} className={resumeFile ? 'text-blue-500' : 'text-slate-400'} />
                      <p className="text-xs font-bold text-slate-700">
                        {resumeFile ? resumeFile.name : 'Upload New Resume'}
                      </p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">PDF, DOC up to 10MB</p>
                    </label>
                  </div>
                </div>
              )}

              {/* Apply / Applied */}
              {selectedJob.hasApplied ? (
                <div className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] border border-emerald-100">
                  <CheckCircle2 size={16} /> Application Submitted
                </div>
              ) : (
                <button
                  onClick={() => handleApply(selectedJob._id)}
                  disabled={applying || (!user?.resume && !resumeFile) || (!useProfileResume && !resumeFile)}
                  title={(!user?.resume && !resumeFile) ? 'Upload a resume to enable this button' : ''}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {applying ? <RefreshCw size={16} className="animate-spin" /> : <Rocket size={16} />}
                  {applying ? 'Processing...' : 'Apply for Internship'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipOffers;
