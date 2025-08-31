const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { tpoInstituteAccess, verifyStudentInstitute, buildInstituteFilter, verifyBulkInstituteAccess } = require('../middleware/tpoInstituteAccess');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const JobPosting = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const Notification = require('../models/Notification');
const Interview = require('../models/Interview'); // Added Interview model

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
router.get('/dashboard-stats', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
  try {
    // Get TPO's institute name
    const tpoInstitute = req.tpoInstitute || 'Chandigarh University';
    
    // Get students from TPO's institute
    const students = await User.find({ 
      role: 'student',
      'student.collegeName': tpoInstitute 
    });

    // Get companies that have posted jobs
    let companies = [];
    try {
      companies = await Company.find({ status: 'active' });
    } catch (error) {
      console.log('No companies found or error in query:', error.message);
      companies = [];
    }

    // Get job applications for students from this institute
    const studentIds = students.map(student => student._id);
    let applications = [];
    try {
      applications = await JobApplication.find({
        student: { $in: studentIds }
      }).populate('job company student');
    } catch (error) {
      console.log('No job applications found or error in query:', error.message);
      applications = [];
    }

    // Calculate statistics
    const totalStudents = students.length;
    const placedStudents = students.filter(student => student.student?.placementInfo?.isPlaced).length;
    const activeCompanies = companies.length;
    const totalApplications = applications.length;
    const totalOffers = applications.filter(app => app.status === 'accepted').length;
    
    // Calculate average package
    const placedStudentsWithPackage = students.filter(student => 
      student.student?.placementInfo?.isPlaced && student.student?.placementInfo?.placementPackage
    );
    const averagePackage = placedStudentsWithPackage.length > 0 
      ? placedStudentsWithPackage.reduce((sum, student) => {
          const packageStr = student.student.placementInfo.placementPackage;
          const packageNum = parseFloat(packageStr.replace(/[^\d.]/g, '')) || 0;
          return sum + packageNum;
        }, 0) / placedStudentsWithPackage.length
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

    // Get upcoming placement drives (job postings with future dates)
    let upcomingDrives = [];
    try {
      upcomingDrives = await JobPosting.find({
        deadline: { $gte: new Date() },
        isActive: true
      })
      .populate('company', 'companyName')
      .sort({ deadline: 1 })
      .limit(5);
    } catch (error) {
      console.log('No upcoming drives found or error in query:', error.message);
      upcomingDrives = [];
    }

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
          company: drive.company?.companyName || 'Unknown Company',
          deadline: drive.deadline,
          applications: drive.applicationCount || 0
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching TPO dashboard stats:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// @route   GET /api/tpo/students
// @desc    Get all students for TPO's institute
// @access  Private (TPO only)
router.get('/students', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
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

    // Build filter using helper function
    const filter = buildInstituteFilter(req.tpoInstitute);

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'student.rollNumber': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (department && department !== 'All') {
      filter['student.branch'] = department;
    }

    if (status && status !== 'All') {
      if (status === 'Placed') {
        filter['student.placementInfo.isPlaced'] = true;
      } else if (status === 'Not Placed') {
        filter['student.placementInfo.isPlaced'] = false;
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
        const acceptedApplications = applications.filter(app => app.status === 'offer_received');
        
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

// @route   POST /api/tpo/students
// @desc    Add a new student to TPO's institute
// @access  Private (TPO only)
router.post('/students', authenticateToken, isTPO, tpoInstituteAccess, [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('rollNumber').notEmpty().withMessage('Roll number is required'),
  body('branch').notEmpty().withMessage('Branch is required'),
  body('cgpa').isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10')
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

    const {
      name,
      email,
      rollNumber,
      branch,
      cgpa,
      phoneNumber,
      graduationYear,
      skills,
      isPlaced,
      package: packageAmount,
      companyName,
      jobTitle
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if roll number already exists in the institute
    const existingRollNo = await User.findOne({
      'student.rollNumber': rollNumber,
      'student.collegeName': req.tpoInstitute
    });
    if (existingRollNo) {
      return res.status(400).json({
        success: false,
        message: 'Roll number already exists in this institute'
      });
    }

    // Create new student
    const newStudent = new User({
      name,
      email,
      phoneNumber,
      role: 'student',
      status: 'active',
      isVerified: true,
      student: {
        name,
        rollNumber,
        branch,
        cgpa: parseFloat(cgpa),
        collegeName: req.tpoInstitute,
        graduationYear: graduationYear || new Date().getFullYear(),
        skills: skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [],
        isPlaced: isPlaced || false,
        placementDetails: isPlaced ? {
          company: companyName,
          package: { amount: packageAmount ? parseFloat(packageAmount) : 0, currency: "INR", type: "CTC" },
          role: jobTitle,
          placementDate: new Date()
        } : null,
        phoneNumber
      }
    });

    await newStudent.save();

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: {
        student: {
          _id: newStudent._id,
          name: newStudent.name,
          email: newStudent.email,
          student: newStudent.student
        }
      }
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add student'
    });
  }
});

// @route   PUT /api/tpo/students/:id
// @desc    Update student information
// @access  Private (TPO only)
router.put('/students/:id', authenticateToken, isTPO, verifyStudentInstitute, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const student = req.student; // Already verified by middleware

    // Update student data
    if (updateData.name) student.name = updateData.name;
    if (updateData.email) student.email = updateData.email;
    if (updateData.phoneNumber) student.student.phoneNumber = updateData.phoneNumber;
    
    if (updateData.student) {
      if (updateData.student.rollNumber) student.student.rollNumber = updateData.student.rollNumber;
      if (updateData.student.branch) student.student.branch = updateData.student.branch;
      if (updateData.student.cgpa) student.student.cgpa = parseFloat(updateData.student.cgpa);
      if (updateData.student.graduationYear) student.student.graduationYear = updateData.student.graduationYear;
      if (updateData.student.skills) student.student.skills = updateData.student.skills;
      if (updateData.student.isPlaced !== undefined) student.student.isPlaced = updateData.student.isPlaced;
      if (updateData.student.placementDetails) student.student.placementDetails = updateData.student.placementDetails;
    }

    await student.save();

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: {
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          student: student.student
        }
      }
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student'
    });
  }
});

