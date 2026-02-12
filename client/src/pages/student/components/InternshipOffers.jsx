import React, { useState, useEffect } from 'react';
import { 
  FaBriefcase, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaMapMarkerAlt,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClock,
  FaGraduationCap,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaBookmark,
  FaShare,
  FaTimes,
  FaRocket,
  FaLaptopCode,
  FaArrowRight
} from 'react-icons/fa';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

const InternshipOffers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internships, setInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInternships: 0,
    hasNext: false,
    hasPrev: false
  });

  const categories = [
    'All', 'Software Engineering', 'Data Science', 'Web Development', 
    'Mobile Development', 'DevOps', 'UI/UX Design', 'Product Management',
    'Marketing', 'Finance', 'Human Resources', 'Operations'
  ];

  const locations = [
    'All', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 
    'Pune', 'Kolkata', 'Remote', 'Hybrid'
  ];

  const types = ['All', 'Summer Internship', 'Winter Internship', 'Year-round', 'Project-based'];

  useEffect(() => {
    fetchInternships();
  }, [searchQuery, filterCategory, filterLocation, filterType, pagination.currentPage]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.currentPage,
        limit: 12,
        search: searchQuery,
        category: filterCategory !== 'All' ? filterCategory : undefined,
        location: filterLocation !== 'All' ? filterLocation : undefined,
        type: filterType !== 'All' ? filterType : undefined
      };

      const response = await studentApi.getInternshipOffers(params);
      
      if (response.success) {
        setInternships(response.data.internships || []);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.totalPages || 1,
          totalInternships: response.data.totalInternships || 0,
          hasNext: response.data.hasNext || false,
          hasPrev: response.data.hasPrev || false
        }));
      }
    } catch (err) {
      console.error('Error fetching internships:', err);
      setError(err.message || 'Failed to load internship offers');
      toast.error('Failed to load internship offers');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (internshipId) => {
    try {
      setApplying(true);
      const response = await studentApi.applyForInternship(internshipId);
      
      if (response.success) {
        toast.success('Application submitted successfully!');
        fetchInternships();
      }
    } catch (error) {
      console.error('Error applying for internship:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleViewDetails = (internship) => {
    setSelectedInternship(internship);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedInternship(null);
  };

  const getStatusConfig = (status) => {
    const configs = {
      'active': { color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50', text: 'text-emerald-700', label: 'Active', icon: FaCheckCircle },
      'expired': { color: 'from-rose-500 to-pink-600', bgLight: 'bg-rose-50', text: 'text-rose-700', label: 'Expired', icon: FaTimesCircle },
      'upcoming': { color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50', text: 'text-blue-700', label: 'Upcoming', icon: FaClock }
    };
    return configs[status] || configs['active'];
  };

  const formatSalary = (packageData) => {
    if (!packageData) return 'Not specified';
    const { min, max, currency = 'INR' } = packageData;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}`;
    }
    return 'Not specified';
  };

  const formatDuration = (duration) => {
    if (!duration) return 'Not specified';
    return `${duration} months`;
  };

  // --- Premium Loading State ---
  if (loading && pagination.currentPage === 1) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-50 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaLaptopCode className="text-blue-400 text-xl" />
          </div>
        </div>
        <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Discovering Opportunities</p>
      </div>
    );
  }

  // --- Premium Error State ---
  if (error && pagination.currentPage === 1) {
    return (
      <div className="glass-card rounded-[2.5rem] p-12 text-center max-w-lg mx-auto mt-20">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <FaTimesCircle size={32} className="text-rose-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Connection lost</h3>
        <p className="text-gray-500 mb-8 text-sm">{error}</p>
        <button 
          onClick={fetchInternships}
          className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all duration-300"
        >
          Re-initialize
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 shadow-2xl shadow-blue-200/50 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl -ml-16 -mb-16"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
              <FaRocket size={12} />
              <span>Career Launchpad</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Internship Opportunities
            </h1>
            <p className="text-blue-100 text-sm max-w-md font-medium leading-relaxed opacity-90">
              Explore {pagination.totalInternships} curated internships from top companies. Your next big break is one click away.
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {[
              { val: pagination.totalInternships, label: 'Total', icon: FaBriefcase },
              { val: internships.filter(i => i.status === 'active').length, label: 'Active', icon: FaCheckCircle },
            ].map((s, i) => (
              <div key={i} className="text-center text-white bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/10">
                <s.icon className="mx-auto mb-2 text-lg opacity-70" />
                <p className="text-2xl font-black">{s.val}</p>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card rounded-[2rem] p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <FaSearch size={14} />
            </div>
            <input
              type="text"
              placeholder="Search by role, company, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm text-gray-600 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category === 'All' ? '📂 All Categories' : category}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="relative">
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm text-gray-600 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location === 'All' ? '📍 All Locations' : location}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm text-gray-600 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              {types.map(type => (
                <option key={type} value={type}>{type === 'All' ? '🏷️ All Types' : type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Internships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship) => {
          const statusCfg = getStatusConfig(internship.status);
          const StatusIcon = statusCfg.icon;
          return (
            <div key={internship._id} className="glass-card group rounded-[2rem] overflow-hidden hover-lift border-white/50 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-500">
              {/* Card Top Gradient Accent */}
              <div className={`h-1.5 bg-gradient-to-r ${statusCfg.color}`}></div>
              
              <div className="p-7 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-gray-800 mb-1 leading-tight group-hover:text-blue-600 transition-colors truncate">
                      {internship.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FaBuilding size={12} />
                      <span className="text-xs font-bold uppercase tracking-wider truncate">{internship.company?.companyName || 'Company'}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${statusCfg.bgLight} ${statusCfg.text} flex-shrink-0 ml-3`}>
                    <StatusIcon size={10} />
                    {statusCfg.label}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    {internship.category}
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    {internship.type}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm text-gray-500 flex-1 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt size={12} className="text-gray-400" />
                    </div>
                    <span className="text-xs font-semibold">{internship.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <FaMoneyBillWave size={12} className="text-gray-400" />
                    </div>
                    <span className="text-xs font-semibold">{formatSalary(internship.package)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <FaClock size={12} className="text-gray-400" />
                    </div>
                    <span className="text-xs font-semibold">{formatDuration(internship.duration)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <FaCalendarAlt size={12} className="text-gray-400" />
                    </div>
                    <span className="text-xs font-semibold">Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-5 border-t border-gray-100/50">
                  <button
                    onClick={() => handleViewDetails(internship)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <FaEye size={12} />
                    Details
                  </button>
                  {!internship.hasApplied ? (
                    <button
                      onClick={() => handleApply(internship._id)}
                      disabled={applying}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all duration-300"
                    >
                      {applying ? (
                        <FaSpinner className="animate-spin" size={12} />
                      ) : (
                        <FaRocket size={12} />
                      )}
                      {applying ? 'Applying...' : 'Apply'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-widest cursor-default"
                    >
                      <FaCheckCircle size={12} />
                      Applied
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && internships.length === 0 && (
        <div className="glass-card rounded-[2.5rem] py-20 text-center">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FaBriefcase size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No internships found</h3>
          <p className="text-gray-400 font-medium text-sm max-w-md mx-auto">Try adjusting your search or filters to discover more opportunities.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            disabled={!pagination.hasPrev}
            className="flex items-center gap-2 px-6 py-3 glass-card rounded-2xl text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            <FaChevronLeft size={10} />
            Previous
          </button>
          
          <div className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-200">
            {pagination.currentPage} / {pagination.totalPages}
          </div>
          
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            disabled={!pagination.hasNext}
            className="flex items-center gap-2 px-6 py-3 glass-card rounded-2xl text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            Next
            <FaChevronRight size={10} />
          </button>
        </div>
      )}

      {/* Internship Details Modal */}
      {showDetailsModal && selectedInternship && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="glass-morphism bg-white rounded-[2.5rem] max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-8 border-b border-gray-100/50">
              <div>
                <h2 className="text-2xl font-black text-gray-800">Internship Details</h2>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
                  {selectedInternship.company?.companyName || 'Company'}
                </p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all duration-300"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
              {/* Title Card */}
              <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black mb-1">{selectedInternship.title}</h3>
                      <p className="text-blue-100 font-bold opacity-80 flex items-center gap-2">
                        <FaBuilding size={14} />
                        {selectedInternship.company?.companyName}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md border border-white/20`}>
                      {getStatusConfig(selectedInternship.status).label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-blue-200 tracking-tighter mb-1">Location</p>
                      <p className="font-bold text-sm">{selectedInternship.location}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-blue-200 tracking-tighter mb-1">Stipend</p>
                      <p className="font-bold text-sm">{formatSalary(selectedInternship.package)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-blue-200 tracking-tighter mb-1">Duration</p>
                      <p className="font-bold text-sm">{formatDuration(selectedInternship.duration)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-blue-200 tracking-tighter mb-1">Deadline</p>
                      <p className="font-bold text-sm">{new Date(selectedInternship.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                  Description
                </h4>
                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 text-gray-600 text-sm leading-relaxed">
                  {selectedInternship.description}
                </div>
              </div>

              {/* Requirements */}
              {selectedInternship.requirements && selectedInternship.requirements.length > 0 && (
                <div>
                  <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                    Requirements
                  </h4>
                  <div className="space-y-2">
                    {selectedInternship.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50/30 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FaStar size={10} />
                        </div>
                        <span className="text-sm text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {selectedInternship.responsibilities && selectedInternship.responsibilities.length > 0 && (
                <div>
                  <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                    Responsibilities
                  </h4>
                  <div className="space-y-2">
                    {selectedInternship.responsibilities.map((resp, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50/30 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FaCheckCircle size={10} />
                        </div>
                        <span className="text-sm text-gray-700">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {selectedInternship.skills && selectedInternship.skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-purple-500 rounded-full"></div>
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInternship.skills.map((skill, index) => (
                      <span key={index} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold uppercase tracking-wider">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Package & Application Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-6 border-blue-100 bg-blue-50/20">
                  <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4">Package Details</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Stipend', value: formatSalary(selectedInternship.package) },
                      { label: 'Duration', value: formatDuration(selectedInternship.duration) },
                      { label: 'Type', value: selectedInternship.type },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100/50 last:border-0">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                        <span className="text-sm font-bold text-gray-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border-emerald-100 bg-emerald-50/20">
                  <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4">Application Info</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Deadline', value: new Date(selectedInternship.deadline).toLocaleDateString() },
                      { label: 'Applications', value: selectedInternship.applicationCount || 0 },
                      { label: 'Status', value: getStatusConfig(selectedInternship.status).label },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100/50 last:border-0">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                        <span className="text-sm font-bold text-gray-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-8 bg-gray-50/50 border-t border-gray-100/50 flex gap-4">
              <button
                onClick={handleCloseModal}
                className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all duration-300"
              >
                Close
              </button>
              {!selectedInternship.hasApplied ? (
                <button
                  onClick={() => {
                    handleApply(selectedInternship._id);
                    handleCloseModal();
                  }}
                  disabled={applying}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {applying ? (
                    <FaSpinner className="animate-spin" size={14} />
                  ) : (
                    <FaRocket size={14} />
                  )}
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-default"
                >
                  <FaCheckCircle size={14} />
                  Already Applied
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
