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
  FaShare
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
        // Refresh the list to update application status
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <FaCheckCircle className="w-4 h-4" />;
      case 'expired': return <FaTimesCircle className="w-4 h-4" />;
      case 'upcoming': return <FaClock className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
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
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <FaSpinner className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading internship offers...</span>
        </div>
      </div>
    );
  }

  if (error && pagination.currentPage === 1) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <FaTimesCircle className="w-5 h-5 text-red-500 mr-3" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Internship Offers</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button 
              onClick={fetchInternships}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Internship Offers</h1>
          <p className="text-gray-600">Discover and apply for exciting internship opportunities</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaBriefcase className="w-4 h-4" />
          <span>{pagination.totalInternships} opportunities available</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search internships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Internships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship) => (
          <div key={internship._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {internship.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FaBuilding className="w-4 h-4" />
                    <span className="text-sm">{internship.company?.companyName || 'Company'}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(internship.status)}`}>
                  {getStatusIcon(internship.status)}
                  <span>{internship.status}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {internship.category}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {internship.type}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span>{internship.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave className="w-4 h-4" />
                  <span>{formatSalary(internship.package)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  <span>{formatDuration(internship.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6">
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(internship)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEye className="w-4 h-4" />
                  View Details
                </button>
                {!internship.hasApplied && (
                  <button
                    onClick={() => handleApply(internship._id)}
                    disabled={applying}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {applying ? (
                      <FaSpinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <FaPlus className="w-4 h-4" />
                    )}
                    {applying ? 'Applying...' : 'Apply Now'}
                  </button>
                )}
                {internship.hasApplied && (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  >
                    <FaCheckCircle className="w-4 h-4" />
                    Applied
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && internships.length === 0 && (
        <div className="text-center py-12">
          <FaBriefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No internship offers found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or check back later for new opportunities.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            disabled={!pagination.hasPrev}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <span className="px-4 py-2 text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            disabled={!pagination.hasNext}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Internship Details Modal */}
      {showDetailsModal && selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Internship Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaTimesCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {selectedInternship.title}
                </h3>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaBuilding className="w-4 h-4" />
                    <span>{selectedInternship.company?.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="w-4 h-4" />
                    <span>{selectedInternship.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    <span>{formatDuration(selectedInternship.duration)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Description</h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedInternship.description}
                </p>
              </div>

              {/* Requirements */}
              {selectedInternship.requirements && selectedInternship.requirements.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h4>
                  <ul className="space-y-2">
                    {selectedInternship.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FaStar className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsibilities */}
              {selectedInternship.responsibilities && selectedInternship.responsibilities.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Responsibilities</h4>
                  <ul className="space-y-2">
                    {selectedInternship.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FaCheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {selectedInternship.skills && selectedInternship.skills.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInternship.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Package & Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Package Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stipend:</span>
                      <span className="font-medium">{formatSalary(selectedInternship.package)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{formatDuration(selectedInternship.duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedInternship.type}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Application Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-medium">{new Date(selectedInternship.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applications:</span>
                      <span className="font-medium">{selectedInternship.applicationCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${getStatusColor(selectedInternship.status)}`}>
                        {selectedInternship.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {applying ? (
                      <FaSpinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <FaPlus className="w-4 h-4" />
                    )}
                    {applying ? 'Applying...' : 'Apply Now'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  >
                    <FaCheckCircle className="w-4 h-4" />
                    Already Applied
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipOffers;