// @route   DELETE /api/tpo/students/:id
// @desc    Delete a student
// @access  Private (TPO only)
router.delete('/students/:id', authenticateToken, isTPO, verifyStudentInstitute, async (req, res) => {
  try {
    const { id } = req.params;
    const student = req.student; // Already verified by middleware

    // Delete student
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student'
    });
  }
});

// @route   GET /api/tpo/companies
// @desc    Get list of companies for dropdown
// @access  Private (TPO only)
router.get('/companies', authenticateToken, isTPO, async (req, res) => {
  try {
    const { search } = req.query;
    
    // Build filter
    const filter = { role: 'company' };
    
    if (search) {
      filter.$or = [
        { 'company.companyName': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const companies = await User.find(filter)
      .select('_id company.companyName company.industry email')
      .sort({ 'company.companyName': 1 });

    res.json({
      success: true,
      companies: companies.map(company => ({
        _id: company._id,
        companyName: company.company?.companyName,
        industry: company.company?.industry,
        email: company.email
      }))
    });
  } catch (error) {
    console.error('Error fetching companies list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies list'
    });
  }
});





// @route   GET /api/tpo/internship-records
// @desc    Get internship records for TPO
// @access  Private (TPO only)
router.get('/internship-records', authenticateToken, isTPO, async (req, res) => {
  try {
    // Get TPO's institute from user document
    const tpoUser = await User.findById(req.user._id);
    if (!tpoUser || !tpoUser.tpo) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found'
      });
    }

    // Get students from TPO's institute
    const students = await User.find({ 
      role: 'student',
      'student.instituteName': tpoUser.tpo.instituteName 
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
    // Get TPO's institute from user document
    const tpoUser = await User.findById(req.user._id);
    if (!tpoUser || !tpoUser.tpo) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found'
      });
    }

    // Get students from TPO's institute
    const students = await User.find({ 
      role: 'student',
      'student.collegeName': tpoUser.tpo.instituteName 
    });

    // Get applications
    const studentIds = students.map(student => student._id);
    const applications = await JobApplication.find({
      student: { $in: studentIds }
    }).populate('jobPosting company student');

    // Calculate analytics
    const totalStudents = students.length;
    const placedStudents = students.filter(student => student.student?.placementInfo?.isPlaced).length;
    const placementRate = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;

    // Department-wise statistics
    const departmentStats = {};
    students.forEach(student => {
      const dept = student.student?.branch || 'Unknown';
      if (!departmentStats[dept]) {
        departmentStats[dept] = { total: 0, placed: 0 };
      }
      departmentStats[dept].total++;
      if (student.student?.placementInfo?.isPlaced) {
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
      if (app.status === 'offer_received') {
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
        app.status === 'offer_received' &&
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
          totalOffers: applications.filter(app => app.status === 'offer_received').length
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

    const tpoUser = await User.findById(req.user._id);
    if (!tpoUser || !tpoUser.tpo) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found'
      });
    }

    // Update fields
    const updateFields = ['name', 'contactNumber', 'designation', 'department', 'address'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'name' || field === 'contactNumber') {
          tpoUser[field] = req.body[field];
        } else {
          tpoUser.tpo[field] = req.body[field];
        }
      }
    });

    await tpoUser.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: tpoUser
    });
  } catch (error) {
    console.error('Error updating TPO profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @route   PUT /api/tpo/students/:studentId/placement
// @desc    Update student placement status
// @access  Private (TPO only)
router.put('/students/:studentId/placement', authenticateToken, isTPO, verifyStudentInstitute, [
  body('isPlaced').optional().isBoolean(),
  body('package').optional().isNumeric(),
  body('companyName').optional().isLength({ min: 2, max: 100 }),
  body('jobTitle').optional().isLength({ min: 2, max: 100 }),
  body('placementDate').optional().isISO8601()
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

    const student = req.student; // Already verified by middleware

    // Update student placement information
    if (req.body.isPlaced !== undefined) {
      student.student.isPlaced = req.body.isPlaced;
    }
    if (req.body.package !== undefined || req.body.companyName !== undefined || req.body.jobTitle !== undefined) {
      student.student.placementDetails = {
        company: req.body.companyName || student.student.placementDetails?.company,
        package: { 
          amount: req.body.package || student.student.placementDetails?.package?.amount || 0, 
          currency: "INR", 
          type: "CTC" 
        },
        role: req.body.jobTitle || student.student.placementDetails?.role,
        placementDate: req.body.placementDate ? new Date(req.body.placementDate) : student.student.placementDetails?.placementDate || new Date()
      };
    }

    await student.save();

    res.json({
      success: true,
      message: 'Student placement information updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error updating student placement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student placement'
    });
  }
});

// @route   GET /api/tpo/students/:studentId/applications
// @desc    Get student's job applications
// @access  Private (TPO only)
router.get('/students/:studentId/applications', authenticateToken, isTPO, verifyStudentInstitute, async (req, res) => {
  try {
    const applications = await JobApplication.find({ student: req.params.studentId })
      .populate('jobPosting', 'title company deadline')
      .populate('company', 'companyName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        applications: applications.map(app => ({
          id: app._id,
          jobTitle: app.jobPosting?.title || 'N/A',
          companyName: app.company?.companyName || 'N/A',
          status: app.status,
          appliedDate: app.createdAt,
          deadline: app.jobPosting?.deadline || 'N/A'
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching student applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student applications'
    });
  }
});

