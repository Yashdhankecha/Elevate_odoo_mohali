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
  FaBuilding,
  FaStar,
  FaSpinner,
  FaShieldAlt,
  FaTimes,
  FaExclamationTriangle
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

  const getStatusConfig = (status) => {
    const configs = {
      'Approved': { 
        color: 'from-emerald-500 to-teal-600', 
        bgLight: 'bg-emerald-50', 
        text: 'text-emerald-700', 
        border: 'border-emerald-200',
        label: 'Approved', 
        icon: FaCheckCircle,
        message: 'Your profile has been verified and approved by the placement team.'
      },
      'Rejected': { 
        color: 'from-rose-500 to-pink-600', 
        bgLight: 'bg-rose-50', 
        text: 'text-rose-700', 
        border: 'border-rose-200',
        label: 'Rejected', 
        icon: FaTimesCircle,
        message: 'Your profile needs some changes before it can be approved.'
      },
      'Pending': { 
        color: 'from-amber-500 to-orange-600', 
        bgLight: 'bg-amber-50', 
        text: 'text-amber-700', 
        border: 'border-amber-200',
        label: 'Under Review', 
        icon: FaClock,
        message: 'Your profile is currently being reviewed by the placement team.'
      }
    };
    return configs[status] || configs['Pending'];
  };

  const canApproveReject = () => {
    return ['tpo', 'superadmin'].includes(userRole);
  };

  // --- Premium Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-50 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaShieldAlt className="text-blue-400 text-xl" />
          </div>
        </div>
        <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Verification Data</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="glass-card rounded-[2.5rem] p-12 text-center max-w-lg mx-auto mt-20">
        <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle size={32} className="text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No profile data</h3>
        <p className="text-gray-500 mb-8 text-sm">We couldn't retrieve your profile information at this time.</p>
        <button 
          onClick={loadProfileData}
          className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  const statusCfg = getStatusConfig(profileData.approvalStatus || 'Pending');
  const StatusIcon = statusCfg.icon;

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Status Banner */}
      <div className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${statusCfg.color} shadow-2xl shadow-blue-200/30 p-8 md:p-10`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-16 -mb-16"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
              <FaShieldAlt size={12} />
              <span>Verification Center</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Profile Approval
            </h1>
            <p className="text-white/80 text-sm max-w-md font-medium leading-relaxed">
              {statusCfg.message}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl px-8 py-5 border border-white/20 text-center text-white">
              <StatusIcon className="mx-auto mb-2 text-2xl" />
              <p className="text-lg font-black">{statusCfg.label}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mt-1">Current Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Personal Information Card */}
        <div className="glass-card rounded-[2rem] p-8 border-white/50 hover-lift">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FaUser size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
          </div>
          
          <div className="space-y-5">
            {[
              { icon: FaUser, label: 'Full Name', value: profileData.name, color: 'bg-blue-50 text-blue-500' },
              { icon: FaEnvelope, label: 'Email Address', value: profileData.email, color: 'bg-purple-50 text-purple-500' },
              { icon: FaPhone, label: 'Phone Number', value: profileData.phone, color: 'bg-emerald-50 text-emerald-500' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{item.value || 'Not provided'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Information Card */}
        <div className="glass-card rounded-[2rem] p-8 border-white/50 hover-lift">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <FaGraduationCap size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Academic Information</h3>
          </div>
          
          <div className="space-y-5">
            {[
              { icon: FaGraduationCap, label: 'Branch / Department', value: profileData.student?.branch, color: 'bg-indigo-50 text-indigo-500' },
              { icon: FaBuilding, label: 'College / University', value: profileData.student?.collegeName, color: 'bg-amber-50 text-amber-500' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{item.value || 'Not provided'}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rejection Reason (if rejected) */}
          {profileData.approvalStatus === 'Rejected' && profileData.rejectionReason && (
            <div className="mt-6 p-5 bg-rose-50/50 border border-rose-100 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FaExclamationTriangle className="text-rose-500" size={14} />
                <p className="text-xs font-black text-rose-700 uppercase tracking-widest">Rejection Reason</p>
              </div>
              <p className="text-sm text-rose-600 leading-relaxed italic">{profileData.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Actions (for TPO / admin) */}
      {canApproveReject() && profileData.approvalStatus === 'Pending' && (
        <div className="glass-card rounded-[2rem] p-8 border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <FaShieldAlt size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Verification Actions</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Review and take action on this profile</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleApprove}
              disabled={approving}
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all duration-300"
            >
              {approving ? (
                <FaSpinner className="animate-spin" size={16} />
              ) : (
                <FaThumbsUp size={16} />
              )}
              {approving ? 'Approving...' : 'Approve Profile'}
            </button>
            
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={rejecting}
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-white border-2 border-rose-200 text-rose-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-50 disabled:opacity-50 transition-all duration-300"
            >
              {rejecting ? (
                <FaSpinner className="animate-spin" size={16} />
              ) : (
                <FaThumbsDown size={16} />
              )}
              {rejecting ? 'Rejecting...' : 'Reject Profile'}
            </button>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="glass-morphism bg-white rounded-[2.5rem] max-w-md w-full overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-8 border-b border-gray-100/50">
              <div>
                <h2 className="text-xl font-black text-gray-800">Reject Profile</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Provide justification</p>
              </div>
              <button 
                onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all duration-300"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-gray-500 text-sm leading-relaxed">
                Please provide a clear reason for rejection. This will be shared with the student to help them improve their profile.
              </p>
              
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this profile is being rejected..."
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all duration-300 resize-none"
                rows={4}
              />
              
              <div className="flex gap-4">
                <button
                  onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejecting || !rejectReason.trim()}
                  className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-200 hover:bg-rose-700 disabled:opacity-50 transition-all duration-300"
                >
                  {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileApproval;
