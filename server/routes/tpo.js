const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const TPO = require('../models/TPO');
const Company = require('../models/Company');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const Notification = require('../models/Notification');

const router = express.Router();

// Middleware to check if user is TPO
const isTPO = (req, res, next) => {
  if (req.user.role !== 'tpo') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only TPOs can access this resource.'
    });
  }
  next();
};

// @route   GET /api/tpo/dashboard-stats
// @desc    Get TPO dashboard statistics
// @access  Private (TPO only)
router.get('/dashboard-stats', authenticateToken, isTPO, async (req, res) => {
  try {
    // Get TPO's institute
    const tpo = await TPO.findById(req.user._id);
    if (!tpo) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found'
      });
    }

    // Get students from TPO's institute
    const students = await User.find({ 
      role: 'student',
      'student.instituteName': tpo.instituteName 
    });

    // Get companies that have posted jobs
    const companies = await Company.find({ status: 'active' });

    // Get job applications for students from this institute
    const studentIds = students.map(student => student._id);
    const applications = await JobApplication.find({
      student: { $in: studentIds }
    }).populate('job company student');

    // Calculate statistics
    const totalStudents = students.length;
    const placedStudents = students.filter(student => student.student?.isPlaced).length;
    const activeCompanies = companies.length;
    const totalApplications = applications.length;
    const totalOffers = applications.filter(app => app.status === 'accepted').length;
    
    // Calculate average package
    const placedStudentsWithPackage = students.filter(student => 
      student.student?.isPlaced && student.student?.package
    );
    const averagePackage = placedStudentsWithPackage.length > 0 
      ? placedStudentsWithPackage.reduce((sum, student) => sum + (student.student.package || 0), 0) / placedStudentsWithPackage.length
      : 0;

    // Calculate placement rate
    const placementRate = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;

    // Get recent activities (last 10 notifications)
    const recentActivities = await Notification.find({
      recipient: req.user._id
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('sender', 'name email');

    // Get upcoming placement drives (jobs with future dates)
    const upcomingDrives = await Job.find({
      deadline: { $gte: new Date() },
      status: 'active'
    })
    .populate('company', 'name')
    .sort({ deadline: 1 })
    .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalStudents,
          placedStudents,
          activeCompanies,
          totalApplications,
          totalOffers,
          averagePackage: Math.round(averagePackage * 100) / 100,
          placementRate: Math.round(placementRate * 10) / 10,
          upcomingDrives: upcomingDrives.length
        },
        recentActivities: recentActivities.map(activity => ({
          id: activity._id,
          message: activity.message,
          time: activity.createdAt,
          type: activity.type
        })),
        upcomingDrives: upcomingDrives.map(drive => ({
          id: drive._id,
          title: drive.title,
          company: drive.company.name,
          deadline: drive.deadline,
          applications: drive.applications?.length || 0
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching TPO dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// @route   GET /api/tpo/students
// @desc    Get all students for TPO's institute
// @access  Private (TPO only)
router.get('/students', authenticateToken, isTPO, async (req, res) => {
  try {
    const { 
      search, 
      department, 
      status, 
      minCGPA, 
      maxCGPA,
      page = 1, 
      limit = 10 
    } = req.query;

    // Get TPO's institute
    const tpo = await TPO.findById(req.user._id);
    if (!tpo) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found'
      });
    }

    // Build filter
    const filter = { 
      role: 'student',
      'student.instituteName': tpo.instituteName 
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'student.rollNo': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (department && department !== 'All') {
      filter['student.department'] = department;
    }

    if (status && status !== 'All') {
      if (status === 'Placed') {
        filter['student.isPlaced'] = true;
      } else if (status === 'Not Placed') {
        filter['student.isPlaced'] = false;
      }
    }

    if (minCGPA) {
      filter['student.cgpa'] = { $gte: parseFloat(minCGPA) };
    }

    if (maxCGPA) {
      filter['student.cgpa'] = { 
        ...filter['student.cgpa'], 
        $lte: parseFloat(maxCGPA) 
      };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get students
    const students = await User.find(filter)
      .select('-password -emailVerificationOTP -passwordResetToken')
      .sort({ 'student.cgpa': -1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalStudents = await User.countDocuments(filter);

    // Get application counts for each student
    const studentsWithApplications = await Promise.all(
      students.map(async (student) => {
        const applications = await JobApplication.find({ student: student._id });
        const acceptedApplications = applications.filter(app => app.status === 'accepted');
        
        return {
          ...student.toObject(),
          applications: applications.length,
          offers: acceptedApplications.length
        };
      })
    );

    res.json({
      success: true,
      data: {
        students: studentsWithApplications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalStudents / parseInt(limit)),
          totalStudents,
          hasNext: skip + students.length < totalStudents,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
});

// @route   GET /api/tpo/companies
// @desc    Get all companies for TPO
// @access  Private (TPO only)
router.get('/companies', authenticateToken, isTPO, async (req, res) => {
  try {
    const { 
      search, 
      status, 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get companies
    const companies = await Company.find(filter)
      .select('-password -emailVerificationOTP -passwordResetToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalCompanies = await Company.countDocuments(filter);

    // Get job counts for each company
    const companiesWithJobs = await Promise.all(
      companies.map(async (company) => {
        const jobs = await Job.find({ company: company._id });
        const activeJobs = jobs.filter(job => job.status === 'active');
        
        return {
          ...company.toObject(),
          totalJobs: jobs.length,
          activeJobs: activeJobs.length
        };
      })
    );

    res.json({
      success: true,
      data: {
        companies: companiesWithJobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCompanies / parseInt(limit)),
          totalCompanies,
          hasNext: skip + companies.length < totalCompanies,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies'
    });
  }
});

// @route   GET /api/tpo/placement-drives
// @desc    Get placement drives for TPO
// @access  Private (TPO only)
router.get('/placement-drives', authenticateToken, isTPO, async (req, res) => {
  try {
    const { 
      search, 
      status, 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get jobs
    const jobs = await Job.find(filter)
      .populate('company', 'companyName email')
      .sort({ deadline: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalJobs = await Job.countDocuments(filter);

    // Get application counts for each job
    const jobsWithApplications = await Promise.all(
      jobs.map(async (job) => {
        const applications = await JobApplication.find({ job: job._id });
        const acceptedApplications = applications.filter(app => app.status === 'accepted');
        
        return {
          ...job.toObject(),
          totalApplications: applications.length,
          acceptedApplications: acceptedApplications.length
        };
      })
    );

    res.json({
      success: true,
      data: {
        placementDrives: jobsWithApplications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalJobs / parseInt(limit)),
          totalJobs,
          hasNext: skip + jobs.length < totalJobs,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching placement drives:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch placement drives'
    });
  }
});

// @route   GET /api/tpo/training-programs
// @desc    Get training programs for TPO
// @access  Private (TPO only)
router.get('/training-programs', authenticateToken, isTPO, async (req, res) => {
  try {
    // For now, return mock data since training programs model doesn't exist
    const trainingPrograms = [
      {
        id: 1,
        name: 'Technical Interview Preparation',
        description: 'Comprehensive training for technical interviews',
        duration: '4 weeks',
        participants: 45,
        status: 'Active',
        startDate: '2024-01-15',
        endDate: '2024-02-15'
      },
      {
        id: 2,
        name: 'Soft Skills Development',
        description: 'Communication and leadership skills training',
        duration: '3 weeks',
        participants: 32,
        status: 'Active',
        startDate: '2024-01-20',
        endDate: '2024-02-10'
      }
    ];

    res.json({
      success: true,
      data: {
        trainingPrograms
      }
    });
  } catch (error) {
    console.error('Error fetching training programs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch training programs'
    });
  }
});

// @route   GET /api/tpo/internship-records
// @desc    Get internship records for TPO
// @access  Private (TPO only)
router.get('/internship-records', authenticateToken, isTPO, async (req, res) => {
  try {
    // Get TPO's institute
    const tpo = await TPO.findById(req.user._id);
    if (!tpo) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found'
      });
    }

    // Get students from TPO's institute
    const students = await User.find({ 
      role: 'student',
      'student.instituteName': tpo.instituteName 
    });

    // Get internship applications
    const studentIds = students.map(student => student._id);
    const internshipApplications = await JobApplication.find({
      student: { $in: studentIds },
      'job.type': 'internship'
    })
    .populate('student', 'name student.rollNo student.department')
    .populate('job', 'title company')
    .populate('company', 'companyName');

    res.json({
      success: true,
      data: {
        internshipRecords: internshipApplications.map(app => ({
          id: app._id,
          studentName: app.student.name,
          rollNo: app.student.student.rollNo,
          department: app.student.student.department,
          company: app.company.companyName,
          position: app.job.title,
          status: app.status,
          appliedDate: app.createdAt,
          startDate: app.job.startDate,
          endDate: app.job.endDate
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching internship records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internship records'
    });
  }
});

// @route   GET /api/tpo/reports-analytics
// @desc    Get reports and analytics for TPO
// @access  Private (TPO only)
router.get('/reports-analytics', authenticateToken, isTPO, async (req, res) => {
  try {
    // Get TPO's institute
    const tpo = await TPO.findById(req.user._id);
    if (!tpo) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found'
      });
    }

    // Get students from TPO's institute
    const students = await User.find({ 
      role: 'student',
      'student.instituteName': tpo.instituteName 
    });

    // Get applications
    const studentIds = students.map(student => student._id);
    const applications = await JobApplication.find({
      student: { $in: studentIds }
    }).populate('job company student');

    // Calculate analytics
    const totalStudents = students.length;
    const placedStudents = students.filter(student => student.student?.isPlaced).length;
    const placementRate = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;

    // Department-wise statistics
    const departmentStats = {};
    students.forEach(student => {
      const dept = student.student?.department || 'Unknown';
      if (!departmentStats[dept]) {
        departmentStats[dept] = { total: 0, placed: 0 };
      }
      departmentStats[dept].total++;
      if (student.student?.isPlaced) {
        departmentStats[dept].placed++;
      }
    });

    // Company-wise statistics
    const companyStats = {};
    applications.forEach(app => {
      const companyName = app.company?.companyName || 'Unknown';
      if (!companyStats[companyName]) {
        companyStats[companyName] = { applications: 0, offers: 0 };
      }
      companyStats[companyName].applications++;
      if (app.status === 'accepted') {
        companyStats[companyName].offers++;
      }
    });

    // Monthly placement trends (last 12 months)
    const monthlyTrends = [];
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthlyPlacements = applications.filter(app => 
        app.status === 'accepted' &&
        app.updatedAt >= date &&
        app.updatedAt <= monthEnd
      ).length;

      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        placements: monthlyPlacements
      });
    }

    res.json({
      success: true,
      data: {
        overview: {
          totalStudents,
          placedStudents,
          placementRate: Math.round(placementRate * 10) / 10,
          totalApplications: applications.length,
          totalOffers: applications.filter(app => app.status === 'accepted').length
        },
        departmentStats: Object.entries(departmentStats).map(([dept, stats]) => ({
          department: dept,
          total: stats.total,
          placed: stats.placed,
          rate: Math.round((stats.placed / stats.total) * 1000) / 10
        })),
        companyStats: Object.entries(companyStats).map(([company, stats]) => ({
          company,
          applications: stats.applications,
          offers: stats.offers,
          successRate: Math.round((stats.offers / stats.applications) * 1000) / 10
        })),
        monthlyTrends
      }
    });
  } catch (error) {
    console.error('Error fetching reports and analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports and analytics'
    });
  }
});

// @route   PUT /api/tpo/profile
// @desc    Update TPO profile
// @access  Private (TPO only)
router.put('/profile', authenticateToken, isTPO, [
  body('name').optional().isLength({ min: 2, max: 50 }),
  body('contactNumber').optional().matches(/^[+]?[\d\s\-\(\)]+$/),
  body('designation').optional().isLength({ min: 2, max: 50 }),
  body('department').optional().isLength({ min: 2, max: 50 }),
  body('address').optional().isObject()
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

    const tpo = await TPO.findById(req.user._id);
    if (!tpo) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found'
      });
    }

    // Update fields
    const updateFields = ['name', 'contactNumber', 'designation', 'department', 'address'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        tpo[field] = req.body[field];
      }
    });

    await tpo.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: tpo
    });
  } catch (error) {
    console.error('Error updating TPO profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

module.exports = router;