// @route   PUT /api/tpo/companies/:companyId/status
// @desc    Update company status
// @access  Private (TPO only)
router.put('/companies/:companyId/status', authenticateToken, isTPO, [
  body('status').isIn(['active', 'inactive', 'pending']).withMessage('Invalid status')
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

    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    company.status = req.body.status;
    await company.save();

    res.json({
      success: true,
      message: 'Company status updated successfully',
      data: company
    });
  } catch (error) {
    console.error('Error updating company status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update company status'
    });
  }
});



// @route   POST /api/tpo/notifications
// @desc    Create notification for students
// @access  Private (TPO only)
router.post('/notifications', authenticateToken, isTPO, [
  body('title').isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('message').isLength({ min: 10, max: 500 }).withMessage('Message must be between 10 and 500 characters'),
  body('type').isIn(['info', 'success', 'warning', 'error']).withMessage('Invalid notification type'),
  body('recipients').optional().isArray().withMessage('Recipients must be an array'),
  body('department').optional().isString().withMessage('Department must be a string')
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

    // Get TPO's institute from user document
    const tpoUser = await User.findById(req.user._id);
    if (!tpoUser || !tpoUser.tpo) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found'
      });
    }

    // Build recipient filter
    let recipientFilter = { 
      role: 'student',
      'student.instituteName': tpoUser.tpo.instituteName 
    };

    if (req.body.department && req.body.department !== 'All') {
      recipientFilter['student.department'] = req.body.department;
    }

    if (req.body.recipients && req.body.recipients.length > 0) {
      recipientFilter._id = { $in: req.body.recipients };
    }

    // Get students to notify
    const students = await User.find(recipientFilter);

    // Create notifications for each student
    const notifications = students.map(student => ({
      recipient: student._id,
      sender: req.user._id,
      title: req.body.title,
      message: req.body.message,
      type: req.body.type,
      actionLink: req.body.actionLink || null
    }));

    await Notification.insertMany(notifications);

    res.json({
      success: true,
      message: `Notification sent to ${students.length} students`,
      data: {
        sentCount: students.length
      }
    });
  } catch (error) {
    console.error('Error creating notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notifications'
    });
  }
});

