const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TPO = require('../models/TPO');
const Company = require('../models/Company');
const { authenticateToken } = require('../middleware/auth');

// Middleware to check if user is superadmin
const isSuperadmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Superadmin privileges required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get superadmin dashboard overview data
router.get('/overview', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCompanies = await User.countDocuments({ role: 'company' });
    const totalTPOs = await User.countDocuments({ role: 'tpo' });
    const totalInstitutions = await User.countDocuments({ role: 'tpo' }); // Count unique institutions from TPOs
    
    // Get pending approvals (users with isVerified: false)
    const pendingApprovals = await User.countDocuments({ isVerified: false });
    
    // Get recent activities (last 10 user registrations)
    const recentActivities = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('role email createdAt isVerified')
      .lean();

    // Calculate system health (percentage of verified users)
    const systemHealth = totalUsers > 0 ? ((totalUsers - pendingApprovals) / totalUsers * 100).toFixed(1) : 0;

    // Format recent activities
    const formattedActivities = recentActivities.map(activity => {
      let message = '';
      let type = '';
      let status = '';

      if (activity.role === 'tpo') {
        message = `New ${activity.role.toUpperCase()} registration: ${activity.email}`;
        type = 'admin';
        status = activity.isVerified ? 'completed' : 'pending';
      } else if (activity.role === 'company') {
        message = `New company registration: ${activity.email}`;
        type = 'company';
        status = activity.isVerified ? 'completed' : 'pending';
      } else if (activity.role === 'student') {
        message = `New student registration: ${activity.email}`;
        type = 'student';
        status = activity.isVerified ? 'completed' : 'pending';
      }

      return {
        id: activity._id,
        message,
        time: getTimeAgo(activity.createdAt),
        type,
        status
      };
    });

    // Get pending approvals breakdown
    const pendingBreakdown = await User.aggregate([
      { $match: { isVerified: false } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const pendingApprovalsBreakdown = [
      { type: 'Admin', count: pendingBreakdown.find(p => p._id === 'tpo')?.count || 0, priority: 'high' },
      { type: 'Company', count: pendingBreakdown.find(p => p._id === 'company')?.count || 0, priority: 'medium' },
      { type: 'Student', count: pendingBreakdown.find(p => p._id === 'student')?.count || 0, priority: 'low' }
    ];

    const overviewData = {
      stats: [
        {
          title: 'Total Users',
          value: totalUsers.toString(),
          change: '+0%',
          changeType: 'positive',
          icon: 'FaUsers',
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600'
        },
        {
          title: 'Active Companies',
          value: totalCompanies.toString(),
          change: '+0',
          changeType: 'positive',
          icon: 'FaBuilding',
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600'
        },
        {
          title: 'Institutions',
          value: totalInstitutions.toString(),
          change: '+0',
          changeType: 'positive',
          icon: 'FaGraduationCap',
          color: 'bg-purple-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-600'
        },
        {
          title: 'Pending Approvals',
          value: pendingApprovals.toString(),
          change: '+0',
          changeType: 'warning',
          icon: 'FaUserShield',
          color: 'bg-orange-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-600'
        },
        {
          title: 'System Health',
          value: `${systemHealth}%`,
          change: '+0%',
          changeType: 'positive',
          icon: 'FaShieldAlt',
          color: 'bg-indigo-500',
          bgColor: 'bg-indigo-50',
          textColor: 'text-indigo-600'
        },
        {
          title: 'Total Students',
          value: totalStudents.toString(),
          change: '+0',
          changeType: 'positive',
          icon: 'FaDatabase',
          color: 'bg-pink-500',
          bgColor: 'bg-pink-50',
          textColor: 'text-pink-600'
        }
      ],
      recentActivities: formattedActivities,
      pendingApprovals: pendingApprovalsBreakdown
    };

    res.json(overviewData);
  } catch (error) {
    console.error('Error fetching superadmin overview:', error);
    res.status(500).json({ message: 'Failed to fetch overview data' });
  }
});

// Get admin approval requests
router.get('/admin-approvals', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const adminRequests = await User.find({ role: 'tpo', isVerified: false })
      .select('email createdAt')
      .lean();

    const formattedRequests = adminRequests.map((request, index) => {
      // Extract institution name from email domain
      const domain = request.email.split('@')[1];
      const institution = domain ? domain.replace('.ac.in', '').toUpperCase() : 'Unknown Institution';
      
      return {
        id: request._id,
        name: `Admin ${index + 1}`,
        email: request.email,
        phone: '+91-00000-00000',
        institution: institution,
        department: 'Training & Placement',
        designation: 'Training & Placement Officer',
        experience: '0 years',
        education: 'Not specified',
        status: 'pending',
        submittedDate: new Date(request.createdAt).toISOString().split('T')[0],
        documents: ['ID Proof', 'Experience Certificate'],
        reason: 'Need admin access for managing student placements and company interactions',
        priority: 'high'
      };
    });

    res.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching admin approvals:', error);
    res.status(500).json({ message: 'Failed to fetch admin approval requests' });
  }
});

