import React, { useState } from 'react';
import { 
  FaBuilding, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaIndustry,
  FaUsers,
  FaCalendarAlt,
  FaDownload,
  FaSort,
  FaStar
} from 'react-icons/fa';

const CompanyApproval = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSector, setFilterSector] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const companyRequests = [
    {
      id: 1,
      name: 'TechCorp Solutions',
      email: 'hr@techcorp.com',
      phone: '+91-98765-43210',
      website: 'www.techcorp.com',
      sector: 'Technology',
      industry: 'Software Development',
      location: 'Bangalore, Karnataka',
      founded: '2015',
      employees: '500-1000',
      revenue: '₹50-100 Cr',
      status: 'pending',
      submittedDate: '2024-12-15',
      documents: ['Company Registration', 'GST Certificate', 'PAN Card', 'Bank Statement'],
      reason: 'Looking to hire fresh graduates for software development roles',
      priority: 'high',
      rating: 4.2,
      description: 'Leading software development company specializing in enterprise solutions'
    },
    {
      id: 2,
      name: 'InnovateTech Systems',
      email: 'careers@innovatetech.com',
      phone: '+91-87654-32109',
      website: 'www.innovatetech.com',
      sector: 'Technology',
      industry: 'Artificial Intelligence',
      location: 'Hyderabad, Telangana',
      founded: '2018',
      employees: '200-500',
      revenue: '₹20-50 Cr',
      status: 'pending',
      submittedDate: '2024-12-14',
      documents: ['Company Registration', 'GST Certificate', 'PAN Card'],
      reason: 'Seeking talented engineers for AI/ML projects',
      priority: 'medium',
      rating: 4.0,
      description: 'AI-focused technology company developing cutting-edge solutions'
    },
    {
      id: 3,
      name: 'Global Finance Ltd',
      email: 'recruitment@globalfinance.com',
      phone: '+91-76543-21098',
      website: 'www.globalfinance.com',
      sector: 'Finance',
      industry: 'Banking & Financial Services',
      location: 'Mumbai, Maharashtra',
      founded: '2010',
      employees: '1000+',
      revenue: '₹500+ Cr',
      status: 'approved',
      submittedDate: '2024-12-10',
      documents: ['Company Registration', 'GST Certificate', 'PAN Card', 'Bank Statement', 'Audit Reports'],
      reason: 'Regular campus recruitment for various banking roles',
      priority: 'high',
      rating: 4.5,
      description: 'Established financial services company with nationwide presence'
    },
    {
      id: 4,
      name: 'Green Energy Solutions',
      email: 'hr@greenenergy.com',
      phone: '+91-65432-10987',
      website: 'www.greenenergy.com',
      sector: 'Energy',
      industry: 'Renewable Energy',
      location: 'Chennai, Tamil Nadu',
      founded: '2020',
      employees: '100-200',
      revenue: '₹10-20 Cr',
      status: 'rejected',
      submittedDate: '2024-12-08',
      documents: ['Company Registration', 'GST Certificate'],
      reason: 'Hiring engineers for solar energy projects',
      priority: 'low',
      rating: 3.8,
      description: 'Startup focused on renewable energy solutions'
    }
  ];

  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];
  const sectors = ['All', 'Technology', 'Finance', 'Energy', 'Healthcare', 'Manufacturing', 'Consulting'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSectorColor = (sector) => {
    switch (sector) {
      case 'Technology': return 'bg-blue-100 text-blue-700';
      case 'Finance': return 'bg-green-100 text-green-700';
      case 'Energy': return 'bg-yellow-100 text-yellow-700';
      case 'Healthcare': return 'bg-red-100 text-red-700';
      case 'Manufacturing': return 'bg-purple-100 text-purple-700';
      case 'Consulting': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredCompanies = companyRequests.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || company.status === filterStatus.toLowerCase();
    const matchesSector = filterSector === 'All' || company.sector === filterSector;
    
    return matchesSearch && matchesStatus && matchesSector;
  });

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const handleApprove = (companyId) => {
    // Handle approval logic
    console.log('Approving company:', companyId);
  };

  const handleReject = (companyId) => {
    // Handle rejection logic
    console.log('Rejecting company:', companyId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBuilding className="text-purple-600" />
            Company Approval Management
          </h2>
          <p className="text-gray-600">Review and approve company registration requests for campus recruitment</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FaDownload className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by company name, sector, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FaFilter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Company Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    Company Details
                    <FaSort className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sector & Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <FaBuilding className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">{company.email}</div>
                        <div className="text-sm text-gray-500">{company.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSectorColor(company.sector)}`}>
                        {company.sector}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">{company.industry}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{company.location}</div>
                      <div className="text-sm text-gray-500">{company.employees} employees</div>
                      <div className="text-sm text-gray-500">Est. {company.founded}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(company.status)}`}>
                      {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(company.priority)}`}>
                      {company.priority.charAt(0).toUpperCase() + company.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.submittedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(company)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      {company.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(company.id)}
                            className="text-green-600 hover:text-green-900 p-1"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(company.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Details Modal */}
      {showModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Company Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Company Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Company Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company Name</label>
                      <p className="text-gray-800">{selectedCompany.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Website</label>
                      <p className="text-gray-800">{selectedCompany.website}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-800">{selectedCompany.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-800">{selectedCompany.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Business Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Sector</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSectorColor(selectedCompany.sector)}`}>
                        {selectedCompany.sector}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Industry</label>
                      <p className="text-gray-800">{selectedCompany.industry}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Location</label>
                      <p className="text-gray-800">{selectedCompany.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Founded</label>
                      <p className="text-gray-800">{selectedCompany.founded}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Employees</label>
                      <p className="text-gray-800">{selectedCompany.employees}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Revenue</label>
                      <p className="text-gray-800">{selectedCompany.revenue}</p>
                    </div>
                  </div>
                </div>

                {/* Company Description */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Company Description</h4>
                  <p className="text-gray-800">{selectedCompany.description}</p>
                </div>

                {/* Request Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Request Details</h4>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Reason for Registration</label>
                    <p className="text-gray-800 mt-1">{selectedCompany.reason}</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600">Submitted Documents</label>
                    <div className="mt-2 space-y-1">
                      {selectedCompany.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FaDownload className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedCompany.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleApprove(selectedCompany.id);
                        setShowModal(false);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCheck className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedCompany.id);
                        setShowModal(false);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTimes className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyApproval;
