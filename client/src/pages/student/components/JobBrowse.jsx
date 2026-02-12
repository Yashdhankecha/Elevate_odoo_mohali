import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaDollarSign, 
  FaClock, 
  FaBuilding,
  FaStar,
  FaHeart,
  FaEye,
  FaCheck,
  FaTimes,
  FaSort,
  FaLocationArrow,
  FaSpinner,
  FaPaperPlane,
  FaCheckCircle
} from 'react-icons/fa';
import { studentApi } from '../../../services/studentApi';

// Safely extract a displayable string from location (API may return {country: "..."} object)
const formatLocation = (loc) => {
  if (!loc) return 'Not specified';
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object') return loc.country || loc.city || loc.state || JSON.stringify(loc);
  return String(loc);
};

const JobBrowse = ({ setActiveSection }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    category: '',
    type: '',
    minSalary: '',
    experience: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('postedAt');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [favorites, setFavorites] = useState([]);
  const [applyingJob, setApplyingJob] = useState(null);
  const [filters, setFilters] = useState({
    locations: [],
    categories: [],
    types: []
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    hasNext: false,
    hasPrev: false
  });

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        sortBy,
        sortOrder: 'desc',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedFilters.location && { location: selectedFilters.location }),
        ...(selectedFilters.category && { category: selectedFilters.category }),
        ...(selectedFilters.type && { type: selectedFilters.type }),
        ...(selectedFilters.minSalary && { minSalary: selectedFilters.minSalary }),
        ...(selectedFilters.experience && { experience: selectedFilters.experience })
      };

      const response = await studentApi.getAvailableJobs(params);
      if (response.success) {
        setJobs(response.data.jobs);
        setFilteredJobs(response.data.jobs);
        setFilters(response.data.filters);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, selectedFilters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setSelectedFilters({ location: '', category: '', type: '', minSalary: '', experience: '' });
    setSearchQuery('');
  };


  const toggleFavorite = (jobId) => {
    setFavorites(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setModalMode('view');
    setShowJobModal(true);
  };

  const handleApplyJob = (job) => {
    setSelectedJob(job);
    setModalMode('apply');
    setShowJobModal(true);
  };

  const handlePageChange = (page) => {
    fetchJobs(page);
  };

  const handleSubmitApplication = async (applicationData) => {
    try {
      setApplyingJob(selectedJob.id);
      await studentApi.applyForJob(selectedJob.id, applicationData);
      setShowJobModal(false);
      setSelectedJob(null);
      fetchJobs();
      setActiveSection('applications');
    } catch (error) {
      console.error('Error applying for job:', error);
    } finally {
      setApplyingJob(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
        <div className="relative">
           <div className="w-20 h-20 border-4 border-blue-50 rounded-full animate-pulse"></div>
           <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Scanning Global Opportunities</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header & Search Hero */}
      <div className="relative p-10 md:p-16 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-800 text-white overflow-hidden shadow-2xl shadow-blue-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl -ml-32 -mb-32"></div>

        <div className="relative z-10 space-y-8 max-w-4xl">
           <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Command Your Future</h1>
              <p className="text-blue-100/80 font-bold uppercase tracking-[0.2em] text-xs md:text-sm">Strategic Career Acquisition Interface</p>
           </div>

           <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative group">
                 <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                 <input 
                   type="text"
                   placeholder="Search roles, engineering stacks, or leadership..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-white/95 backdrop-blur-md rounded-[2rem] pl-14 pr-8 py-5 text-gray-800 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-400/20 transition-all border-none"
                 />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-3 px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all duration-300 ${
                  showFilters ? 'bg-white text-blue-600' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
                }`}
              >
                <FaFilter size={14} />
                Filters {Object.values(selectedFilters).filter(v => v).length > 0 && `(${Object.values(selectedFilters).filter(v => v).length})`}
              </button>
           </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="glass-card p-10 rounded-[2.5rem] bg-white/50 border-white/50 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Geographic Vector</label>
              <select 
                value={selectedFilters.location} 
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Global Reach</option>
                {filters.locations.map((loc, i) => <option key={i} value={typeof loc === 'object' ? loc.country || '' : loc}>{formatLocation(loc)}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Comp Threshold</label>
              <select 
                value={selectedFilters.minSalary} 
                onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Range</option>
                <option value="5">5+ LPA</option>
                <option value="10">10+ LPA</option>
                <option value="20">20+ LPA</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Experience Maturity</label>
              <select 
                value={selectedFilters.experience} 
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Baseline</option>
                <option value="1">Entry (1y)</option>
                <option value="3">Associate (3y)</option>
                <option value="5">Senior (5y+)</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Sort Logic</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Temporal (Newest)</option>
                <option value="salary-high">Comp (High-Low)</option>
                <option value="applications">Engagement (Popular)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-8">
             <button onClick={clearFilters} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline px-4">Reset Neural Filters</button>
          </div>
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredJobs.map((job) => (
          <div key={job.id} className="glass-card p-10 rounded-[3rem] border-white/50 bg-white/70 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 hover-lift group">
             <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden shadow-lg ring-4 ring-gray-50 bg-white p-2">
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors uppercase">{job.title}</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                         <FaBuilding className="text-blue-200" />
                         {job.company}
                      </p>
                   </div>
                </div>
                <button 
                  onClick={() => toggleFavorite(job.id)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    favorites.includes(job.id) ? 'bg-rose-50 text-rose-500 shadow-inner' : 'bg-gray-50 text-gray-300 hover:text-rose-400'
                  }`}
                >
                   <FaHeart />
                </button>
             </div>

             <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50/50 rounded-2xl p-4 text-center">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">Package</p>
                   <p className="text-xs font-black text-gray-800">{job.salary}</p>
                </div>
                <div className="bg-gray-50/50 rounded-2xl p-4 text-center">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">Experience</p>
                   <p className="text-xs font-black text-gray-800">{job.experience}</p>
                </div>
                <div className="bg-gray-50/50 rounded-2xl p-4 text-center">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">Availability</p>
                   <p className="text-xs font-black text-gray-800">{job.jobType}</p>
                </div>
             </div>

             <div className="flex flex-wrap gap-2 mb-8">
                {job.requirements.slice(0, 3).map((req, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-gray-100 text-[10px] font-bold text-blue-600/70 rounded-full uppercase tracking-widest">{req}</span>
                ))}
             </div>

             <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{job.applications} ACTIVE CANDIDATES</p>
                <div className="flex gap-4">
                   <button 
                     onClick={() => handleViewJob(job)}
                     className="px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-blue-600 hover:bg-blue-50 transition-all"
                   >
                     Analytics
                   </button>
                   <button 
                     onClick={() => handleApplyJob(job)}
                     className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
                   >
                     Initiate Application
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && !loading && (
        <div className="glass-card rounded-[3rem] py-32 text-center border-dashed border-gray-200">
           <FaSearch size={64} className="mx-auto text-gray-200 mb-8" />
           <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tighter">No Match Detected</h3>
           <p className="text-gray-300 font-bold mt-2">Adjust your neural parameters and scan again</p>
        </div>
      )}

      {/* Pagination Context */}
      {pagination.total > 1 && (
        <div className="flex items-center justify-center gap-4 py-10">
           <button 
             onClick={() => handlePageChange(pagination.current - 1)}
             disabled={!pagination.hasPrev}
             className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 disabled:opacity-20 transition-all"
           >
              <FaCheck />
           </button>
           <span className="text-sm font-black text-gray-800 uppercase tracking-widest">Sector {pagination.current} / {pagination.total}</span>
           <button 
             onClick={() => handlePageChange(pagination.current + 1)}
             disabled={!pagination.hasNext}
             className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 disabled:opacity-20 transition-all"
           >
              <FaCheck className="rotate-180" />
           </button>
        </div>
      )}

      {/* Modern Modal Overlay */}
      {showJobModal && selectedJob && (
        <JobModal 
          job={selectedJob} 
          mode={modalMode}
          onClose={() => { setShowJobModal(false); setSelectedJob(null); setModalMode('view'); }}
          onApply={handleSubmitApplication}
          applying={applyingJob === selectedJob.id}
          onModeChange={setModalMode}
        />
      )}
    </div>
  );
};