// @route   GET /api/tpo/export/students
// @desc    Export student data for TPO
// @access  Private (TPO only)
router.get('/export/students', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
  try {
    // Get students from TPO's institute
    const students = await User.find({ 
      role: 'student',
      'student.collegeName': req.tpoInstitute 
    }).select('-password -emailVerificationOTP -passwordResetToken');

    // Get application counts for each student
    const studentsWithApplications = await Promise.all(
      students.map(async (student) => {
        const applications = await JobApplication.find({ student: student._id });
        const acceptedApplications = applications.filter(app => app.status === 'accepted');
        
        return {
          name: student.name,
          email: student.email,
          rollNumber: student.student?.rollNumber || 'N/A',
          branch: student.student?.branch || 'N/A',
          cgpa: student.student?.cgpa || 'N/A',
          isPlaced: student.student?.isPlaced || false,
          package: student.student?.placementDetails?.package?.amount || 'N/A',
          companyName: student.student?.placementDetails?.company || 'N/A',
          jobTitle: student.student?.placementDetails?.role || 'N/A',
          totalApplications: applications.length,
          acceptedApplications: acceptedApplications.length,
          phoneNumber: student.student?.phoneNumber || 'N/A'
        };
      })
    );

    res.json({
      success: true,
      data: {
        students: studentsWithApplications,
        exportDate: new Date().toISOString(),
        totalStudents: studentsWithApplications.length,
        placedStudents: studentsWithApplications.filter(s => s.isPlaced).length,
        placementRate: studentsWithApplications.length > 0 
          ? (studentsWithApplications.filter(s => s.isPlaced).length / studentsWithApplications.length * 100).toFixed(2)
          : 0
      }
    });
  } catch (error) {
    console.error('Error exporting student data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export student data'
    });
  }
});

// @route   PUT /api/tpo/students/bulk-update
// @desc    Bulk update students
// @access  Private (TPO only)
router.put('/students/bulk-update', authenticateToken, isTPO, tpoInstituteAccess, [
  body('studentIds').isArray().withMessage('Student IDs must be an array'),
  body('updateData').isObject().withMessage('Update data must be an object')
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

    const { studentIds, updateData } = req.body;

    // Verify all students belong to TPO's institute
    try {
      await verifyBulkInstituteAccess(studentIds, req.tpoInstitute);
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    // Update students
    const result = await User.updateMany(
      {
        _id: { $in: studentIds },
        role: 'student',
        'student.collegeName': req.tpoInstitute
      },
      { $set: updateData }
    );

    res.json({
      success: true,
      message: `Updated ${result.modifiedCount} students successfully`,
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error bulk updating students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk update students'
    });
  }
});

// @route   GET /api/tpo/activity-feed
// @desc    Get activity feed for TPO
// @access  Private (TPO only)
router.get('/activity-feed', authenticateToken, isTPO, async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;

    // Get TPO's institute from user document
    const tpoUser = await User.findById(req.user._id);
    if (!tpoUser || !tpoUser.tpo) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found'
      });
    }

    // Get recent activities
    const activities = await Notification.find({
      recipient: req.user._id
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .populate('sender', 'name email');

    const totalActivities = await Notification.countDocuments({
      recipient: req.user._id
    });

    res.json({
      success: true,
      data: {
        activities: activities.map(activity => ({
          id: activity._id,
          title: activity.title,
          message: activity.message,
          type: activity.type,
          createdAt: activity.createdAt,
          isRead: activity.isRead,
          sender: activity.sender ? {
            name: activity.sender.name,
            email: activity.sender.email
          } : null
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalActivities / parseInt(limit)),
          totalActivities,
          hasNext: (parseInt(page) * parseInt(limit)) < totalActivities,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity feed'
    });
  }
});

// @route   GET /api/tpo/placement-trends
// @desc    Get placement trends for TPO
// @access  Private (TPO only)
router.get('/placement-trends', authenticateToken, isTPO, async (req, res) => {
  try {
    const { period = '12' } = req.query; // months

    // Get TPO's institute from user document
    const tpoUser = await User.findById(req.user._id);
    if (!tpoUser || !tpoUser.tpo) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found'
      });
    }

    // Get students from TPO's institute
    const students = await User.find({ 
      role: 'student',
      'student.instituteName': tpoUser.tpo.instituteName 
    });

    // Get applications
    const studentIds = students.map(student => student._id);
    const applications = await JobApplication.find({
      student: { $in: studentIds }
    }).populate('job company student');

    // Calculate trends for the specified period
    const trends = [];
    const currentDate = new Date();
    
    for (let i = parseInt(period) - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthlyApplications = applications.filter(app => 
        app.createdAt >= date && app.createdAt <= monthEnd
      );
      
      const monthlyPlacements = applications.filter(app => 
        app.status === 'accepted' &&
        app.updatedAt >= date && 
        app.updatedAt <= monthEnd
      );

      trends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        applications: monthlyApplications.length,
        placements: monthlyPlacements.length,
        successRate: monthlyApplications.length > 0 
          ? (monthlyPlacements.length / monthlyApplications.length * 100).toFixed(1)
          : 0
      });
    }

    res.json({
      success: true,
      data: {
        trends,
        period: parseInt(period)
      }
    });
  } catch (error) {
    console.error('Error fetching placement trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch placement trends'
    });
  }
});

