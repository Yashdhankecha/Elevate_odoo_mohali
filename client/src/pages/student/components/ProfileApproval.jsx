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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="relative w-16 h-16 border-4 border-slate-50 flex items-center justify-center rounded overflow-hidden">
          <div className="absolute inset-0 bg-slate-800 animate-pulse h-1 origin-bottom"></div>
          <FaShieldAlt className="text-slate-300" size={24} />
        </div>
        <p className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Verification Data</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-white border border-slate-200 shadow-sm rounded p-12 text-center max-w-lg mx-auto mt-20">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-6 rounded">
          <FaExclamationTriangle size={24} className="text-amber-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">No profile data</h3>
        <p className="text-slate-500 mb-8 text-sm">We couldn't retrieve your profile information at this time.</p>
        <button 
          onClick={loadProfileData}
          className="px-6 py-3 bg-slate-900 text-white rounded font-bold shadow-sm hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs"
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
      <div className={`relative overflow-hidden rounded bg-white border ${statusCfg.border} shadow-sm p-8 md:p-10`}>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest`}>
              <FaShieldAlt size={12} />
              <span>Verification Center</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              Profile Approval
            </h1>
            <p className="text-slate-500 text-sm max-w-md leading-relaxed">
              {statusCfg.message}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`bg-slate-50 border border-slate-200 rounded px-6 py-4 text-center ${statusCfg.text}`}>
              <StatusIcon className="mx-auto mb-2 text-2xl" />
              <p className="text-lg font-bold">{statusCfg.label}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">Current Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Personal Information Card */}
        <div className="bg-white border border-slate-200 rounded p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-slate-50 border border-slate-200 text-slate-700 rounded flex items-center justify-center shrink-0">
              <FaUser size={16} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
          </div>
          
          <div className="space-y-5">
            {[
              { icon: FaUser, label: 'Full Name', value: profileData.name },
              { icon: FaEnvelope, label: 'Email Address', value: profileData.email },
              { icon: FaPhone, label: 'Phone Number', value: profileData.phone },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded hover:border-slate-200 transition-colors">
                  <div className={`w-10 h-10 bg-white border border-slate-200 text-slate-500 rounded flex items-center justify-center flex-shrink-0`}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{item.value || 'Not provided'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Information Card */}
        <div className="bg-white border border-slate-200 rounded p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-slate-50 border border-slate-200 text-slate-700 rounded flex items-center justify-center shrink-0">
              <FaGraduationCap size={16} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Academic Information</h3>
          </div>
          
          <div className="space-y-5">
            {[
              { icon: FaGraduationCap, label: 'Branch / Department', value: profileData.student?.branch },
              { icon: FaBuilding, label: 'College / University', value: profileData.student?.collegeName },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded hover:border-slate-200 transition-colors">
                  <div className={`w-10 h-10 bg-white border border-slate-200 text-slate-500 rounded flex items-center justify-center flex-shrink-0`}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{item.value || 'Not provided'}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rejection Reason (if rejected) */}
          {profileData.approvalStatus === 'Rejected' && profileData.rejectionReason && (
            <div className="mt-6 p-5 bg-rose-50 border border-rose-200 rounded">
              <div className="flex items-center gap-2 mb-2">
                <FaExclamationTriangle className="text-rose-600" size={14} />
                <p className="text-xs font-bold text-rose-700 uppercase tracking-widest">Rejection Reason</p>
              </div>
              <p className="text-sm text-rose-600 leading-relaxed italic">{profileData.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Actions (for TPO / admin) */}
      {canApproveReject() && profileData.approvalStatus === 'Pending' && (
        <div className="bg-white border border-slate-200 rounded p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-50 border border-slate-200 text-slate-700 rounded flex items-center justify-center shrink-0">
              <FaShieldAlt size={16} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Verification Actions</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Review and take action on this profile</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleApprove}
              disabled={approving}
              className="flex-1 flex items-center justify-center gap-3 py-3 bg-emerald-600 text-white rounded font-bold uppercase tracking-widest text-xs shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {approving ? (
                <FaSpinner className="animate-spin" size={14} />
              ) : (
                <FaThumbsUp size={14} />
              )}
              {approving ? 'Approving...' : 'Approve Profile'}
            </button>
            
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={rejecting}
              className="flex-1 flex items-center justify-center gap-3 py-3 bg-white border border-slate-200 text-rose-600 rounded font-bold uppercase tracking-widest text-xs hover:bg-rose-50 disabled:opacity-50 transition-colors shadow-sm"
            >
              {rejecting ? (
                <FaSpinner className="animate-spin" size={14} />
              ) : (
                <FaThumbsDown size={14} />
              )}
              {rejecting ? 'Rejecting...' : 'Reject Profile'}
            </button>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white border border-slate-200 rounded shadow-sm max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-slate-50 p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Reject Profile</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Provide justification</p>
              </div>
              <button 
                onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-slate-500 text-sm leading-relaxed">
                Please provide a clear reason for rejection. This will be shared with the student to help them improve their profile.
              </p>
              
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this profile is being rejected..."
                className="w-full bg-white border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors resize-none placeholder:text-slate-400"
                rows={4}
              />
              
              <div className="flex gap-4">
                <button
                  onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejecting || !rejectReason.trim()}
                  className="flex-1 py-3 bg-rose-600 text-white rounded font-bold uppercase tracking-widest text-xs shadow-sm hover:bg-rose-700 disabled:opacity-50 transition-colors"
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