const JobModal = ({ job, mode, onClose, onApply, applying, onModeChange }) => {
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    portfolio: '',
    availability: '',
    salary: '',
    resume: null
  });

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="glass-morphism bg-white rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
         {/* Modal Header */}
         <div className="flex justify-between items-center px-10 py-8 border-b border-gray-50">
            <div>
               <h2 className="text-2xl font-black text-gray-800 tracking-tight uppercase">
                  {mode === 'view' ? 'Opportunity Artifact' : 'Application Dossier'}
               </h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Ref: {job.id?.slice(-8)} / {job.company.toUpperCase()}</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all">
               <FaTimes size={20} />
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            {mode === 'view' ? (
              <div className="grid lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-8 space-y-10">
                    <div className="flex items-center gap-8 p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                       <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg relative z-10 p-3">
                          <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                       </div>
                       <div className="relative z-10 flex-1">
                          <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">{job.title}</h3>
                          <p className="text-blue-100 font-bold uppercase tracking-widest text-xs mt-2 opacity-80">{job.company} • {formatLocation(job.location)}</p>
                       </div>
                       <div className="hidden md:block text-right relative z-10">
                          <p className="text-[10px] font-black uppercase opacity-60">Status</p>
                          <p className="text-sm font-black uppercase">Open Priority</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                          Role Intelligence
                       </h4>
                       <p className="text-gray-600 text-sm leading-relaxed px-1 whitespace-pre-wrap">{job.description}</p>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                          Technical Mandates
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
                          {job.requirements?.map((req, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl group border border-transparent hover:border-emerald-100 transition-all">
                               <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                               <span className="text-xs font-bold text-gray-700">{req}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card p-8 rounded-[2.5rem] border-white/50 bg-gray-50/50">
                       <h4 className="text-[10px] font-black text-gray-800 uppercase tracking-widest mb-6">Execution Context</h4>
                       <div className="space-y-6">
                          {[
                            { label: 'Market Value', val: job.salary },
                            { label: 'Exclusivity', val: job.jobType },
                            { label: 'Experience Maturity', val: job.experience },
                            { label: 'Sector', val: job.department || 'Elite Tech' }
                          ].map((stat, i) => (
                            <div key={i} className="flex justify-between items-end border-b border-gray-200/50 pb-4">
                               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                               <span className="text-xs font-black text-gray-800 uppercase">{stat.val}</span>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="glass-card p-8 rounded-[2.5rem] border-white/50 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50">
                       <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Member Perk</h4>
                       <ul className="space-y-3">
                          {job.benefits?.map((b, i) => (
                            <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-indigo-800">
                               <FaStar className="text-amber-500" size={10} />
                               {b}
                            </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); onApply(applicationData); }} className="max-w-3xl mx-auto space-y-10">
                 <div className="space-y-8">
                    <div>
                       <label className="block text-[10px] font-black text-gray-800 uppercase tracking-widest mb-4 px-1">Value Proposition (Cover Letter)</label>
                       <textarea 
                         rows={8}
                         value={applicationData.coverLetter}
                         onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                         className="w-full bg-gray-50/50 border border-gray-100 rounded-[2rem] p-8 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-400/5 focus:bg-white focus:border-blue-200 transition-all"
                         placeholder="Explain your unique contribution to this role..."
                         required
                       />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                       <div>
                          <label className="block text-[10px] font-black text-gray-800 uppercase tracking-widest mb-4 px-1">Portfolio Link</label>
                          <input 
                            type="url"
                            value={applicationData.portfolio}
                            onChange={(e) => setApplicationData({...applicationData, portfolio: e.target.value})}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.5rem] px-6 py-4 text-sm font-medium focus:outline-none focus:border-blue-200"
                            placeholder="https://github.com/your-stack"
                          />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-gray-800 uppercase tracking-widest mb-4 px-1">Target Package</label>
                          <input 
                            type="text"
                            value={applicationData.salary}
                            onChange={(e) => setApplicationData({...applicationData, salary: e.target.value})}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.5rem] px-6 py-4 text-sm font-medium focus:outline-none focus:border-blue-200"
                            placeholder="e.g. 12 LPA"
                          />
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                       <div>
                          <label className="block text-[10px] font-black text-gray-800 uppercase tracking-widest mb-4 px-1">Deployment Readiness</label>
                          <select 
                            value={applicationData.availability}
                            onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.5rem] px-6 py-4 text-sm font-medium focus:outline-none focus:border-blue-200 appearance-none"
                            required
                          >
                             <option value="">Select Velocity</option>
                             <option value="immediate">Immediate Deployment</option>
                             <option value="2-weeks">2 Weeks Notice</option>
                             <option value="1-month">1 Month Window</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-gray-800 uppercase tracking-widest mb-4 px-1">Modern Resume (PDF)</label>
                          <input 
                            type="file"
                            onChange={(e) => setApplicationData({...applicationData, resume: e.target.files[0]})}
                            className="w-full bg-gray-50/50 border border-dashed border-gray-300 rounded-[1.5rem] px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:bg-gray-100 transition-colors"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-6 pt-4">
                    <button type="button" onClick={() => onModeChange('view')} className="flex-1 py-5 bg-gray-100 text-gray-400 rounded-[1.8rem] font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all">Review Details</button>
                    <button type="submit" disabled={applying} className="flex-1 py-5 bg-blue-600 text-white rounded-[1.8rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                       {applying ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                       {applying ? 'TRANSMITTING...' : 'COMMIT APPLICATION'}
                    </button>
                 </div>
              </form>
            )}
         </div>

         {/* Footer Action Bar */}
         {mode === 'view' && (
           <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100/50 flex gap-4">
              <button onClick={() => onModeChange('apply')} className="flex-1 py-5 bg-blue-600 text-white rounded-[1.8rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group">
                 <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                 Initiate Recruitment Cycle
              </button>
           </div>
         )}
      </div>
    </div>
  );
};

export default JobBrowse;