// @route   POST /api/tpo/students/:studentId/verify
// @desc    Verify a student's profile and documents
// @access  Private (TPO only)
router.post('/students/:studentId/verify', authenticateToken, isTPO, verifyStudentInstitute, [
  body('verificationStatus').isIn(['verified', 'pending', 'rejected']).withMessage('Invalid verification status'),
  body('verificationNotes').optional().isString().withMessage('Verification notes must be a string')
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

    const { verificationStatus, verificationNotes } = req.body;
    const student = req.student; // Already verified by middleware

    // Update student verification status
    student.student.verificationStatus = verificationStatus;
    if (verificationNotes) {
      student.student.verificationNotes = verificationNotes;
    }
    student.student.verifiedBy = req.user._id;
    student.student.verifiedAt = new Date();

    await student.save();

    // Create notification for student
    const notification = new Notification({
      recipient: student._id,
      sender: req.user._id,
      title: `Profile ${verificationStatus === 'verified' ? 'Verified' : verificationStatus === 'rejected' ? 'Rejected' : 'Under Review'}`,
      message: `Your profile has been ${verificationStatus} by the TPO. ${verificationNotes ? `Notes: ${verificationNotes}` : ''}`,
      type: verificationStatus === 'verified' ? 'achievement' : verificationStatus === 'rejected' ? 'admin' : 'general'
    });
    await notification.save();

    res.json({
      success: true,
      message: `Student profile ${verificationStatus} successfully`,
      data: {
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          verificationStatus: student.student.verificationStatus,
          verificationNotes: student.student.verificationNotes
        }
      }
    });
  } catch (error) {
    console.error('Error verifying student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify student'
    });
  }
});

// @route   GET /api/tpo/students/verification-status
// @desc    Get students with their verification status
// @access  Private (TPO only)
router.get('/students/verification-status', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = buildInstituteFilter(req.tpoInstitute);
    
    if (status && status !== 'All') {
      filter['student.verificationStatus'] = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get students with verification status
    const students = await User.find(filter)
      .select('name email student.rollNumber student.branch student.verificationStatus student.verificationNotes student.verifiedAt')
      .sort({ 'student.verificationStatus': 1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalStudents = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        students: students.map(student => ({
          _id: student._id,
          name: student.name,
          email: student.email,
          rollNumber: student.student?.rollNumber,
          branch: student.student?.branch,
          verificationStatus: student.student?.verificationStatus || 'pending',
          verificationNotes: student.student?.verificationNotes,
          verifiedAt: student.student?.verifiedAt
        })),
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
    console.error('Error fetching student verification status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student verification status'
    });
  }
});

// @route   PUT /api/tpo/students/:id/approve
// @desc    Approve student profile
// @access  Private (TPO only)
router.put('/students/:id/approve', authenticateToken, isTPO, verifyStudentInstitute, async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update student approval status
    student.approvalStatus = 'Approved';
    student.approvedAt = new Date();
    student.approvedBy = req.user._id;
    await student.save();

    // Create notification for student
    const notification = new Notification({
      recipient: student._id,
      sender: req.user._id,
      title: 'Profile Approved',
      message: 'Your profile has been approved by the TPO.',
      type: 'achievement'
    });
    await notification.save();

    res.json({
      success: true,
      message: 'Student profile approved successfully',
      data: student
    });
  } catch (error) {
    console.error('Error approving student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve student profile'
    });
  }
});

// @route   PUT /api/tpo/students/:id/reject
// @desc    Reject student profile
// @access  Private (TPO only)
router.put('/students/:id/reject', authenticateToken, isTPO, verifyStudentInstitute, async (req, res) => {
  try {
    const { reason } = req.body;
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update student approval status
    student.approvalStatus = 'Rejected';
    student.rejectedAt = new Date();
    student.rejectedBy = req.user._id;
    student.rejectionReason = reason;
    await student.save();

    // Create notification for student
    const notification = new Notification({
      recipient: student._id,
      sender: req.user._id,
      title: 'Profile Rejected',
      message: `Your profile has been rejected. Reason: ${reason}`,
      type: 'admin'
    });
    await notification.save();

    res.json({
      success: true,
      message: 'Student profile rejected',
      data: student
    });
  } catch (error) {
    console.error('Error rejecting student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject student profile'
    });
  }
});

