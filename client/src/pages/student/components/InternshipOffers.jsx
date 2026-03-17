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
  }, [filterCategory, filterLocation, filterType, pagination.currentPage]);

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

  if (loading && pagination.currentPage === 1) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="relative w-16 h-16 border-4 border-slate-50 flex items-center justify-center rounded overflow-hidden">
          <div className="absolute inset-0 bg-slate-800 animate-pulse h-1 origin-bottom"></div>
          <FaLaptopCode className="text-slate-300" size={24} />
        </div>
        <p className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Discovering Opportunities</p>
      </div>
    );
  }

  if (error && pagination.currentPage === 1) {
    return (
      <div className="bg-white border border-slate-200 shadow-sm rounded p-12 text-center max-w-lg mx-auto mt-20">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-6 rounded">
          <FaTimesCircle size={24} className="text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Connection lost</h3>
        <p className="text-slate-500 mb-8 text-sm">{error}</p>
        <button 
          onClick={fetchInternships}
          className="px-6 py-3 bg-slate-900 text-white rounded font-bold uppercase tracking-widest text-xs shadow-sm hover:bg-slate-800 transition-colors"
        >
          Re-initialize
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-widest">
              <FaRocket size={12} />
              <span>Career Launchpad</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Internship Opportunities
            </h1>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Explore {pagination.totalInternships} curated internships from top companies. Your next big break is one click away.
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {[
              { val: pagination.totalInternships, label: 'Total', icon: FaBriefcase },
              { val: internships.filter(i => i.status === 'active').length, label: 'Active', icon: FaCheckCircle },
            ].map((s, i) => (
              <div key={i} className="text-center text-white bg-slate-800 border border-slate-700 rounded px-6 py-4">
                <s.icon className="mx-auto mb-2 text-lg text-slate-400" />
                <p className="text-2xl font-bold">{s.val}</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              <FaSearch size={14} />
            </div>
            <input
              type="text"
              placeholder="Search by role, company, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchInternships()}
              className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded text-slate-700 min-w-[150px] focus:outline-none focus:border-slate-400 focus:bg-white transition-colors appearance-none cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category === 'All' ? '📂 All Categories' : category}</option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded text-slate-700 min-w-[150px] focus:outline-none focus:border-slate-400 focus:bg-white transition-colors appearance-none cursor-pointer"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location === 'All' ? '📍 All Locations' : location}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded text-slate-700 min-w-[150px] focus:outline-none focus:border-slate-400 focus:bg-white transition-colors appearance-none cursor-pointer"
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
            <div key={internship._id} className="bg-white border border-slate-200 group rounded overflow-hidden shadow-sm hover:border-slate-800 transition-colors flex flex-col relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-slate-800 transition-colors"></div>
              
              <div className="p-6 flex flex-col flex-1 mt-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight group-hover:text-slate-700 transition-colors truncate">
                      {internship.title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-500">
                      <FaBuilding size={12} />
                      <span className="text-xs font-bold uppercase tracking-wider truncate">{internship.company?.companyName || 'Company'}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-widest ${statusCfg.bgLight} ${statusCfg.text} border-${statusCfg.text.split('-')[1]}-200 flex-shrink-0 ml-3`}>
                    <StatusIcon size={10} />
                    {statusCfg.label}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded">
                    {internship.category}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded">
                    {internship.type}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm text-slate-500 flex-1 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt size={12} className="text-slate-400" />
                    </div>
                    <span className="text-xs font-bold">{internship.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <FaMoneyBillWave size={12} className="text-slate-400" />
                    </div>
                    <span className="text-xs font-bold">{formatSalary(internship.package)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <FaClock size={12} className="text-slate-400" />
                    </div>
                    <span className="text-xs font-bold">{formatDuration(internship.duration)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <FaCalendarAlt size={12} className="text-slate-400" />
                    </div>
                    <span className="text-xs font-bold">Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-100 mt-auto">
                  <button
                    onClick={() => handleViewDetails(internship)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <FaEye size={12} />
                    Details
                  </button>
                  {!internship.hasApplied ? (
                    <button
                      onClick={() => handleApply(internship._id)}
                      disabled={applying}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-colors"
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
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-xs font-bold uppercase tracking-widest cursor-default"
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
        <div className="bg-white border border-dashed border-slate-300 rounded shadow-sm py-20 text-center">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-300 rounded flex items-center justify-center mx-auto mb-6">
            <FaBriefcase size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-500 mb-2 uppercase tracking-widest">No internships found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Try adjusting your search or filters to discover more opportunities.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            disabled={!pagination.hasPrev}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaChevronLeft size={10} />
            Previous
          </button>
          
          <div className="px-4 py-2 bg-slate-900 text-white rounded border border-slate-800 text-xs font-bold uppercase tracking-widest">
            {pagination.currentPage} / {pagination.totalPages}
          </div>
          
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            disabled={!pagination.hasNext}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <FaChevronRight size={10} />
          </button>
        </div>
      )}

      {/* Internship Details Modal */}
      {showDetailsModal && selectedInternship && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white border border-slate-200 rounded shadow-sm max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-slate-50 p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Internship Details</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  {selectedInternship.company?.companyName || 'Company'}
                </p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-8">
              {/* Title Card */}
              <div className="bg-slate-900 border border-slate-800 rounded p-8 text-white shadow-sm relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{selectedInternship.title}</h3>
                      <p className="text-slate-400 font-medium flex items-center gap-2">
                        <FaBuilding size={14} />
                        {selectedInternship.company?.companyName}
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 rounded border text-[10px] font-bold uppercase tracking-widest bg-slate-800 border-slate-700 text-slate-300 flex-shrink-0`}>
                      {getStatusConfig(selectedInternship.status).label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Location</p>
                      <p className="font-bold text-sm">{selectedInternship.location}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Stipend</p>
                      <p className="font-bold text-sm">{formatSalary(selectedInternship.package)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Duration</p>
                      <p className="font-bold text-sm">{formatDuration(selectedInternship.duration)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Deadline</p>
                      <p className="font-bold text-sm">{new Date(selectedInternship.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-slate-900 rounded"></div>
                  Description
                </h4>
                <div className="bg-white border border-slate-200 rounded p-6 text-slate-600 text-sm leading-relaxed">
                  {selectedInternship.description}
                </div>
              </div>

              {/* Requirements */}
              {selectedInternship.requirements && selectedInternship.requirements.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-slate-400 rounded"></div>
                    Requirements
                  </h4>
                  <div className="space-y-2">
                    {selectedInternship.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded hover:border-slate-200 transition-colors">
                        <div className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FaStar size={10} />
                        </div>
                        <span className="text-sm text-slate-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {selectedInternship.responsibilities && selectedInternship.responsibilities.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-slate-400 rounded"></div>
                    Responsibilities
                  </h4>
                  <div className="space-y-2">
                    {selectedInternship.responsibilities.map((resp, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded hover:border-slate-200 transition-colors">
                        <div className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FaCheckCircle size={10} />
                        </div>
                        <span className="text-sm text-slate-700">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {selectedInternship.skills && selectedInternship.skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-slate-400 rounded"></div>
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInternship.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded text-xs font-bold uppercase tracking-wider">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Package & Application Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Package Details</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Stipend', value: formatSalary(selectedInternship.package) },
                      { label: 'Duration', value: formatDuration(selectedInternship.duration) },
                      { label: 'Type', value: selectedInternship.type },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                        <span className="text-sm font-bold text-slate-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Application Info</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Deadline', value: new Date(selectedInternship.deadline).toLocaleDateString() },
                      { label: 'Applications', value: selectedInternship.applicationCount || 0 },
                      { label: 'Status', value: getStatusConfig(selectedInternship.status).label },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                        <span className="text-sm font-bold text-slate-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-4 mt-auto">
              <button
                onClick={handleCloseModal}
                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded font-bold uppercase tracking-widest text-xs hover:bg-slate-50 shadow-sm transition-colors"
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
                  className="flex-1 py-3 bg-slate-900 text-white rounded font-bold uppercase tracking-widest text-xs shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
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
                  className="flex-1 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-default shadow-sm"
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
