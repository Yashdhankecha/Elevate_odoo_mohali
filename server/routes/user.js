const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/user/students
// @desc    Get all students for dashboard
// @access  Private (TPO and Company roles)
router.get('/students', authenticateToken, async (req, res) => {
  try {
    // Check if user has permission to view students
    if (req.user.role !== 'tpo' && req.user.role !== 'company') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only TPOs and Companies can view student data.'
      });
    }

    // Get query parameters for filtering
    const { 
      branch, 
      graduationYear, 
      isPlaced, 
      minCGPA, 
      maxCGPA,
      skills,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { role: 'student' };
    
    if (branch) filter['student.branch'] = branch;
    if (graduationYear) filter['student.graduationYear'] = parseInt(graduationYear);
    if (isPlaced !== undefined) filter['student.isPlaced'] = isPlaced === 'true';
    if (minCGPA) filter['student.cgpa'] = { $gte: parseFloat(minCGPA) };
    if (maxCGPA) filter['student.cgpa'] = { ...filter['student.cgpa'], $lte: parseFloat(maxCGPA) };
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim());
      filter['student.skills.name'] = { $in: skillArray };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get students with pagination
    const students = await User.find(filter)
      .select('-password -emailVerificationOTP -passwordResetToken')
      .sort({ 'student.cgpa': -1, 'student.name': 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalStudents = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalStudents / parseInt(limit));

    // Calculate statistics
    const stats = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          placedStudents: { $sum: { $cond: ['$student.isPlaced', 1, 0] } },
          avgCGPA: { $avg: '$student.cgpa' },
          avgProfileCompletion: { $avg: '$student.profileCompletion' }
        }
      }
    ]);

    // Branch-wise statistics
    const branchStats = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $group: {
          _id: '$student.branch',
          count: { $sum: 1 },
          placedCount: { $sum: { $cond: ['$student.isPlaced', 1, 0] } },
          avgCGPA: { $avg: '$student.cgpa' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        students,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalStudents,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        },
        statistics: stats[0] || {
          totalStudents: 0,
          placedStudents: 0,
          avgCGPA: 0,
          avgProfileCompletion: 0
        },
        branchStats
      }
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   GET /api/user/students/:id
// @desc    Get specific student details
// @access  Private (TPO, Company, and the student themselves)
router.get('/students/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user has permission to view this student
    if (req.user.role === 'student' && req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own profile.'
      });
    }

    const student = await User.findOne({ _id: id, role: 'student' })
      .select('-password -emailVerificationOTP -passwordResetToken');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   GET /api/user/applications