// @route   PUT /api/tpo/students/bulk-approve
// @desc    Bulk approve student profiles
// @access  Private (TPO only)
router.put('/students/bulk-approve', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
  try {
    const { studentIds } = req.body;
    
    if (!studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({
        success: false,
        message: 'Student IDs array is required'
      });
    }

    // Verify all students belong to TPO's institute
    try {
      await verifyBulkInstituteAccess(studentIds, req.tpoInstitute);
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    // Update all students
    const result = await User.updateMany(
      {
        _id: { $in: studentIds },
        role: 'student',
        'student.collegeName': req.tpoInstitute
      },
      {
        $set: {
          approvalStatus: 'Approved',
          approvedAt: new Date(),
          approvedBy: req.user._id
        }
      }
    );

    res.json({
      success: true,
      message: `Approved ${result.modifiedCount} student profiles successfully`,
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error bulk approving students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve student profiles'
    });
  }
});

// @route   GET /api/tpo/internship-offers
// @desc    Get internship offers for TPO
// @access  Private (TPO only)
router.get('/internship-offers', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {
      type: 'internship'
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'company.companyName': { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      filter.isActive = status === 'active';
    }

    // Get internships with pagination
    const internships = await JobPosting.find(filter)
      .populate('company', 'companyName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalInternships = await JobPosting.countDocuments(filter);
    const totalPages = Math.ceil(totalInternships / limit);

    res.json({
      success: true,
      data: {
        internships,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalInternships,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching internship offers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internship offers'
    });
  }
});

// @route   POST /api/tpo/internship-offers
// @desc    Create new internship offer
// @access  Private (TPO only)
router.post('/internship-offers', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
  try {
    const internshipData = {
      ...req.body,
      type: 'internship',
      createdBy: req.user._id,
      createdAt: new Date()
    };

    const internship = new JobPosting(internshipData);
    await internship.save();

    res.json({
      success: true,
      message: 'Internship offer created successfully',
      data: internship
    });
  } catch (error) {
    console.error('Error creating internship offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create internship offer'
    });
  }
});

// @route   PUT /api/tpo/internship-offers/:id
// @desc    Update internship offer
// @access  Private (TPO only)
router.put('/internship-offers/:id', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const internship = await JobPosting.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship offer not found'
      });
    }

    res.json({
      success: true,
      message: 'Internship offer updated successfully',
      data: internship
    });
  } catch (error) {
    console.error('Error updating internship offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update internship offer'
    });
  }
});

// @route   DELETE /api/tpo/internship-offers/:id
// @desc    Delete internship offer
// @access  Private (TPO only)
router.delete('/internship-offers/:id', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
  try {
    const { id } = req.params;

    const internship = await JobPosting.findByIdAndDelete(id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship offer not found'
      });
    }

    res.json({
      success: true,
      message: 'Internship offer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting internship offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete internship offer'
    });
  }
});

