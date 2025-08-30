import React, { useState } from 'react';
import { 
  FaBriefcase, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaEye, 
  FaTrash,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
  FaGraduationCap,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

const PlacementDrives = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const drives = [
    {
      id: 1,
      company: 'Google Inc.',
      logo: 'G',
      position: 'Software Engineer',
      date: 'Dec 20, 2024',
      time: '10:00 AM - 5:00 PM',
      type: 'On-Campus',
      location: 'Main Auditorium',
      status: 'Scheduled',
      totalPositions: 15,
      registeredStudents: 247,
      shortlistedStudents: 89,
      requirements: {
        minCGPA: 7.5,
        skills: ['Python', 'Java', 'Algorithms', 'Data Structures'],
        branches: ['CSE', 'IT', 'ECE']
      },
      rounds: [
        { name: 'Aptitude Test', date: 'Dec 20, 2024', time: '10:00 AM - 11:30 AM' },
        { name: 'Technical Interview', date: 'Dec 20, 2024', time: '2:00 PM - 5:00 PM' }
      ],
      package: '₹18.5 LPA',
      contactPerson: 'John Smith',
      contactPhone: '+1-650-253-0000',
      contactEmail: 'john.smith@google.com'
    },
    {
      id: 2,
      company: 'Microsoft Corporation',
      logo: 'M',
      position: 'Data Scientist',
      date: 'Dec 25, 2024',
      time: '9:00 AM - 4:00 PM',
      type: 'On-Campus',
      location: 'Seminar Hall 1',
      status: 'Scheduled',
      totalPositions: 12,
      registeredStudents: 189,
      shortlistedStudents: 67,
      requirements: {
        minCGPA: 7.0,
        skills: ['Machine Learning', 'Python', 'Statistics', 'SQL'],
        branches: ['CSE', 'IT', 'ECE', 'ME']
      },
      rounds: [
        { name: 'Technical Test', date: 'Dec 25, 2024', time: '9:00 AM - 10:30 AM' },
        { name: 'Technical Interview', date: 'Dec 25, 2024', time: '11:00 AM - 1:00 PM' },
        { name: 'HR Round', date: 'Dec 25, 2024', time: '2:00 PM - 4:00 PM' }
      ],
      package: '₹16.2 LPA',
      contactPerson: 'Sarah Johnson',
      contactPhone: '+1-425-882-8080',
      contactEmail: 'sarah.johnson@microsoft.com'
    },
    {
      id: 3,
      company: 'Amazon Web Services',
      logo: 'A',
      position: 'SDE Intern',
      date: 'Jan 10, 2025',
      time: '11:00 AM - 6:00 PM',
      type: 'Virtual',
      location: 'Online Platform',
      status: 'Upcoming',
      totalPositions: 20,
      registeredStudents: 356,
      shortlistedStudents: 120,
      requirements: {
        minCGPA: 7.8,
        skills: ['AWS', 'Python', 'DevOps', 'Cloud Computing'],
        branches: ['CSE', 'IT']
      },
      rounds: [
        { name: 'Online Assessment', date: 'Jan 10, 2025', time: '11:00 AM - 12:30 PM' },
        { name: 'Virtual Interview', date: 'Jan 10, 2025', time: '2:00 PM - 6:00 PM' }
      ],
      package: '₹80K/month',
      contactPerson: 'Mike Davis',
      contactPhone: '+1-206-266-1000',
      contactEmail: 'mike.davis@aws.amazon.com'
    },
    {
      id: 4,
      company: 'Tata Consultancy Services',
      logo: 'T',
      position: 'System Engineer',
      date: 'Dec 30, 2024',
      time: '9:00 AM - 3:00 PM',
      type: 'On-Campus',
      location: 'Computer Lab 3',
      status: 'Completed',
      totalPositions: 50,
      registeredStudents: 423,
      shortlistedStudents: 156,
      requirements: {
        minCGPA: 6.5,
        skills: ['Java', 'Spring', 'MySQL', 'Agile'],
        branches: ['CSE', 'IT', 'ECE', 'ME', 'CE']
      },
      rounds: [
        { name: 'Written Test', date: 'Dec 30, 2024', time: '9:00 AM - 10:30 AM' },
        { name: 'Technical Interview', date: 'Dec 30, 2024', time: '11:00 AM - 1:00 PM' },
        { name: 'HR Round', date: 'Dec 30, 2024', time: '2:00 PM - 3:00 PM' }
      ],
      package: '₹8.5 LPA',
      contactPerson: 'Priya Sharma',
      contactPhone: '+91-22-6778-9999',
      contactEmail: 'priya.sharma@tcs.com'
    }
  ];

  const statuses = ['All', 'Scheduled', 'Upcoming', 'Completed', 'Cancelled'];
  const types = ['All', 'On-Campus', 'Virtual', 'Hybrid'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Upcoming': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'On-Campus': return 'bg-purple-100 text-purple-800';
      case 'Virtual': return 'bg-orange-100 text-orange-800';
      case 'Hybrid': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDrives = drives.filter(drive => {
    const matchesSearch = drive.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         drive.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || drive.status === filterStatus;
    const matchesType = filterType === 'All' || drive.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBriefcase className="text-orange-600" />
            Placement Drives
          </h2>
          <p className="text-gray-600">Manage scheduled drives, registrations, and drive details</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaPlus className="w-4 h-4" />
          Schedule Drive
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search drives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <FaFilter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Drives</p>
              <p className="text-2xl font-bold text-gray-800">23</p>
            </div>
            <FaBriefcase className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">8</p>
            </div>
            <FaCalendarAlt className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">12</p>
            </div>
            <FaCheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-purple-600">1,215</p>
            </div>
            <FaUsers className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Drives Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company & Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirements</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrives.map((drive) => (
                <tr key={drive.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{drive.logo}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{drive.company}</div>
                        <div className="text-sm text-gray-500">{drive.position}</div>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                          {drive.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium">{drive.date}</div>
                      <div className="text-gray-500">{drive.time}</div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(drive.type)}`}>
                        {drive.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">Min CGPA:</span> {drive.requirements.minCGPA}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Positions:</span> {drive.totalPositions}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {drive.requirements.skills.slice(0, 2).map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {skill}
                          </span>
                        ))}
                        {drive.requirements.skills.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{drive.requirements.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">Registered:</span> {drive.registeredStudents}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Shortlisted:</span> {drive.shortlistedStudents}
                      </div>
                      <div className="text-sm text-gray-500">
                        Package: {drive.package}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(drive.status)}`}>
                      {drive.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlacementDrives;
