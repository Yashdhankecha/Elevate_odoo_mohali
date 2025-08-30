import React, { useState } from 'react';
import { 
  FaBuilding, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaCheck, 
  FaTimes,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUsers
} from 'react-icons/fa';

const InstitutionManagement = () => {
  const [institutions, setInstitutions] = useState([
    {
      id: 1,
      name: 'TechCorp Solutions',
      type: 'Company',
      status: 'Active',
      location: 'Bangalore, India',
      contact: '+91 9876543210',
      email: 'hr@techcorp.com',
      employees: '500-1000',
      industry: 'Information Technology',
      joinedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'DataFlow Analytics',
      type: 'Company',
      status: 'Pending',
      location: 'Mumbai, India',
      contact: '+91 9876543211',
      email: 'contact@dataflow.com',
      employees: '100-500',
      industry: 'Data Analytics',
      joinedDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'InnovateTech',
      type: 'Company',
      status: 'Active',
      location: 'Delhi, India',
      contact: '+91 9876543212',
      email: 'info@innovatetech.com',
      employees: '1000+',
      industry: 'Software Development',
      joinedDate: '2023-11-10'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  const handleEdit = (institution) => {
    setSelectedInstitution(institution);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedInstitution(null);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'inactive':
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
          <h1 className="text-2xl font-bold text-gray-800">Institution Management</h1>
          <p className="text-gray-600">Manage companies and institutions on the platform</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Add Institution
        </button>
      </div>

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions.map((institution) => (
          <div key={institution.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{institution.name}</h3>
                <p className="text-sm text-gray-600">{institution.industry}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(institution.status)}`}>
                {institution.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaMapMarkerAlt className="w-4 h-4" />
                {institution.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaPhone className="w-4 h-4" />
                {institution.contact}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaEnvelope className="w-4 h-4" />
                {institution.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaUsers className="w-4 h-4" />
                {institution.employees} employees
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleEdit(institution)}
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

      {/* Institution Modal */}
      {showModal && (
        <InstitutionModal 
          institution={selectedInstitution} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

// Institution Modal Component
const InstitutionModal = ({ institution, onClose }) => {
  const [formData, setFormData] = useState({
    name: institution?.name || '',
    type: institution?.type || 'Company',
    status: institution?.status || 'Pending',
    location: institution?.location || '',
    contact: institution?.contact || '',
    email: institution?.email || '',
    employees: institution?.employees || '',
    industry: institution?.industry || '',
    joinedDate: institution?.joinedDate || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Institution data:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {institution ? 'Edit Institution' : 'Add Institution'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Institution name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Company">Company</option>
                <option value="University">University</option>
                <option value="Institute">Institute</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Industry"
              />
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
                placeholder="City, Country"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contact number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee Count</label>
              <input
                type="text"
                value={formData.employees}
                onChange={(e) => setFormData({...formData, employees: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 100-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              {institution ? 'Update Institution' : 'Add Institution'}
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

export default InstitutionManagement;
