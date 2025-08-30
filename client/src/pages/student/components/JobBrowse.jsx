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
  FaSpinner
} from 'react-icons/fa';
import { studentApi } from '../../../services/studentApi';

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
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'apply'
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

  // Fetch jobs from API
  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        sortBy,
        sortOrder: 'desc'
      };

      // Add search query
      if (searchQuery) {
        params.search = searchQuery;
      }

      // Add filters
      if (selectedFilters.location) params.location = selectedFilters.location;
      if (selectedFilters.category) params.category = selectedFilters.category;
      if (selectedFilters.type) params.type = selectedFilters.type;
      if (selectedFilters.minSalary) params.minSalary = selectedFilters.minSalary;
      if (selectedFilters.experience) params.experience = selectedFilters.experience;

      console.log('Fetching jobs with params:', params);
      const response = await studentApi.getAvailableJobs(params);
      console.log('API Response:', response);
      
      if (response.success) {
        console.log('Jobs received:', response.data.jobs.length);
        setJobs(response.data.jobs);
        setFilteredJobs(response.data.jobs);
        setFilters(response.data.filters);
        setPagination(response.data.pagination);
      } else {
        console.error('API returned success: false:', response.message);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, selectedFilters, sortBy]);

    useEffect(() => {
    // Since we're fetching from API with filters, this is mainly for client-side filtering if needed
    setFilteredJobs(jobs);
  }, [jobs]);

  const filterJobs = () => {
    // Since we're fetching from API with filters, this is mainly for client-side filtering if needed
    setFilteredJobs(jobs);
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      location: '',
      category: '',
      type: '',
      minSalary: '',
      experience: ''
    });
    setSearchQuery('');
  };

  const toggleFavorite = (jobId) => {
    setFavorites(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApplyJob = async (job) => {
    setSelectedJob(job);
    setModalMode('apply');
    setShowJobModal(true);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setModalMode('view'); // Show job details when clicking "View Details"
    setShowJobModal(true);
  };

  const handleSubmitApplication = async (applicationData) => {
    try {
      setApplyingJob(selectedJob.id);
      await studentApi.applyForJob(selectedJob.id, applicationData);
      
      // Show success message
      alert('Application submitted successfully!');
      
      // Close modal and refresh jobs
      setShowJobModal(false);
      setSelectedJob(null);
      setModalMode('view');
      fetchJobs();
      
      // Navigate to applications page
      setActiveSection('applications');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplyingJob(null);
    }
  };

  const getFilterCount = () => {
    return Object.values(selectedFilters).filter(value => value !== '').length;
  };

  const handlePageChange = (page) => {
    fetchJobs(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Browse Jobs</h1>
          <p className="text-gray-600">Find your dream job from {jobs.length} opportunities</p>
        </div>
        <button
          onClick={() => setActiveSection('applications')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaEye className="w-4 h-4" />
          View Applications
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaFilter className="w-4 h-4" />
            Filters
            {getFilterCount() > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                {getFilterCount()}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="salary-high">Highest Salary</option>
            <option value="salary-low">Lowest Salary</option>
            <option value="applications">Most Applications</option>
          </select>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={selectedFilters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Location</option>
                  {filters.locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary (LPA)</label>
                <select
                  value={selectedFilters.minSalary}
                  onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="5">5+ LPA</option>
                  <option value="8">8+ LPA</option>
                  <option value="10">10+ LPA</option>
                  <option value="15">15+ LPA</option>
                  <option value="20">20+ LPA</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Experience</label>
                <select
                  value={selectedFilters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="5">5 years</option>
                  <option value="10">10+ years</option>
                </select>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  value={selectedFilters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  {filters.types.map((type, index) => (
                    <option key={index} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  {filters.categories.map((category, index) => (
                    <option key={index} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {getFilterCount() > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaLocationArrow className="w-4 h-4" />
          {filteredJobs.filter(job => job.isRemote).length} remote positions available
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Job Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <img 
                  src={job.companyLogo || 'https://via.placeholder.com/50'} 
                  alt={job.company} 
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/50';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(job.id)}
                className={`p-2 rounded-lg transition-colors ${
                  favorites.includes(job.id)
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <FaHeart className="w-4 h-4" />
              </button>
            </div>

            {/* Job Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaMapMarkerAlt className="w-4 h-4" />
                {job.location}
                {job.isRemote && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Remote
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaDollarSign className="w-4 h-4" />
                {job.salary}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaBriefcase className="w-4 h-4" />
                {job.experience} • {job.jobType}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock className="w-4 h-4" />
                Posted {new Date(job.postedDate).toLocaleDateString()}
              </div>
            </div>

            {/* Job Description Preview */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {job.description}
            </p>

            {/* Requirements */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Key Requirements:</p>
              <div className="flex flex-wrap gap-2">
                {job.requirements.slice(0, 3).map((req, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {req}
                  </span>
                ))}
                {job.requirements.length > 3 && (
                  <span className="text-gray-500 text-xs">+{job.requirements.length - 3} more</span>
                )}
              </div>
            </div>

            {/* Job Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{job.applications} applications</span>
                {job.deadline && (
                  <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewJob(job)}
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleApplyJob(job)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredJobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.total) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg ${
                    page === pagination.current
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={!pagination.hasNext}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

             {/* Job Modal */}
       {showJobModal && selectedJob && (
         <JobModal 
           job={selectedJob} 
           mode={modalMode}
           onClose={() => {
             setShowJobModal(false);
             setSelectedJob(null);
             setModalMode('view');
           }}
           onApply={handleSubmitApplication}
           applying={applyingJob === selectedJob.id}
           onModeChange={setModalMode}
         />
       )}
    </div>
  );
};

// Job Modal Component
const JobModal = ({ job, mode, onClose, onApply, applying, onModeChange }) => {
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    portfolio: '',
    availability: '',
    salary: '',
    resume: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(applicationData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                 <div className="flex justify-between items-center p-6 border-b border-gray-200">
           <h2 className="text-xl font-bold text-gray-800">
             {mode === 'view' ? 'Job Details' : 'Apply for Job'}
           </h2>
           <button 
             onClick={onClose}
             className="text-gray-500 hover:text-gray-700 text-2xl"
           >
             ×
           </button>
         </div>
        
                 <div className="p-6">
           {/* Job Details - Show in view mode */}
           {mode === 'view' && (
             <>
               {/* Job Header */}
               <div className="flex items-start gap-4 mb-6">
                 <img 
                   src={job.companyLogo || 'https://via.placeholder.com/50'} 
                   alt={job.company} 
                   className="w-16 h-16 rounded-lg object-cover"
                   onError={(e) => {
                     e.target.src = 'https://via.placeholder.com/50';
                   }}
                 />
                 <div className="flex-1">
                   <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
                   <p className="text-lg text-gray-600 mb-2">{job.company}</p>
                   <div className="flex items-center gap-4 text-sm text-gray-500">
                     <span className="flex items-center gap-1">
                       <FaMapMarkerAlt className="w-4 h-4" />
                       {job.location}
                     </span>
                     <span className="flex items-center gap-1">
                       <FaDollarSign className="w-4 h-4" />
                       {job.salary}
                     </span>
                     <span className="flex items-center gap-1">
                       <FaBriefcase className="w-4 h-4" />
                       {job.jobType}
                     </span>
                   </div>
                 </div>
               </div>

               {/* Job Details Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div>
                   <h4 className="font-semibold text-gray-800 mb-3">Job Description</h4>
                   <p className="text-gray-600 mb-4">{job.description}</p>
                   
                   <h4 className="font-semibold text-gray-800 mb-3">Requirements</h4>
                   <ul className="space-y-2">
                     {job.requirements && job.requirements.length > 0 ? (
                       job.requirements.map((req, index) => (
                         <li key={index} className="flex items-center gap-2 text-gray-600">
                           <FaCheck className="w-4 h-4 text-green-500" />
                           {req}
                         </li>
                       ))
                     ) : (
                       <li className="text-gray-500 italic">No specific requirements listed</li>
                     )}
                   </ul>
                 </div>

                 <div>
                   <h4 className="font-semibold text-gray-800 mb-3">Benefits</h4>
                   <ul className="space-y-2 mb-4">
                     {job.benefits && job.benefits.length > 0 ? (
                       job.benefits.map((benefit, index) => (
                         <li key={index} className="flex items-center gap-2 text-gray-600">
                           <FaStar className="w-4 h-4 text-yellow-500" />
                           {benefit}
                         </li>
                       ))
                     ) : (
                       <li className="text-gray-500 italic">Benefits not specified</li>
                     )}
                   </ul>

                   <div className="bg-gray-50 rounded-lg p-4">
                     <h4 className="font-semibold text-gray-800 mb-3">Job Summary</h4>
                     <div className="space-y-2 text-sm">
                       <div className="flex justify-between">
                         <span className="text-gray-600">Experience:</span>
                         <span className="font-medium">{job.experience || 'Not specified'}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600">Department:</span>
                         <span className="font-medium">{job.department || 'Not specified'}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600">Applications:</span>
                         <span className="font-medium">{job.applications || 0}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600">Deadline:</span>
                         <span className="font-medium">
                           {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Not specified'}
                         </span>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Apply Button - Only show in view mode */}
               <div className="flex gap-3 pt-4">
                 <button
                   onClick={onClose}
                   className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                 >
                   Close
                 </button>
                 <button
                   onClick={() => {
                     onModeChange('apply');
                   }}
                   className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                 >
                   Apply Now
                 </button>
               </div>
             </>
           )}

           {/* Application Form - Show in apply mode */}
           {mode === 'apply' && (
             <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="font-semibold text-gray-800">Application Details</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us why you're interested in this position..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
                  <input
                    type="url"
                    value={applicationData.portfolio}
                    onChange={(e) => setApplicationData({...applicationData, portfolio: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://your-portfolio.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary</label>
                  <input
                    type="text"
                    value={applicationData.salary}
                    onChange={(e) => setApplicationData({...applicationData, salary: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="₹X LPA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={applicationData.availability}
                  onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select availability</option>
                  <option value="immediate">Immediate</option>
                  <option value="2-weeks">2 weeks</option>
                  <option value="1-month">1 month</option>
                  <option value="2-months">2 months</option>
                  <option value="3-months">3 months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setApplicationData({...applicationData, resume: e.target.files[0]})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={applying}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={applying}
                >
                  {applying ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
                                            </div>
             </form>
           )}
         </div>
       </div>
     </div>
   );
 };

export default JobBrowse;