// @route   GET /api/tpo/internship-offers/:id/applications
// @desc    Get applications for specific internship
// @access  Private (TPO only)
router.get('/internship-offers/:id/applications', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
  try {
    const { id } = req.params;

    const applications = await JobApplication.find({
      jobPosting: id
    })
    .populate('student', 'name email student.rollNo student.department')
    .populate('company', 'companyName')
    .sort({ appliedDate: -1 });

    res.json({
      success: true,
      data: {
        applications: applications.map(app => ({
          id: app._id,
          studentName: app.student.name,
          studentEmail: app.student.email,
          rollNo: app.student.student?.rollNo,
          department: app.student.student?.department,
          status: app.status,
          appliedDate: app.appliedDate,
          company: app.company?.companyName
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching internship applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internship applications'
    });
  }
});

// @route   GET /api/tpo/interviews
// @desc    Get all interviews for TPO's institute
// @access  Private (TPO only)
router.get('/interviews', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
  try {
    const { 
      search, 
      status, 
      type, 
      dateFrom, 
      dateTo,
      page = 1, 
      limit = 10 
    } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { candidate: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { interviewer: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (type && type !== 'All') {
      filter.type = type;
    }

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get interviews
    const interviews = await Interview.find(filter)
      .populate('company', 'company.companyName email')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalInterviews = await Interview.countDocuments(filter);

    res.json({
      success: true,
      data: {
        interviews: interviews.map(interview => ({
          _id: interview._id,
          candidate: interview.candidate,
          role: interview.role,
          date: interview.date,
          time: interview.time,
          type: interview.type,
          status: interview.status,
          interviewer: interview.interviewer,
          location: interview.location,
          duration: interview.duration,
          notes: interview.notes,
          feedback: interview.feedback,
          rating: interview.rating,
          result: interview.result,
          company: interview.company ? {
            _id: interview.company._id,
            companyName: interview.company.company?.companyName || 'Unknown Company',
            email: interview.company.email
          } : null,
          createdAt: interview.createdAt,
          updatedAt: interview.updatedAt
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalInterviews / parseInt(limit)),
          totalInterviews,
          hasNext: skip + interviews.length < totalInterviews,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interviews'
    });
  }
});

// @route   POST /api/tpo/interviews
// @desc    Create a new interview
// @access  Private (TPO only)
router.post('/interviews', authenticateToken, isTPO, [
  body('candidate').notEmpty().withMessage('Candidate name is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('type').isIn(['Technical', 'HR Round', 'Managerial', 'Final']).withMessage('Invalid interview type'),
  body('interviewer').notEmpty().withMessage('Interviewer name is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('company').notEmpty().withMessage('Company is required')
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

    const {
      candidate,
      role,
      date,
      time,
      type,
      interviewer,
      location,
      duration,
      notes,
      company
    } = req.body;

    // Create new interview
    const newInterview = new Interview({
      company: company,
      candidate,
      role,
      date: new Date(date),
      time,
      type,
      interviewer,
      location,
      duration: duration || '60',
      notes: notes || '',
      status: 'Scheduled'
    });

    await newInterview.save();

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: {
        interview: newInterview
      }
    });
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create interview'
    });
  }
});

// @route   PUT /api/tpo/interviews/:id
// @desc    Update interview details
// @access  Private (TPO only)
router.put('/interviews/:id', authenticateToken, isTPO, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const interview = await Interview.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('company', 'company.companyName email');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.json({
      success: true,
      message: 'Interview updated successfully',
      data: {
        interview: {
          _id: interview._id,
          candidate: interview.candidate,
          role: interview.role,
          date: interview.date,
          time: interview.time,
          type: interview.type,
          status: interview.status,
          interviewer: interview.interviewer,
          location: interview.location,
          duration: interview.duration,
          notes: interview.notes,
          feedback: interview.feedback,
          rating: interview.rating,
          result: interview.result,
          company: interview.company ? {
            _id: interview.company._id,
            companyName: interview.company.company?.companyName || 'Unknown Company',
            email: interview.company.email
          } : null,
          createdAt: interview.createdAt,
          updatedAt: interview.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Error updating interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update interview'
    });
  }
});

// @route   DELETE /api/tpo/interviews/:id
// @desc    Delete an interview
// @access  Private (TPO only)
router.delete('/interviews/:id', authenticateToken, isTPO, async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findByIdAndDelete(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete interview'
    });
  }
});

// @route   GET /api/tpo/interviews/stats
// @desc    Get interview statistics for TPO
// @access  Private (TPO only)
router.get('/interviews/stats', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
  try {
    // Get all interviews
    const interviews = await Interview.find({}).populate('company', 'company.companyName');

    // Calculate statistics
    const totalInterviews = interviews.length;
    const scheduledInterviews = interviews.filter(i => i.status === 'Scheduled').length;
    const completedInterviews = interviews.filter(i => i.status === 'Completed').length;
    const cancelledInterviews = interviews.filter(i => i.status === 'Cancelled').length;

    // Type-wise statistics
    const typeStats = {};
    interviews.forEach(interview => {
      if (!typeStats[interview.type]) {
        typeStats[interview.type] = 0;
      }
      typeStats[interview.type]++;
    });

    // Result-wise statistics (for completed interviews)
    const resultStats = {};
    interviews.filter(i => i.status === 'Completed').forEach(interview => {
      if (!resultStats[interview.result]) {
        resultStats[interview.result] = 0;
      }
      resultStats[interview.result]++;
    });

    // Company-wise statistics
    const companyStats = {};
    interviews.forEach(interview => {
      const companyName = interview.company?.company?.companyName || 'Unknown';
      if (!companyStats[companyName]) {
        companyStats[companyName] = { total: 0, completed: 0, passed: 0 };
      }
      companyStats[companyName].total++;
      if (interview.status === 'Completed') {
        companyStats[companyName].completed++;
        if (interview.result === 'Passed') {
          companyStats[companyName].passed++;
        }
      }
    });

    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthlyInterviews = interviews.filter(interview => 
        interview.date >= date && interview.date <= monthEnd
      ).length;

      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        interviews: monthlyInterviews
      });
    }

    res.json({
      success: true,
      data: {
        overview: {
          totalInterviews,
          scheduledInterviews,
          completedInterviews,
          cancelledInterviews,
          completionRate: totalInterviews > 0 ? Math.round((completedInterviews / totalInterviews) * 100) : 0
        },
        typeStats: Object.entries(typeStats).map(([type, count]) => ({
          type,
          count,
          percentage: Math.round((count / totalInterviews) * 100)
        })),
        resultStats: Object.entries(resultStats).map(([result, count]) => ({
          result,
          count,
          percentage: completedInterviews > 0 ? Math.round((count / completedInterviews) * 100) : 0
        })),
        companyStats: Object.entries(companyStats).map(([company, stats]) => ({
          company,
          total: stats.total,
          completed: stats.completed,
          passed: stats.passed,
          successRate: stats.completed > 0 ? Math.round((stats.passed / stats.completed) * 100) : 0
        })),
        monthlyTrends
      }
    });
  } catch (error) {
    console.error('Error fetching interview statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview statistics'
    });
  }
});

