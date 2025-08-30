import React, { useState } from 'react';
import { 
  FaUsers, 
  FaFilter, 
  FaSearch, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDownload
} from 'react-icons/fa';

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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'shortlisted':
        return 'bg-green-100 text-green-700';
      case 'interview':
        return 'bg-blue-100 text-blue-700';
      case 'applied':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Applications Tracking</h1>
          <p className="text-gray-600">Manage and review job applications</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FaDownload className="w-4 h-4" />
            Export
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Bulk Actions
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, role, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FaFilter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CGPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(application.id)}
                      onChange={() => handleSelectApplication(application.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUsers className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{application.name}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.role}</div>
                    <div className="text-sm text-gray-500">{application.experience} experience</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.department}</div>
                    <div className="text-sm text-gray-500">{application.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.cgpa}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <FaCheck className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Actions */}
      {selectedApplications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedApplications.length} application(s) selected
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                Shortlist Selected
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Schedule Interview
              </button>
              <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                Reject Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTracking;
