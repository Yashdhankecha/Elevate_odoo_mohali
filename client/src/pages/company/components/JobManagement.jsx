import React, { useState } from 'react';
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
  FaCalendarAlt
} from 'react-icons/fa';

const JobManagement = () => {
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'Software Engineer Intern',
      department: 'Engineering',
      location: 'Bangalore, India',
      salary: '₹8-12 LPA',
      applications: 89,
      deadline: '2024-12-15',
      status: 'Active',
      description: 'We are looking for a talented software engineer intern to join our team...',
      requirements: ['React', 'Node.js', 'JavaScript', 'Git'],
      postedDate: '2024-11-01'
    },
    {
      id: 2,
      title: 'Data Analyst',
      department: 'Data Science',
      location: 'Mumbai, India',
      salary: '₹10-15 LPA',
      applications: 67,
      deadline: '2024-12-20',
      status: 'Active',
      description: 'Join our data science team to analyze and interpret complex data sets...',
      requirements: ['Python', 'SQL', 'Tableau', 'Statistics'],
      postedDate: '2024-11-05'
    },
    {
      id: 3,
      title: 'Product Manager Trainee',
      department: 'Product',
      location: 'Delhi, India',
      salary: '₹12-18 LPA',
      applications: 45,
      deadline: '2024-12-25',
      status: 'Draft',
      description: 'Learn product management from industry experts...',
      requirements: ['Analytics', 'Communication', 'Leadership'],
      postedDate: '2024-11-10'
    },
    {
      id: 4,
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Hyderabad, India',
      salary: '₹15-25 LPA',
      applications: 123,
      deadline: '2024-12-10',
      status: 'Active',
      description: 'Build beautiful and responsive user interfaces...',
      requirements: ['React', 'TypeScript', 'CSS', 'UI/UX'],
      postedDate: '2024-10-25'
    }
  ];

  const filteredJobs = filterStatus === 'all' 
    ? jobs 
    : jobs.filter(job => job.status.toLowerCase() === filterStatus.toLowerCase());

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleCreateJob = () => {
    setSelectedJob(null);
    setShowJobModal(true);
  };

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
            <select className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="data-science">Data Science</option>
              <option value="product">Product</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.department}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                job.status === 'Active' 
                  ? 'bg-green-100 text-green-700' 
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
                {job.applications} applications
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
              <button className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm">
                <FaTrash className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Job Modal */}
      {showJobModal && (
        <JobModal 
          job={selectedJob} 
          onClose={() => setShowJobModal(false)} 
        />
      )}
    </div>
  );
};

// Job Modal Component
const JobModal = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    department: job?.department || '',
    location: job?.location || '',
    salary: job?.salary || '',
    deadline: job?.deadline || '',
    description: job?.description || '',
    requirements: job?.requirements?.join(', ') || '',
    status: job?.status || 'Draft'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Job data:', formData);
    onClose();
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
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              {job ? 'Update Job' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