// @route   GET /api/tpo/jobs
// @desc    Get all jobs for TPO's institute
// @access  Private (TPO only)
router.get('/jobs', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
  try {
    const { 
      search, 
      status, 
      type, 
      category,
      page = 1, 
      limit = 10 
    } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      if (status === 'active') {
        filter.isActive = true;
      } else if (status === 'inactive') {
        filter.isActive = false;
      } else if (status === 'expired') {
        filter.deadline = { $lt: new Date() };
      }
    }

    if (type && type !== 'All') {
      filter.type = type;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get jobs
    const jobs = await JobPosting.find(filter)
      .populate('company', 'company.companyName email')
      .sort({ postedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalJobs = await JobPosting.countDocuments(filter);

    // Get application counts for each job
    const jobsWithApplications = await Promise.all(
      jobs.map(async (job) => {
        const applications = await JobApplication.find({ jobPosting: job._id });
        const acceptedApplications = applications.filter(app => app.status === 'offer_received');
        
        return {
          _id: job._id,
          title: job.title,
          description: job.description,
          company: job.company ? {
            _id: job.company._id,
            companyName: job.company.company?.companyName || 'Unknown Company',
            email: job.company.email
          } : {
            _id: null,
            companyName: 'Unknown Company',
            email: null
          },
          location: job.location,
          type: job.type,
          category: job.category,
          package: job.package,
          requirements: job.requirements,
          responsibilities: job.responsibilities,
          skills: job.skills,
          experience: job.experience,
          isActive: job.isActive,
          postedAt: job.postedAt,
          deadline: job.deadline,
          totalApplications: applications.length,
          acceptedApplications: acceptedApplications.length,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt
        };
      })
    );

    res.json({
      success: true,
      data: {
        jobs: jobsWithApplications,
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
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs'
    });
  }
});

// @route   GET /api/tpo/jobs/stats
// @desc    Get job statistics for TPO
// @access  Private (TPO only)
router.get('/jobs/stats', authenticateToken, isTPO, tpoInstituteAccess, async (req, res) => {
  try {
    // Get all jobs
    const jobs = await JobPosting.find({}).populate('company', 'company.companyName');

    // Calculate statistics
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.isActive).length;
    const expiredJobs = jobs.filter(job => job.deadline < new Date()).length;

    // Type-wise statistics
    const typeStats = {};
    jobs.forEach(job => {
      if (!typeStats[job.type]) {
        typeStats[job.type] = 0;
      }
      typeStats[job.type]++;
    });

    // Category-wise statistics
    const categoryStats = {};
    jobs.forEach(job => {
      if (!categoryStats[job.category]) {
        categoryStats[job.category] = 0;
      }
      categoryStats[job.category]++;
    });

    // Company-wise statistics
    const companyStats = {};
    jobs.forEach(job => {
      const companyName = job.company?.company?.companyName || 'Unknown';
      if (!companyStats[companyName]) {
        companyStats[companyName] = { total: 0, active: 0 };
      }
      companyStats[companyName].total++;
      if (job.isActive) {
        companyStats[companyName].active++;
      }
    });

    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthlyJobs = jobs.filter(job => 
        job.postedAt >= date && job.postedAt <= monthEnd
      ).length;

      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        jobs: monthlyJobs
      });
    }

    res.json({
      success: true,
      data: {
        overview: {
          totalJobs,
          activeJobs,
          expiredJobs,
          activeRate: totalJobs > 0 ? Math.round((activeJobs / totalJobs) * 100) : 0
        },
        typeStats: Object.entries(typeStats).map(([type, count]) => ({
          type,
          count,
          percentage: Math.round((count / totalJobs) * 100)
        })),
        categoryStats: Object.entries(categoryStats).map(([category, count]) => ({
          category,
          count,
          percentage: Math.round((count / totalJobs) * 100)
        })),
        companyStats: Object.entries(companyStats).map(([company, stats]) => ({
          company,
          total: stats.total,
          active: stats.active,
          activeRate: Math.round((stats.active / stats.total) * 100)
        })),
        monthlyTrends
      }
    });
  } catch (error) {
    console.error('Error fetching job statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job statistics'
    });
  }
});

module.exports = router;