// Get company approval requests
router.get('/company-approvals', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const companyRequests = await User.find({ role: 'company', isVerified: false })
      .select('email createdAt company')
      .lean();

    const formattedRequests = companyRequests.map((request, index) => {
      const companyName = request.company?.companyName || `Company ${index + 1}`;
      
      return {
        id: request._id,
        name: companyName,
        email: request.email,
        phone: request.company?.contactNumber || '+91-00000-00000',
        industry: request.company?.industry || 'Technology',
        size: request.company?.companySize || 'Medium',
        status: 'pending',
        submittedDate: new Date(request.createdAt).toISOString().split('T')[0],
        documents: ['Company Registration', 'Business License'],
        reason: 'Need company access for posting jobs and managing applications',
        priority: 'medium'
      };
    });

    res.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching company approvals:', error);
    res.status(500).json({ message: 'Failed to fetch company approval requests' });
  }
});

// Approve user
router.post('/approve/:userId', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (status === 'approved') {
      user.isVerified = true;
      await user.save();
      res.json({ message: 'User approved successfully' });
    } else if (status === 'rejected') {
      // For rejected users, you might want to delete them or mark them differently
      await User.findByIdAndDelete(userId);
      res.json({ message: 'User rejected and removed' });
    } else {
      res.status(400).json({ message: 'Invalid status' });
    }
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ message: 'Failed to approve user' });
  }
});

// Get institution management data
router.get('/institutions', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const institutions = await User.find({ role: 'tpo' })
      .select('email tpo createdAt isVerified')
      .lean();

    const formattedInstitutions = institutions.map((institution, index) => {
      const domain = institution.email.split('@')[1];
      const name = domain ? domain.replace('.ac.in', '').toUpperCase() : `Institution ${index + 1}`;
      
      return {
        id: institution._id,
        name: name,
        email: institution.email,
        contact: institution.tpo?.contactNumber || '+91-00000-00000',
        location: institution.tpo?.location || 'Not specified',
        status: institution.isVerified ? 'active' : 'pending',
        registeredDate: new Date(institution.createdAt).toISOString().split('T')[0],
        adminCount: 1,
        studentCount: 0 // This would need to be calculated from student registrations
      };
    });

    res.json(formattedInstitutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({ message: 'Failed to fetch institutions' });
  }
});

// Get system settings/analytics
router.get('/system-analytics', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const pendingUsers = await User.countDocuments({ isVerified: false });
    
    const analytics = {
      totalUsers,
      verifiedUsers,
      pendingUsers,
      verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0,
      systemUptime: '99.9%',
      lastBackup: new Date().toISOString(),
      securityStatus: 'Secure'
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching system analytics:', error);
    res.status(500).json({ message: 'Failed to fetch system analytics' });
  }
});

// Get all registered TPOs
router.get('/registered-tpos', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const tpos = await TPO.find()
      .select('-password -emailVerificationOTP -passwordResetToken')
      .sort({ createdAt: -1 })
      .lean();

    res.json(tpos);
  } catch (error) {
    console.error('Error fetching registered TPOs:', error);
    res.status(500).json({ message: 'Failed to fetch registered TPOs' });
  }
});

// Get all registered companies
router.get('/registered-companies', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const companies = await Company.find()
      .select('-password -emailVerificationOTP -passwordResetToken')
      .sort({ createdAt: -1 })
      .lean();

    res.json(companies);
  } catch (error) {
    console.error('Error fetching registered companies:', error);
    res.status(500).json({ message: 'Failed to fetch registered companies' });
  }
});

// Update status of TPO or Company
router.put('/update-status/:id', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, type } = req.body;

    if (!['active', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    let model;
    if (type === 'tpo') {
      model = TPO;
    } else if (type === 'company') {
      model = Company;
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    const updatedItem = await model.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    ).select('-password -emailVerificationOTP -passwordResetToken');

    if (!updatedItem) {
      return res.status(404).json({ message: `${type} not found` });
    }

    res.json({ message: `${type} status updated successfully`, data: updatedItem });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// Get detailed statistics
router.get('/management-stats', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const [tpoStats, companyStats] = await Promise.all([
      TPO.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Company.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const totalTpos = await TPO.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const activeTpos = tpoStats.find(stat => stat._id === 'active')?.count || 0;
    const activeCompanies = companyStats.find(stat => stat._id === 'active')?.count || 0;
    const pendingTpos = tpoStats.find(stat => stat._id === 'pending')?.count || 0;
    const pendingCompanies = companyStats.find(stat => stat._id === 'pending')?.count || 0;

    const stats = {
      tpos: {
        total: totalTpos,
        active: activeTpos,
        pending: pendingTpos,
        rejected: tpoStats.find(stat => stat._id === 'rejected')?.count || 0
      },
      companies: {
        total: totalCompanies,
        active: activeCompanies,
        pending: pendingCompanies,
        rejected: companyStats.find(stat => stat._id === 'rejected')?.count || 0
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching management stats:', error);
    res.status(500).json({ message: 'Failed to fetch management statistics' });
  }
});

// Helper function to get time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
}

module.exports = router;

