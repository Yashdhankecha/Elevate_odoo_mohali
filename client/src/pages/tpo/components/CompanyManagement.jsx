import React, { useState } from 'react';
import { 
  FaBuilding, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaEye, 
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaStar
} from 'react-icons/fa';

const CompanyManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSector, setFilterSector] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const companies = [
    {
      id: 1,
      name: 'Google Inc.',
      logo: 'G',
      sector: 'Technology',
      location: 'Mountain View, CA',
      website: 'google.com',
      phone: '+1-650-253-0000',
      email: 'careers@google.com',
      status: 'Active',
      rating: 4.8,
      requirements: {
        minCGPA: 7.5,
        skills: ['Python', 'Java', 'Algorithms', 'Data Structures'],
        experience: '0-2 years',
        positions: 15
      },
      upcomingDrives: [
        { date: 'Dec 20, 2024', type: 'On-Campus', positions: 5 },
        { date: 'Jan 15, 2025', type: 'Virtual', positions: 10 }
      ],
      totalHires: 23,
      avgPackage: '₹18.5 LPA'
    },
    {
      id: 2,
      name: 'Microsoft Corporation',
      logo: 'M',
      sector: 'Technology',
      location: 'Redmond, WA',
      website: 'microsoft.com',
      phone: '+1-425-882-8080',
      email: 'jobs@microsoft.com',
      status: 'Active',
      rating: 4.6,
      requirements: {
        minCGPA: 7.0,
        skills: ['C#', '.NET', 'Azure', 'SQL'],
        experience: '0-3 years',
        positions: 12
      },
      upcomingDrives: [
        { date: 'Dec 25, 2024', type: 'On-Campus', positions: 8 }
      ],
      totalHires: 18,
      avgPackage: '₹16.2 LPA'
    },
    {
      id: 3,
      name: 'Amazon Web Services',
      logo: 'A',
      sector: 'Technology',
      location: 'Seattle, WA',
      website: 'aws.amazon.com',
      phone: '+1-206-266-1000',
      email: 'aws-jobs@amazon.com',
      status: 'Active',
      rating: 4.7,
      requirements: {
        minCGPA: 7.8,
        skills: ['AWS', 'Python', 'DevOps', 'Cloud Computing'],
        experience: '0-2 years',
        positions: 20
      },
      upcomingDrives: [
        { date: 'Jan 10, 2025', type: 'Virtual', positions: 15 }
      ],
      totalHires: 15,
      avgPackage: '₹20.1 LPA'
    },
    {
      id: 4,
      name: 'Tata Consultancy Services',
      logo: 'T',
      sector: 'IT Services',
      location: 'Mumbai, India',
      website: 'tcs.com',
      phone: '+91-22-6778-9999',
      email: 'careers@tcs.com',
      status: 'Pending',
      rating: 4.2,
      requirements: {
        minCGPA: 6.5,
        skills: ['Java', 'Spring', 'MySQL', 'Agile'],
        experience: '0-1 years',
        positions: 50
      },
      upcomingDrives: [],
      totalHires: 12,
      avgPackage: '₹8.5 LPA'
    },
    {
      id: 5,
      name: 'Infosys Limited',
      logo: 'I',
      sector: 'IT Services',
      location: 'Bangalore, India',
      website: 'infosys.com',
      phone: '+91-80-2852-0261',
      email: 'careers@infosys.com',
      status: 'Review',
      rating: 4.0,
      requirements: {
        minCGPA: 6.0,
        skills: ['Java', 'Python', 'Database', 'Web Technologies'],
        experience: '0-1 years',
        positions: 100
      },
      upcomingDrives: [
        { date: 'Dec 30, 2024', type: 'On-Campus', positions: 30 }
      ],
      totalHires: 8,
      avgPackage: '₹7.2 LPA'
    }
  ];

  const sectors = ['All', 'Technology', 'IT Services', 'Finance', 'Healthcare', 'Manufacturing'];
  const statuses = ['All', 'Active', 'Pending', 'Review', 'Inactive'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Review': return 'bg-blue-100 text-blue-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = filterSector === 'All' || company.sector === filterSector;
    const matchesStatus = filterStatus === 'All' || company.status === filterStatus;
    
    return matchesSearch && matchesSector && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBuilding className="text-purple-600" />
            Company Management
          </h2>
          <p className="text-gray-600">Manage company profiles, requirements, and upcoming drives</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaPlus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
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
              <p className="text-sm text-gray-600">Total Companies</p>
              <p className="text-2xl font-bold text-gray-800">127</p>
            </div>
            <FaBuilding className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Companies</p>
              <p className="text-2xl font-bold text-green-600">89</p>
            </div>
            <FaCheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Drives</p>
              <p className="text-2xl font-bold text-blue-600">23</p>
            </div>
            <FaCalendarAlt className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">4.6</p>
            </div>
            <FaStar className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirements</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upcoming Drives</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{company.logo}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">{company.sector}</div>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                          {company.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">Min CGPA:</span> {company.requirements.minCGPA}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Positions:</span> {company.requirements.positions}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {company.requirements.skills.slice(0, 2).map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {skill}
                          </span>
                        ))}
                        {company.requirements.skills.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{company.requirements.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {company.upcomingDrives.length > 0 ? (
                      <div className="space-y-2">
                        {company.upcomingDrives.map((drive, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium">{drive.date}</div>
                            <div className="text-gray-500">{drive.type} • {drive.positions} positions</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No upcoming drives</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">Total Hires:</span> {company.totalHires}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Avg Package:</span> {company.avgPackage}
                      </div>
                      <div className="flex items-center">
                        <FaStar className={`w-4 h-4 ${getRatingColor(company.rating)}`} />
                        <span className={`text-sm font-medium ml-1 ${getRatingColor(company.rating)}`}>
                          {company.rating}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(company.status)}`}>
                      {company.status}
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

export default CompanyManagement;
