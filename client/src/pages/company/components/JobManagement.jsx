import React, { useState, useEffect } from 'react';
import { 
  FaBriefcase, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaClock, 
  FaUsers,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaSpinner
} from 'react-icons/fa';
import { 
  getCompanyJobs, 
  createJob, 
  updateJob, 
  deleteJob 
} from '../../../services/companyApi';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCompanyJobs();
      setJobs(data);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleCreateJob = () => {
    setSelectedJob(null);
    setShowJobModal(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(job => job._id !== jobId));
      setSuccessMessage('Job deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete job. Please try again.');
      console.error('Error deleting job:', err);
    }
  };

  const handleSubmitJob = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);

      if (selectedJob) {
        // Update existing job
        const updatedJob = await updateJob(selectedJob._id, formData);
        setJobs(jobs.map(job => job._id === selectedJob._id ? updatedJob : job));
        setSuccessMessage('Job updated successfully!');
      } else {
        // Create new job
        const newJob = await createJob(formData);
        setJobs([...jobs, newJob]);
        setSuccessMessage('Job created successfully!');
      }

      setShowJobModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save job. Please try again.');
      console.error('Error saving job:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter jobs based on status and department
  const filteredJobs = jobs.filter(job => {
    const statusMatch = filterStatus === 'all' || job.status.toLowerCase() === filterStatus.toLowerCase();
    const departmentMatch = !filterDepartment || job.department.toLowerCase() === filterDepartment.toLowerCase();
    return statusMatch && departmentMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Job Management</h1>
          <p className="text-gray-600">Create and manage your job postings</p>
        </div>
        <button 
          onClick={handleCreateJob}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Post New Job
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Jobs</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Department:</label>
            <select 
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="data science">Data Science</option>
              <option value="product">Product</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <FaBriefcase className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No jobs found</h3>
          <p className="text-gray-500">
            {jobs.length === 0 
              ? "You haven't posted any jobs yet. Create your first job posting!" 
              : "No jobs match your current filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.department}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  job.status === 'Active' 
                    ? 'bg-green-100 text-green-700' 
                    : job.status === 'Draft'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {job.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaDollarSign className="w-4 h-4" />
                  {job.salary}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUsers className="w-4 h-4" />
                  {job.applications || 0} applications
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="w-4 h-4" />
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditJob(job)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  <FaEdit className="w-3 h-3" />
                  Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                  <FaEye className="w-3 h-3" />
                  View
                </button>
                <button 
                  onClick={() => handleDeleteJob(job._id)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Modal */}
      {showJobModal && (
        <JobModal 
          job={selectedJob} 
          onClose={() => setShowJobModal(false)}
          onSubmit={handleSubmitJob}
          submitting={submitting}
        />
      )}
    </div>
  );
};

// Job Modal Component
const JobModal = ({ job, onClose, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    department: job?.department || '',
    location: job?.location || '',
    salary: job?.salary || '',
    deadline: job?.deadline ? job.deadline.split('T')[0] : '',
    description: job?.description || '',
    requirements: job?.requirements?.join(', ') || '',
    status: job?.status || 'Draft'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req)
    };
    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {job ? 'Edit Job' : 'Post New Job'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Software Engineer Intern"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Data Science">Data Science</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bangalore, India"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="₹8-12 LPA"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
              placeholder="Describe the job responsibilities and requirements..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma-separated)</label>
            <input
              type="text"
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="React, Node.js, JavaScript, Git"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <FaSpinner className="animate-spin w-4 h-4" />}
              {job ? 'Update Job' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobManagement;