// @desc    Get current student's applications
// @access  Private (Student only)
router.get('/applications', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can view their applications.'
      });
    }

    const student = req.user.student;
    const applications = student.applications || [];

    res.json({
      success: true,
      data: {
        applications,
        totalApplications: applications.length,
        statusCounts: {
          applied: applications.filter(app => app.status === 'Applied').length,
          underReview: applications.filter(app => app.status === 'Under Review').length,
          shortlisted: applications.filter(app => app.status === 'Shortlisted').length,
          interviewScheduled: applications.filter(app => app.status === 'Interview Scheduled').length,
          interviewCompleted: applications.filter(app => app.status === 'Interview Completed').length,
          selected: applications.filter(app => app.status === 'Selected').length,
          rejected: applications.filter(app => app.status === 'Rejected').length,
          withdrawn: applications.filter(app => app.status === 'Withdrawn').length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   GET /api/user/student-stats
// @desc    Get current student's placement statistics
// @access  Private (Student only)
router.get('/student-stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can view their statistics.'
      });
    }

    const student = req.user.student;
    const applications = student.applications || [];
    const skills = student.skills || [];
    const projects = student.projects || [];
    const internships = student.internships || [];
    const certifications = student.certifications || [];

    const stats = {
      profileCompletion: student.profileCompletion || 0,
      cgpa: student.cgpa || 0,
      semester: student.semester || 0,
      branch: student.branch || '',
      graduationYear: student.graduationYear || 0,
      isPlaced: student.isPlaced || false,
      totalApplications: applications.length,
      totalSkills: skills.length,
      totalProjects: projects.length,
      totalInternships: internships.length,
      totalCertifications: certifications.length,
      placementDetails: student.placementDetails || null,
      applicationStatusBreakdown: {
        applied: applications.filter(app => app.status === 'Applied').length,
        underReview: applications.filter(app => app.status === 'Under Review').length,
        shortlisted: applications.filter(app => app.status === 'Shortlisted').length,
        interviewScheduled: applications.filter(app => app.status === 'Interview Scheduled').length,
        interviewCompleted: applications.filter(app => app.status === 'Interview Completed').length,
        selected: applications.filter(app => app.status === 'Selected').length,
        rejected: applications.filter(app => app.status === 'Rejected').length,
        withdrawn: applications.filter(app => app.status === 'Withdrawn').length
      },
      skillBreakdown: {
        beginner: skills.filter(skill => skill.proficiency === 'Beginner').length,
        intermediate: skills.filter(skill => skill.proficiency === 'Intermediate').length,
        advanced: skills.filter(skill => skill.proficiency === 'Advanced').length,
        expert: skills.filter(skill => skill.proficiency === 'Expert').length
      }
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   GET /api/user/skill-progress
// @desc    Get current student's skill progress
// @access  Private (Student only)
router.get('/skill-progress', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can view their skill progress.'
      });
    }

    const student = req.user.student;
    const skills = student.skills || [];

    // Generate skill progress data based on proficiency levels
    const skillProgress = skills.map(skill => {
      let progress = 0;
      switch (skill.proficiency) {
        case 'Beginner': progress = 25; break;
        case 'Intermediate': progress = 50; break;
        case 'Advanced': progress = 75; break;
        case 'Expert': progress = 100; break;
        default: progress = 0;
      }
      return {
        name: skill.name,
        proficiency: skill.proficiency,
        progress: progress
      };
    });

    // Add some default skills if student has none
    if (skillProgress.length === 0) {
      skillProgress.push(
        { name: 'Data Structures & Algorithms', proficiency: 'Beginner', progress: 25 },
        { name: 'System Design', proficiency: 'Beginner', progress: 20 },
        { name: 'Database Management', proficiency: 'Beginner', progress: 30 },
        { name: 'Web Development', proficiency: 'Beginner', progress: 40 }
      );
    }

    res.json({
      success: true,
      data: skillProgress
    });

  } catch (error) {
    console.error('Error fetching skill progress:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   GET /api/user/practice-history
// @desc    Get current student's practice session history
// @access  Private (Student only)
router.get('/practice-history', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can view their practice history.'
      });
    }

    // Generate mock practice history data (in real app, this would come from a separate collection)
    const practiceHistory = [
      { topic: 'Arrays & Strings', accuracy: 95, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { topic: 'Probability', accuracy: 87, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { topic: 'Graphs', accuracy: 91, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { topic: 'Dynamic Programming', accuracy: 78, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { topic: 'Trees', accuracy: 88, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }
    ];

    res.json({
      success: true,
      data: practiceHistory
    });

  } catch (error) {
    console.error('Error fetching practice history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   GET /api/user/achievements
// @desc    Get current student's achievements and certifications
// @access  Private (Student only)
router.get('/achievements', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can view their achievements.'
      });
    }

    const student = req.user.student;
    const achievements = student.achievements || [];
    const certifications = student.certifications || [];

    res.json({
      success: true,
      data: {
        achievements,
        certifications,
        totalAchievements: achievements.length,
        totalCertifications: certifications.length
      }
    });

  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   GET /api/user/experience
// @desc    Get current student's projects and internships
// @access  Private (Student only)
router.get('/experience', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can view their experience.'
      });
    }

    const student = req.user.student;
    const projects = student.projects || [];
    const internships = student.internships || [];

    res.json({
      success: true,
      data: {
        projects,
        internships,
        totalProjects: projects.length,
        totalInternships: internships.length
      }
    });

  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   GET /api/user/alerts
// @desc    Get current student's smart alerts and notifications
// @access  Private (Student only)
router.get('/alerts', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can view their alerts.'
      });
    }

    const student = req.user.student;
    const applications = student.applications || [];

    // Generate smart alerts based on student data
    const alerts = [];

    // Check for upcoming interviews
    const upcomingInterviews = applications.filter(app => 
      app.status === 'Interview Scheduled' && 
      app.interviewRounds && 
      app.interviewRounds.some(round => 
        round.status === 'Scheduled' && 
        new Date(round.date) > new Date()
      )
    );

    upcomingInterviews.forEach(app => {
      const nextInterview = app.interviewRounds.find(round => 
        round.status === 'Scheduled' && 
        new Date(round.date) > new Date()
      );
      if (nextInterview) {
        const daysUntil = Math.ceil((new Date(nextInterview.date) - new Date()) / (1000 * 60 * 60 * 24));
        alerts.push({
          type: 'interview',
          priority: daysUntil <= 1 ? 'high' : 'medium',
          title: `Interview with ${app.companyName}`,
          message: `Your ${nextInterview.type} interview is scheduled for ${new Date(nextInterview.date).toLocaleDateString()}`,
          action: 'Prepare Now',
          actionUrl: `/applications/${app.jobId}`,
          date: nextInterview.date
        });
      }
    });

    // Check for application deadlines (mock data)
    if (applications.length < 5) {
      alerts.push({
        type: 'application',
        priority: 'medium',
        title: 'Increase Your Applications',
        message: 'You have applied to only ' + applications.length + ' companies. Consider applying to more positions to increase your chances.',
        action: 'Browse Jobs',
        actionUrl: '/jobs',
        date: new Date()
      });
    }

    // Check for profile completion
    if (student.profileCompletion < 80) {
      alerts.push({
        type: 'profile',
        priority: 'low',
        title: 'Complete Your Profile',
        message: `Your profile is only ${student.profileCompletion}% complete. Complete it to increase your chances of getting selected.`,
        action: 'Complete Profile',
        actionUrl: '/profile',
        date: new Date()
      });
    }

    // Check for skill gaps
    const skills = student.skills || [];
    if (skills.length < 3) {
      alerts.push({
        type: 'skills',
        priority: 'medium',
        title: 'Add More Skills',
        message: 'You have listed only ' + skills.length + ' skills. Add more relevant skills to improve your profile.',
        action: 'Add Skills',
        actionUrl: '/profile',
        date: new Date()
      });
    }

    res.json({
      success: true,
      data: {
        alerts,
        totalAlerts: alerts.length,
        priorityCounts: {
          high: alerts.filter(alert => alert.priority === 'high').length,
          medium: alerts.filter(alert => alert.priority === 'medium').length,
          low: alerts.filter(alert => alert.priority === 'low').length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   GET /api/user/performance-analytics
// @desc    Get current student's performance analytics
// @access  Private (Student only)
router.get('/performance-analytics', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can view their analytics.'
      });
    }

    const student = req.user.student;
    const applications = student.applications || [];

    // Calculate success rates
    const totalApplications = applications.length;
    const selectedApplications = applications.filter(app => app.status === 'Selected').length;
    const interviewApplications = applications.filter(app => 
      ['Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected'].includes(app.status)
    ).length;

    const successRate = totalApplications > 0 ? Math.round((selectedApplications / totalApplications) * 100) : 0;
    const interviewRate = totalApplications > 0 ? Math.round((interviewApplications / totalApplications) * 100) : 0;

    // Generate monthly performance data (mock data for now)
    const monthlyData = [
      { month: 'Jan', value: 60 },
      { month: 'Feb', value: 65 },
      { month: 'Mar', value: 70 },
      { month: 'Apr', value: 75 },
      { month: 'May', value: 78 },
      { month: 'Jun', value: 82 }
    ];

    // Generate application status distribution
    const statusDistribution = [
      { name: 'Successful', value: selectedApplications, color: '#34d399' },
      { name: 'In Progress', value: interviewApplications - selectedApplications, color: '#fbbf24' },
      { name: 'Rejected', value: totalApplications - interviewApplications, color: '#f87171' }
    ];

    const analytics = {
      successRate,
      interviewRate,
      totalApplications,
      selectedApplications,
      interviewApplications,
      monthlyData,
      statusDistribution,
      metrics: {
        testPassRate: Math.min(95, 85 + Math.floor(Math.random() * 20)),
        interviewSuccess: Math.min(90, 70 + Math.floor(Math.random() * 20)),
        avgResponseTime: Math.floor(Math.random() * 10) + 10,
        profileRating: (4.0 + Math.random() * 1.0).toFixed(1)
      }
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching performance analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   PUT /api/user/student-profile
// @desc    Update current student's profile
// @access  Private (Student only)
router.put('/student-profile', [
  authenticateToken,
  body('name').optional().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phoneNumber').optional().matches(/^[+]?[\d\s\-\(\)]+$/).withMessage('Please enter a valid phone number'),
  body('address').optional().isObject().withMessage('Address must be an object'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('expectedPackage').optional().isObject().withMessage('Expected package must be an object'),
  body('workMode').optional().isIn(['On-site', 'Remote', 'Hybrid', 'Any']).withMessage('Invalid work mode')
], async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can update their profile.'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updateFields = {};
    const studentUpdateFields = {};

    // Update basic user fields
    if (req.body.profilePicture) {
      updateFields.profilePicture = req.body.profilePicture;
    }

    // Update student-specific fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'profilePicture' && req.body[key] !== undefined) {
        studentUpdateFields[key] = req.body[key];
      }
    });

    // Update user
    if (Object.keys(updateFields).length > 0) {
      Object.assign(req.user, updateFields);
    }

    // Update student data
    if (Object.keys(studentUpdateFields).length > 0) {
      Object.assign(req.user.student, studentUpdateFields);
    }

    // Recalculate profile completion
    req.user.student.calculateProfileCompletion();

    await req.user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        user: req.user,
        profileCompletion: req.user.student.profileCompletion
      }
    });

  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   GET /api/user/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  authenticateToken,
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('profilePicture')
    .optional()
    .isURL()
    .withMessage('Profile picture must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, profilePicture } = req.body;
    const updateFields = {};

    // Check if username is being updated and if it's unique
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
      updateFields.username = username;
    }

    if (profilePicture) {
      updateFields.profilePicture = profilePicture;
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   PUT /api/user/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', [
  authenticateToken,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isPasswordValid = await req.user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    res.json({
      success: true,
      message: 'Password changed successfully!'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   DELETE /api/user/account
// @desc    Delete user account
// @access  Private
router.delete('/account', [
  authenticateToken,
  body('password').notEmpty().withMessage('Password is required for account deletion')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { password } = req.body;

    // Verify password
    const isPasswordValid = await req.user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully!'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

module.exports = router;
