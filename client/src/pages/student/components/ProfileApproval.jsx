import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaThumbsUp, 
  FaThumbsDown,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaStar,
  FaSpinner
} from 'react-icons/fa';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

const ProfileApproval = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    loadProfileData();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || '');
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileResponse, approvalResponse] = await Promise.all([
        studentApi.getProfile(),
        studentApi.getProfileApprovalStatus()
      ]);
      
      if (profileResponse.success && approvalResponse.success) {
        setProfileData({
          ...profileResponse.data,
          ...approvalResponse.data
        });
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setApproving(true);
      const response = await studentApi.approveProfile(profileData._id || profileData.id);
      
      if (response.success) {
        setProfileData(prev => ({
          ...prev,
          approvalStatus: 'Approved',
          approvedAt: new Date().toISOString()
        }));
        toast.success('Profile approved successfully!');
      }
    } catch (error) {
      console.error('Error approving profile:', error);
      toast.error('Failed to approve profile');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setRejecting(true);
      const response = await studentApi.rejectProfile(profileData._id || profileData.id, rejectReason);
      
      if (response.success) {
        setProfileData(prev => ({
          ...prev,
          approvalStatus: 'Rejected',
          rejectedAt: new Date().toISOString(),
          rejectionReason: rejectReason
        }));
        toast.success('Profile rejected');
        setShowRejectModal(false);
        setRejectReason('');
      }
    } catch (error) {
      console.error('Error rejecting profile:', error);
      toast.error('Failed to reject profile');
    } finally {
      setRejecting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <FaCheckCircle className="w-5 h-5" />;
      case 'Rejected': return <FaTimesCircle className="w-5 h-5" />;
      case 'Pending': return <FaClock className="w-5 h-5" />;
      default: return <FaClock className="w-5 h-5" />;
    }
  };

  const canApproveReject = () => {
    return ['tpo', 'superadmin'].includes(userRole);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <FaSpinner className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading profile data...</span>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Profile Approval Status</h2>
            <p className="text-gray-600">Review and manage profile approval</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(profileData.approvalStatus || 'Pending')}`}>
            {getStatusIcon(profileData.approvalStatus || 'Pending')}
            <span className="font-medium">{profileData.approvalStatus || 'Pending'}</span>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaUser className="w-5 h-5" />
          Profile Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Personal Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaUser className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{profileData.name || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{profileData.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{profileData.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Academic Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaGraduationCap className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {profileData.student?.branch || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaGraduationCap className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {profileData.student?.collegeName || 'Not provided'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Actions */}
      {canApproveReject() && profileData.approvalStatus === 'Pending' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Approval Actions</h3>
          <div className="flex gap-4">
            <button
              onClick={handleApprove}
              disabled={approving}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {approving ? (
                <FaSpinner className="w-4 h-4 animate-spin" />
              ) : (
                <FaThumbsUp className="w-4 h-4" />
              )}
              {approving ? 'Approving...' : 'Approve Profile'}
            </button>
            
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={rejecting}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {rejecting ? (
                <FaSpinner className="w-4 h-4 animate-spin" />
              ) : (
                <FaThumbsDown className="w-4 h-4" />
              )}
              {rejecting ? 'Rejecting...' : 'Reject Profile'}
            </button>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reject Profile</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this profile:</p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejecting || !rejectReason.trim()}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rejecting ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileApproval;
