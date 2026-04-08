const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const Student = require('../models/Student');
const JobApplication = require('../models/JobApplication');
const JobPosting = require('../models/JobPosting');
const PracticeSession = require('../models/PracticeSession');
const SkillProgress = require('../models/SkillProgress');
const Notification = require('../models/Notification');

const router = express.Router();

// Middleware to ensure user is a student
const ensureStudent = async (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Student role required.'
    });
  }
  next();
};

// @route   GET /api/student/dashboard
// @desc    Get student dashboard data
// @access  Private (Student)
router.get('/dashboard', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const studentId = req.user._id;
    let studentData = null;

    // Check if user is from Student collection (new structure) or User collection (legacy)
    if (req.user.constructor.modelName === 'Student') {
      // User is from Student collection - data is directly available
      studentData = req.user;
    } else {
      // User is from User collection - get nested student data
      const user = await User.findById(studentId).select('student');
      if (!user || !user.student) {
        return res.status(404).json({
          success: false,
          message: 'Student profile not found'
        });
      }
      studentData = user.student;
    }

    // Get application statistics
    const applications = await JobApplication.find({ student: studentId });
    const applicationStats = {
      total: applications.length,
      inProgress: applications.filter(app => ['applied', 'test_scheduled', 'test_completed', 'interview_scheduled'].includes(app.status)).length,
      offers: applications.filter(app => app.status === 'offer_received').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };

    // Get practice session statistics
    const practiceSessions = await PracticeSession.find({ student: studentId });
    const practiceStats = {
      total: practiceSessions.length,
      averageScore: practiceSessions.length > 0
        ? Math.round(practiceSessions.reduce((sum, session) => sum + (session.score || 0), 0) / practiceSessions.length)
        : 0
    };

    // Get skill progress
    const skillProgress = await SkillProgress.find({ student: studentId });
    const skillsMastered = skillProgress.filter(skill => skill.proficiency >= 80).length;

    // Get recent activities
    const recentApplications = await JobApplication.find({ student: studentId })
      .populate('jobPosting', 'title jobTitle companyName')
      .populate('jobPosting', 'title jobTitle companyName')
      .populate('company', 'companyName company') // Request both flat and nested fields for compatibility
      .sort({ appliedDate: -1 })
      .limit(5);

    const recentPracticeSessions = await PracticeSession.find({ student: studentId })
      .sort({ completedAt: -1 })
      .limit(5);

    // Get upcoming interviews
    const upcomingInterviews = await JobApplication.find({
      student: studentId,
      status: 'interview_scheduled',
      interviewDate: { $gte: new Date() }
    })
      .populate('jobPosting', 'title jobTitle companyName')
      .populate('jobPosting', 'title jobTitle companyName')
      .populate('company', 'companyName company')
      .sort({ interviewDate: 1 })
      .limit(3);

    res.json({
      success: true,
      data: {
        student: studentData,
        stats: {
          applicationsSubmitted: applicationStats.total,
          practiceSessions: practiceStats.total,
          skillsMastered,
          averageTestScore: practiceStats.averageScore,
          interviewsScheduled: upcomingInterviews.length,
          profileCompletion: studentData?.profileCompletion || 0
        },
        recentActivities: [
          ...recentApplications.map(app => ({
            id: app._id,
            message: `Applied for ${app.jobPosting?.title || app.jobPosting?.jobTitle || 'position'} at ${app.jobPosting?.companyName || app.company?.companyName || app.company?.company?.companyName || 'Company'}`,
            time: app.appliedDate,
            type: 'application'
          })),
          ...recentPracticeSessions.map(session => ({
            id: session._id,
            message: `Completed ${session.topic} practice with ${session.score}% accuracy`,
            time: session.completedAt,
            type: 'practice'
          }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5),
        upcomingTasks: upcomingInterviews.map(interview => ({
          id: interview._id,
          task: `Interview for ${interview.jobPosting?.title || interview.jobPosting?.jobTitle || 'position'} at ${interview.jobPosting?.companyName || interview.company?.companyName || interview.company?.company?.companyName || 'Company'}`,
          time: interview.interviewDate,
          priority: 'high'
        }))
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/student/jobs
// @desc    Get available jobs for students to browse
//          On-campus drives are filtered based on the student's college name.
// @access  Private (Student)
router.get('/jobs', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const {
      search,
      location,
      category,
      type,
      minSalary,
      maxSalary,
      experience,
      eligibleOnly = 'false',
      page = 1,
      limit = 10,
      sortBy = 'postedAt',
      sortOrder = 'desc'
    } = req.query;

    // Get the student's college — try Student collection first, then User as fallback
    let student = await Student.findById(req.user._id).select('collegeName cgpa branch graduationYear currentBacklogs');
    if (!student) {
      try {
        const User = require('../models/User');
        const userDoc = await User.findById(req.user._id).select('student');
        student = userDoc?.student || null;
      } catch (_) { }
    }
    const studentCollege = (student?.collegeName || '').trim();

    // ---------- Build query ----------
    // Visibility rules:
    //   • A job must be "active": status === 'active' OR isActive === true
    //   • Off-campus jobs → always visible
    //   • On-campus drives → visible when:
    //       a) targetColleges is empty/missing (open to all colleges), OR
    //       b) student's college appears in targetColleges (partial, case-insensitive)

    const activeConditions = [{ status: 'active' }, { isActive: true }];

    const collegeConditions = [
      // All off-campus
      { driveType: { $ne: 'on_campus' } },
      // On-campus open to all (no targetColleges restriction)
      { driveType: 'on_campus', targetColleges: { $exists: false } },
      { driveType: 'on_campus', targetColleges: { $size: 0 } },
      { driveType: 'on_campus', targetColleges: null },
    ];

    if (studentCollege) {
      const escaped = studentCollege.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      collegeConditions.push({
        driveType: 'on_campus',
        targetColleges: { $elemMatch: { $regex: new RegExp(escaped, 'i') } }
      });
    }

    const query = {
      $and: [
        { $or: activeConditions },
        { $or: collegeConditions }
      ]
    };

    // Eligibility filtering
    if (eligibleOnly === 'true' && student) {
      // 1. CGPA / Percentage Check
      query.$and.push({
        $or: [
          { 'eligibilityCriteria.minCgpaPercentage.value': { $exists: false } },
          { 'eligibilityCriteria.minCgpaPercentage.value': null },
          { 'eligibilityCriteria.minCgpaPercentage.value': 0 },
          { 'eligibilityCriteria.minCgpaPercentage.value': { $lte: student.cgpa || 0 } }
        ]
      });

      // 2. Branch Check
      if (student.branch) {
        query.$and.push({
          $or: [
            { eligibleBranches: { $exists: false } },
            { eligibleBranches: { $size: 0 } },
            { eligibleBranches: { $regex: new RegExp(`^${student.branch.trim()}$`, 'i') } },
            { eligibleBranches: { $elemMatch: { $regex: new RegExp(`^${student.branch.trim()}$`, 'i') } } }
          ]
        });
      }

      // 3. Batch Check
      if (student.graduationYear) {
        query.$and.push({
          $or: [
            { targetBatches: { $exists: false } },
            { targetBatches: { $size: 0 } },
            { targetBatches: String(student.graduationYear) },
            { targetBatches: { $elemMatch: { $eq: String(student.graduationYear) } } }
          ]
        });
      }

      // 4. Backlogs Check
      query.$and.push({
        $or: [
          { 'eligibilityCriteria.backlogsAllowed': true, $or: [ { 'eligibilityCriteria.maxActiveBacklogs': { $exists: false } }, { 'eligibilityCriteria.maxActiveBacklogs': { $gte: student.currentBacklogs || 0 } } ] },
          { 'eligibilityCriteria.backlogsAllowed': false, $or: [ { 'eligibilityCriteria.maxActiveBacklogs': { $gte: student.currentBacklogs || 0 } }, { $expr: { $lte: [ { $ifNull: [student.currentBacklogs, 0] }, 0 ] } } ] },
          { 'eligibilityCriteria.backlogsAllowed': { $exists: false } }
        ]
      });
    }

    // Optional filters
    if (search) {
      query.$and.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { jobTitle: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { jobDescription: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (location) { query.location = { $regex: location, $options: 'i' }; }
    if (category) { query.category = category; }
    if (type) { query.type = type; }
    
    // Improved filters
    if (minSalary) { query['ctc'] = { $gte: parseInt(minSalary) * 100000 }; }
    if (maxSalary) { query['ctc'] = { $lte: parseInt(maxSalary) * 100000 }; }
    if (experience) { 
      if (experience === '0') query['experienceRequired'] = '0';
      else if (experience === '1') query['experienceRequired'] = { $in: ['0-1', '1-2'] };
      else query['experienceRequired'] = experience;
    }
    if (req.query.workMode && req.query.workMode !== 'All') {
      query.workMode = req.query.workMode.toLowerCase();
    }
    if (req.query.driveType && req.query.driveType !== 'All') {
      query.driveType = req.query.driveType;
    }

    console.log('[student/jobs] college:"' + studentCollege + '" | results query OK');

    const sort = {};
    sort[sortBy === 'postedAt' ? 'createdAt' : sortBy] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await JobPosting.find(query)
      .populate('company', 'companyName company email profilePicture')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await JobPosting.countDocuments(query);

    const locations = await JobPosting.distinct('location', { isActive: true });
    const categories = await JobPosting.distinct('category', { isActive: true });
    const types = await JobPosting.distinct('type', { isActive: true });

    // Helper to compute eligibility for the current student
    const computeEligibility = (job) => {
      if (job.driveType !== 'on_campus') return null; // N/A for off-campus
      const issues = [];
      const ec = job.eligibilityCriteria || {};

      // CGPA / percentage
      if (ec.minCgpaPercentage?.value > 0) {
        if ((student.cgpa || 0) < ec.minCgpaPercentage.value) {
          issues.push(`Min ${ec.minCgpaPercentage.type?.toUpperCase() || 'CGPA'} ${ec.minCgpaPercentage.value} required`);
        }
      }
      // Branch
      if (job.eligibleBranches?.length > 0) {
        if (!job.eligibleBranches.some(b => b.toLowerCase() === (student.branch || '').toLowerCase())) {
          issues.push(`Branch not eligible`);
        }
      }
      // Batch (graduationYear)
      if (job.targetBatches?.length > 0) {
        if (!job.targetBatches.some(b => String(b) === String(student.graduationYear))) {
          issues.push(`Batch ${student.graduationYear} not targeted`);
        }
      }
      // Backlogs
      if (!ec.backlogsAllowed && (student.currentBacklogs || 0) > 0) {
        issues.push('Active backlogs not allowed');
      } else if (ec.backlogsAllowed && ec.maxActiveBacklogs != null) {
        if ((student.currentBacklogs || 0) > ec.maxActiveBacklogs) {
          issues.push(`Max ${ec.maxActiveBacklogs} backlog(s) allowed`);
        }
      }

      return { eligible: issues.length === 0, issues };
    };

    // Check if current user has applied to each job
    const userApplications = await JobApplication.find({
      student: student.id || student._id,
      jobPosting: { $in: jobs.map(job => job._id) }
    });
    const appliedJobIds = new Set(userApplications.map(app => app.jobPosting.toString()));

    res.json({
      success: true,
      data: {
        jobs: jobs.map(job => {
          const eligibility = computeEligibility(job);
          const companyDoc = job.company;
          return {
            id: job._id,
            hasApplied: appliedJobIds.has(job._id.toString()),
            // Legacy fields (existing UI)
            title: job.jobTitle || job.title,
            company: job.companyName || companyDoc?.companyName || companyDoc?.company?.companyName || 'Company',
            companyLogo: job.companyLogo || companyDoc?.profilePicture || companyDoc?.company?.logo || null,
            location: job.companyLocation || job.location,
            salary: job.ctc
              ? `₹${(job.ctc / 100000).toFixed(1)} LPA`
              : job.stipend
                ? `₹${Number(job.stipend).toLocaleString()}/mo`
                : (job.package ? `₹${job.package.min / 100000}-${job.package.max / 100000} LPA` : 'Not specified'),
            experience: job.experience ? `${job.experience.min}-${job.experience.max} years` : 'Fresher',
            jobType: (job.employmentType || job.type || '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            department: (job.department || job.category || '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: job.jobDescription || job.description,
            requirements: job.requiredSkills || job.requirements || [],
            responsibilities: job.responsibilities || [],
            skills: job.requiredSkills || job.skills || [],
            postedDate: job.createdAt || job.postedAt,
            deadline: job.applicationDeadline || job.deadline,
            applications: job.applicationCount,
            views: job.views,
            isRemote: (job.workMode || job.location || '').toLowerCase().includes('remote'),
            benefits: job.otherBenefits ? [job.otherBenefits] : [],

            // ── Drive-specific fields ──
            driveType: job.driveType,
            isOnCampus: job.driveType === 'on_campus',
            tentativeDriveDate: job.tentativeDriveDate,
            applicationDeadline: job.applicationDeadline,
            selectionRounds: job.selectionRounds || [],
            totalRounds: job.totalRounds || (job.selectionRounds || []).length,
            pptRequired: job.pptRequired,
            pptDetails: job.pptDetails,
            eligibilityCriteria: job.eligibilityCriteria,
            eligibleBranches: job.eligibleBranches,
            eligibleDegrees: job.eligibleDegrees,
            targetBatches: job.targetBatches,
            workLocations: job.workLocations,
            jobId: job.jobId,

            // ── Eligibility chip ──
            eligibility, // null for off-campus; { eligible: bool, issues: [] } for on-campus
          };
        }),
        filters: {
          locations: locations.filter(Boolean).sort(),
          categories: categories.filter(Boolean).map(cat => ({
            value: cat,
            label: cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          })),
          types: types.filter(Boolean).map(t => ({
            value: t,
            label: t.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          }))
        },
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          hasNext: parseInt(page) * parseInt(limit) < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Jobs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/student/jobs/:jobId/apply
// @desc    Apply for a job — with eligibility gate for on-campus drives
// @access  Private (Student)
router.post('/jobs/:jobId/apply', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const multer = require('multer');
    const cloudinary = require('cloudinary').v2;

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const upload = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB for resumes
    }).any();

    // Run multer as a promise to parse fields and files from FormData
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (multerError) {
    console.error('Multer parsing error:', multerError);
    return res.status(400).json({ success: false, message: 'Error parsing application data' });
  }

  try {
    const studentId = req.user.constructor.modelName === 'Student' 
      ? req.user._id 
      : (req.user.student || (await require('../models/User').findById(req.user._id).select('student'))?.student);
    
    if (!studentId) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const jobId = req.params.jobId;
    const { coverLetter, portfolio, availability, salary } = req.body;

    // Check if job exists and is active
    const job = await JobPosting.findOne({ _id: jobId, isActive: true });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found or no longer active' });
    }

    // ── Eligibility gate for on-campus drives ──────────────────────────
    if (job.driveType === 'on_campus') {
      const student = await Student.findById(studentId)
        .select('collegeName cgpa branch graduationYear currentBacklogs resume');

      if (!student) {
        return res.status(404).json({ success: false, message: 'Student profile not found' });
      }

      // 1. College check — student must belong to one of the target colleges
      if (job.targetColleges?.length > 0) {
        const normalise = s => (s || '').toLowerCase().trim();
        const collegeMatch = job.targetColleges.some(
          tc => normalise(tc) === normalise(student.collegeName)
        );
        if (!collegeMatch) {
          return res.status(403).json({
            success: false,
            message: 'This drive is not available for your college.'
          });
        }
      }

      const ec = job.eligibilityCriteria || {};
      const issues = [];

      // 2. CGPA / percentage
      if (ec.minCgpaPercentage?.value > 0 && (student.cgpa || 0) < ec.minCgpaPercentage.value) {
        issues.push(`Your CGPA (${student.cgpa}) is below the minimum required (${ec.minCgpaPercentage.value}).`);
      }

      // 3. Branch eligibility
      if (job.eligibleBranches?.length > 0) {
        const branchMatch = job.eligibleBranches.some(
          b => b.toLowerCase() === (student.branch || '').toLowerCase()
        );
        if (!branchMatch) {
          issues.push(`Your branch (${student.branch}) is not eligible for this drive.`);
        }
      }

      // 4. Batch / graduation year
      if (job.targetBatches?.length > 0) {
        const batchMatch = job.targetBatches.some(b => String(b) === String(student.graduationYear));
        if (!batchMatch) {
          issues.push(`Your graduation batch (${student.graduationYear}) is not targeted by this drive.`);
        }
      }

      // 5. Active backlogs
      const activeBacklogs = student.currentBacklogs || 0;
      if (!ec.backlogsAllowed && activeBacklogs > 0) {
        issues.push(`Active backlogs (${activeBacklogs}) are not allowed for this drive.`);
      } else if (ec.backlogsAllowed && ec.maxActiveBacklogs != null && activeBacklogs > ec.maxActiveBacklogs) {
        issues.push(`You have ${activeBacklogs} active backlog(s); maximum allowed is ${ec.maxActiveBacklogs}.`);
      }

      if (issues.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'You do not meet the eligibility criteria for this drive.',
          issues
        });
      }
    }
    // ───────────────────────────────────────────────────────────────────

    // Duplicate application check
    const existingApplication = await JobApplication.findOne({ student: studentId, jobPosting: jobId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this position.' });
    }

    // Handle Resume Upload / Selection
    let resumeUrl = null;
    const resumeFile = req.files ? req.files.find(f => f.fieldname === 'resume') : null;

    if (resumeFile) {
      // Upload new resume to Cloudinary
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'student_resumes',
              public_id: `resume_${studentId}_${Date.now()}`,
              resource_type: 'auto'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(resumeFile.buffer);
        });
        resumeUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Resume upload error:', uploadError);
        return res.status(500).json({ success: false, message: 'Error uploading resume' });
      }
    } else {
      // Fallback to profile resume if none uploaded now
      // We need to fetch the student profile if it wasn't fetched during eligibility check
      let student = null;
      if (job.driveType === 'on_campus') {
        // Already fetched above
      } else {
        student = await Student.findById(studentId).select('resume');
      }
      
      // If we already have student from eligibility check, use it
      const studentDoc = student || (await Student.findById(studentId).select('resume'));
      resumeUrl = studentDoc?.resume || '';
    }

    const application = new JobApplication({
      student: studentId,
      jobPosting: jobId,
      company: job.company,
      coverLetter,
      resume: resumeUrl,
      employmentType: job.employmentType || job.type || 'full-time',
      status: 'applied',
      appliedDate: new Date()
    });

    await application.save();
    await JobPosting.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: { applicationId: application._id, status: 'applied' }
    });

  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/student/applications
// @desc    Get student's job applications
// @access  Private (Student)
router.get('/applications', authenticateToken, ensureStudent, async (req, res) => {
  try {
    // Consistently resolve student ID (handle legacy User vs new Student collection)
    const studentId = req.user.constructor.modelName === 'Student' 
      ? req.user._id 
      : (req.user.student || (await User.findById(req.user._id).select('student'))?.student);
    
    if (!studentId) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const { status, page = 1, limit = 10 } = req.query;

    const query = { student: studentId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const applications = await JobApplication.find(query)
      .populate('jobPosting', 'selectionRounds totalRounds jobTitle companyName title category jobCategory package location type description employmentType stipend ctc jobDescription requiredSkills internshipDuration applicationDeadline workLocations requirements responsibilities skills duration deadline')
      .populate('company', 'companyName email profilePicture company')
      .sort({ appliedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await JobApplication.countDocuments(query);

    // Get application statistics
    const allApplications = await JobApplication.find({ student: studentId });
    const stats = {
      total: allApplications.length,
      inProgress: allApplications.filter(app => ['applied', 'test_scheduled', 'test_completed', 'interview_scheduled'].includes(app.status)).length,
      offers: allApplications.filter(app => app.status === 'offer_received').length,
      rejected: allApplications.filter(app => app.status === 'rejected').length
    };

    // Get job categories statistics
    const categoryStats = await JobApplication.aggregate([
      { $match: { student: studentId } },
      { $lookup: { from: 'jobpostings', localField: 'jobPosting', foreignField: '_id', as: 'jobPosting' } },
      { $unwind: '$jobPosting' },
      { $group: { _id: { $ifNull: ['$jobPosting.jobCategory', { $ifNull: ['$jobPosting.category', 'General'] }] }, count: { $sum: 1 } } }
    ]);
    const getStatusColor = (status) => {
      const colors = {
        'applied': 'text-blue-600', 'test_scheduled': 'text-amber-600',
        'test_completed': 'text-orange-600', 'interview_scheduled': 'text-purple-600',
        'offer_received': 'text-emerald-600', 'rejected': 'text-rose-600'
      };
      return colors[status] || 'text-gray-600';
    };

    const getCategorySalary = (cat) => '₹8-15 LPA'; // Backend placeholder
    const getCategoryColor = (cat) => 'text-indigo-600'; // Backend placeholder


    res.json({
      success: true,
      data: {
        applications: applications.map(app => ({
          id: app._id,
          role: app.jobPosting?.title || app.jobPosting?.jobTitle || 'Position',
          company: app.company?.companyName || app.company?.company?.companyName || 'Company',
          salary: app.jobPosting?.employmentType === 'internship'
            ? (app.jobPosting.stipend > 0 ? `₹${Number(app.jobPosting.stipend).toLocaleString()}/mo` : 'Unpaid')
            : (app.jobPosting?.ctc ? `₹${(app.jobPosting.ctc / 100000).toFixed(1)} LPA`
              : (app.jobPosting?.package ? `₹${app.jobPosting.package.min / 100000}-${app.jobPosting.package.max / 100000} LPA` : 'Not specified')),
          status: app.status,
          appliedDate: new Date(app.appliedDate).toLocaleDateString(),
          description: app.jobPosting?.description || app.jobPosting?.jobDescription,
          requirements: app.jobPosting?.requirements || app.jobPosting?.requiredSkills,
          responsibilities: app.jobPosting?.responsibilities,
          skills: app.jobPosting?.skills || app.jobPosting?.requiredSkills,
          duration: app.jobPosting?.duration || app.jobPosting?.internshipDuration,
          deadline: app.jobPosting?.deadline || app.jobPosting?.applicationDeadline,
          location: app.jobPosting?.location || app.jobPosting?.workLocations?.[0],
          // employmentType is the canonical field; type is legacy — check both
          type: app.employmentType || app.jobPosting?.employmentType || app.jobPosting?.type || 'full-time',
          coverLetter: app.coverLetter,
          resume: app.resume,
          notes: app.notes,
          timeline: app.timeline
        })),
        _debug: applications.map(app => ({
          id: app._id,
          appEmploymentType: app.employmentType,
          jobPostingNull: !app.jobPosting,
          jobPostingEmploymentType: app.jobPosting?.employmentType,
          jobPostingType: app.jobPosting?.type,
          resolvedType: app.employmentType || app.jobPosting?.employmentType || app.jobPosting?.type || 'full-time'
        })),
        stats,
        categoryStats: categoryStats.map(cat => ({
          label: (cat._id || 'General').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          count: cat.count,
          salary: getCategorySalary(cat._id),
          color: getCategoryColor(cat._id)
        })),
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/student/applications/:applicationId
// @desc    Get a single application's details
// @access  Private (Student)
router.get('/applications/:applicationId', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const studentId = req.user._id;
    const applicationId = req.params.applicationId;

    const application = await JobApplication.findOne({
      _id: applicationId,
      student: studentId
    })
      .populate('jobPosting', 'selectionRounds totalRounds jobTitle companyName title category jobCategory package ctc stipend location type description requirements responsibilities skills duration deadline employmentType jobDescription requiredSkills internshipDuration applicationDeadline workLocations')
      .populate('company', 'companyName email profilePicture');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: application._id,
        role: application.jobPosting?.title || application.jobPosting?.jobTitle || 'Position',
        company: application.company?.companyName || 'Company',
        salary: application.jobPosting?.employmentType === 'internship' ? 
          (application.jobPosting.stipend > 0 ? `₹${Number(application.jobPosting.stipend).toLocaleString()}/mo` : 'Unpaid') :
          (application.jobPosting?.ctc ? `₹${(application.jobPosting.ctc / 100000).toFixed(1)} LPA` : 
           (application.jobPosting?.package ? `₹${application.jobPosting.package.min / 100000}-${application.jobPosting.package.max / 100000} LPA` : 'Not specified')),
        status: application.status,
        appliedDate: new Date(application.appliedDate).toLocaleDateString(),
        description: application.jobPosting?.description || application.jobPosting?.jobDescription,
        requirements: application.jobPosting?.requirements || application.jobPosting?.requiredSkills,
        responsibilities: application.jobPosting?.responsibilities,
        skills: application.jobPosting?.skills || application.jobPosting?.requiredSkills,
        duration: application.jobPosting?.duration || application.jobPosting?.internshipDuration,
        deadline: application.jobPosting?.deadline || application.jobPosting?.applicationDeadline,
        location: application.jobPosting?.location || application.jobPosting?.workLocations?.[0],
        type: application.jobPosting?.employmentType || application.jobPosting?.type,
        coverLetter: application.coverLetter,
        resume: application.resume,
        notes: application.notes,
        timeline: application.timeline || [],
        selectionRounds: application.jobPosting?.selectionRounds || []
      }
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/student/applications/:applicationId
// @desc    Update a job application
// @access  Private (Student)
router.put('/applications/:applicationId', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const studentId = req.user._id;
    const applicationId = req.params.applicationId;
    const { coverLetter, notes, resume } = req.body;

    // Check if application exists and belongs to the student
    const application = await JobApplication.findOne({
      _id: applicationId,
      student: studentId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update application
    const updateData = {};
    if (coverLetter !== undefined) updateData.coverLetter = coverLetter;
    if (notes !== undefined) updateData.notes = notes;
    if (resume !== undefined) updateData.resume = resume;

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true }
    ).populate('jobPosting', 'title')
      .populate('company', 'company');

    res.json({
      success: true,
      message: 'Application updated successfully',
      data: {
        id: updatedApplication._id,
        role: updatedApplication.jobPosting?.title || 'Position',
        company: updatedApplication.company?.company?.companyName || 'Company',
        coverLetter: updatedApplication.coverLetter,
        notes: updatedApplication.notes,
        resume: updatedApplication.resume,
        status: updatedApplication.status,
        appliedDate: updatedApplication.appliedDate
      }
    });

  } catch (error) {
    console.error('Application update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/student/practice-sessions
// @desc    Get student's practice sessions
// @access  Private (Student)
router.get('/practice-sessions', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const studentId = req.user._id;
    const { category, page = 1, limit = 10 } = req.query;

    const query = { student: studentId };
    if (category && category !== 'all') {
      query.category = category;
    }

    const sessions = await PracticeSession.find(query)
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await PracticeSession.countDocuments(query);

    // Get category statistics
    const categoryStats = await PracticeSession.aggregate([
      { $match: { student: studentId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' },
          totalTime: { $sum: '$timeSpent' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        sessions: sessions.map(session => ({
          id: session._id,
          topic: session.topic,
          category: session.category,
          difficulty: session.difficulty,
          score: session.score,
          timeSpent: session.timeSpent,
          completedAt: session.completedAt,
          totalQuestions: session.totalQuestions,
          correctAnswers: session.correctAnswers
        })),
        categoryStats: categoryStats.map(cat => ({
          category: cat._id,
          count: cat.count,
          averageScore: Math.round(cat.averageScore || 0),
          totalTime: cat.totalTime
        })),
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Practice sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/student/skills
// @desc    Get student's skill progress
// @access  Private (Student)
router.get('/skills', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const studentId = req.user._id;

    const skillProgress = await SkillProgress.find({ student: studentId });

    // Group skills by category
    const technicalSkills = skillProgress.filter(skill => skill.category === 'technical');
    const softSkills = skillProgress.filter(skill => skill.category === 'soft-skills');

    // Calculate category statistics
    const technicalStats = {
      total: technicalSkills.length,
      mastered: technicalSkills.filter(skill => skill.proficiency >= 80).length,
      average: technicalSkills.length > 0
        ? Math.round(technicalSkills.reduce((sum, skill) => sum + skill.proficiency, 0) / technicalSkills.length)
        : 0
    };

    const softSkillsStats = {
      total: softSkills.length,
      mastered: softSkills.filter(skill => skill.proficiency >= 80).length,
      average: softSkills.length > 0
        ? Math.round(softSkills.reduce((sum, skill) => sum + skill.proficiency, 0) / softSkills.length)
        : 0
    };

    res.json({
      success: true,
      data: {
        technicalSkills: technicalSkills.map(skill => ({
          skill: skill.skill,
          proficiency: skill.proficiency,
          targetProficiency: skill.targetProficiency,
          lastUpdated: skill.lastUpdated,
          notes: skill.notes
        })),
        softSkills: softSkills.map(skill => ({
          skill: skill.skill,
          proficiency: skill.proficiency,
          targetProficiency: skill.targetProficiency,
          lastUpdated: skill.lastUpdated,
          notes: skill.notes
        })),
        stats: {
          technical: technicalStats,
          softSkills: softSkillsStats,
          totalMastered: technicalStats.mastered + softSkillsStats.mastered,
          overallAverage: Math.round((technicalStats.average + softSkillsStats.average) / 2)
        }
      }
    });

  } catch (error) {
    console.error('Skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/student/practice-session
// @desc    Create a new practice session
// @access  Private (Student)
router.post('/practice-session', [
  authenticateToken,
  ensureStudent,
  body('topic').notEmpty().withMessage('Topic is required'),
  body('category').isIn(['data-structures', 'algorithms', 'system-design', 'database', 'web-development', 'machine-learning', 'soft-skills']).withMessage('Invalid category'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('score').isNumeric().withMessage('Score must be numeric'),
  body('totalQuestions').isNumeric().withMessage('Total questions must be numeric'),
  body('correctAnswers').isNumeric().withMessage('Correct answers must be numeric'),
  body('timeSpent').isNumeric().withMessage('Time spent must be numeric')
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

    const studentId = req.user._id;
    const {
      topic,
      category,
      difficulty,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      questions,
      feedback
    } = req.body;

    const session = new PracticeSession({
      student: studentId,
      topic,
      category,
      difficulty,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      questions: questions || [],
      feedback: feedback || {}
    });

    await session.save();

    // Update student statistics
    await User.findByIdAndUpdate(studentId, {
      $inc: { 'student.totalPracticeSessions': 1 },
      $set: {
        'student.averageTestScore': await calculateAverageTestScore(studentId)
      }
    });

    // Update skill progress
    await updateSkillProgress(studentId, category, score);

    res.status(201).json({
      success: true,
      message: 'Practice session saved successfully',
      data: session
    });

  } catch (error) {
    console.error('Practice session creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});



// @route   GET /api/student/notifications
// @desc    Get student notifications
// @access  Private (Student)
router.get('/notifications', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const studentId = req.user._id;
    const { page = 1, limit = 10, unreadOnly = false } = req.query;

    // Get recent applications for notifications
    const recentApplications = await JobApplication.find({ student: studentId })
      .populate('jobPosting', 'title company')
      .populate('company', 'company')
      .sort({ appliedDate: -1 })
      .limit(5);

    // Get upcoming interviews
    const upcomingInterviews = await JobApplication.find({
      student: studentId,
      status: 'interview_scheduled',
      interviewDate: { $gte: new Date() }
    })
      .populate('jobPosting', 'title')
      .populate('company', 'company')
      .sort({ interviewDate: 1 })
      .limit(3);

    // Get recent practice sessions
    const recentPracticeSessions = await PracticeSession.find({ student: studentId })
      .sort({ completedAt: -1 })
      .limit(3);

    // Generate notifications from various sources
    const notifications = [];

    // Application status updates
    recentApplications.forEach(app => {
      if (app.status === 'test_scheduled') {
        notifications.push({
          id: `app_${app._id}`,
          message: `Test scheduled for ${app.jobPosting?.title || 'position'} at ${app.company?.company?.companyName || 'Company'}`,
          time: app.updatedAt,
          type: 'application',
          unread: true,
          link: `/applications/${app._id}`
        });
      } else if (app.status === 'interview_scheduled') {
        notifications.push({
          id: `app_${app._id}`,
          message: `Interview scheduled for ${app.jobPosting?.title || 'position'} at ${app.company?.company?.companyName || 'Company'}`,
          time: app.updatedAt,
          type: 'interview',
          unread: true,
          link: `/applications/${app._id}`
        });
      } else if (app.status === 'offer_received') {
        notifications.push({
          id: `app_${app._id}`,
          message: `🎉 Congratulations! Offer received for ${app.jobPosting?.title || 'position'} at ${app.company?.company?.companyName || 'Company'}`,
          time: app.updatedAt,
          type: 'offer',
          unread: true,
          link: `/applications/${app._id}`
        });
      }
    });

    // Upcoming interview reminders
    upcomingInterviews.forEach(interview => {
      const daysUntil = Math.ceil((new Date(interview.interviewDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 2) {
        notifications.push({
          id: `interview_${interview._id}`,
          message: `Interview reminder: ${interview.jobPosting?.title || 'position'} at ${interview.company?.company?.companyName || 'Company'} in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
          time: new Date(),
          type: 'reminder',
          unread: true,
          link: `/applications/${interview._id}`
        });
      }
    });

    // Practice session achievements
    recentPracticeSessions.forEach(session => {
      if (session.score >= 90) {
        notifications.push({
          id: `practice_${session._id}`,
          message: `Excellent! Scored ${session.score}% in ${session.topic} practice session`,
          time: session.completedAt,
          type: 'achievement',
          unread: true,
          link: `/practice-hub`
        });
      }
    });

    // Sort notifications by time (newest first)
    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotifications = notifications.slice(startIndex, endIndex);

    // Count unread notifications
    const unreadCount = notifications.filter(n => n.unread).length;

    res.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        unreadCount,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(notifications.length / limit),
          hasNext: endIndex < notifications.length,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// @route   PUT /api/student/notifications/mark-read
// @desc    Mark notifications as read
// @access  Private (Student)
router.put('/notifications/mark-read', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const { notificationIds } = req.body;

    // In a real implementation, you would update notification status in database
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read'
    });
  }
});

// Helper functions
function getStatusColor(status) {
  const colors = {
    applied: 'bg-blue-100 text-blue-700',
    test_scheduled: 'bg-yellow-100 text-yellow-700',
    test_completed: 'bg-purple-100 text-purple-700',
    interview_scheduled: 'bg-orange-100 text-orange-700',
    interview_completed: 'bg-indigo-100 text-indigo-700',
    offer_received: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-gray-100 text-gray-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

function getCategoryColor(category) {
  const colors = {
    'software-engineering': 'text-blue-600',
    'data-science': 'text-green-600',
    'product-management': 'text-purple-600',
    'design': 'text-pink-600',
    'marketing': 'text-orange-600',
    'sales': 'text-red-600'
  };
  return colors[category] || 'text-gray-600';
}

function getCategorySalary(category) {
  const salaries = {
    'software-engineering': '₹8-25 LPA',
    'data-science': '₹10-30 LPA',
    'product-management': '₹12-35 LPA',
    'design': '₹6-20 LPA',
    'marketing': '₹5-18 LPA',
    'sales': '₹4-15 LPA'
  };
  return salaries[category] || '₹5-20 LPA';
}

async function calculateAverageTestScore(studentId) {
  const sessions = await PracticeSession.find({ student: studentId });
  if (sessions.length === 0) return 0;

  const totalScore = sessions.reduce((sum, session) => sum + (session.score || 0), 0);
  return Math.round(totalScore / sessions.length);
}

async function updateSkillProgress(studentId, category, score) {
  // This is a simplified version - you might want to implement more sophisticated skill tracking
  const skillMap = {
    'data-structures': 'Data Structures & Algorithms',
    'algorithms': 'Data Structures & Algorithms',
    'system-design': 'System Design',
    'database': 'Database Management',
    'web-development': 'Web Development',
    'machine-learning': 'Machine Learning',
    'soft-skills': 'Communication'
  };

  const skillName = skillMap[category];
  if (!skillName) return;

  let skillProgress = await SkillProgress.findOne({ student: studentId, skill: skillName });

  if (!skillProgress) {
    skillProgress = new SkillProgress({
      student: studentId,
      skill: skillName,
      category: category === 'soft-skills' ? 'soft-skills' : 'technical',
      proficiency: score
    });
  } else {
    // Update proficiency based on new score
    skillProgress.proficiency = Math.min(100, Math.max(0, (skillProgress.proficiency + score) / 2));
  }

  skillProgress.lastUpdated = new Date();
  await skillProgress.save();
}

function calculateProfileCompletion(profileData) {
  const fields = [
    'name', 'rollNumber', 'branch', 'graduationYear', 'collegeName',
    'cgpa', 'skills', 'personalInfo.phone', 'personalInfo.address.city',
    'education.degree', 'education.specialization', 'projects', 'certifications'
  ];

  let completedFields = 0;
  fields.forEach(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], profileData);
    if (value && (typeof value === 'string' ? value.trim() : value).length > 0) {
      completedFields++;
    }
  });

  return Math.round((completedFields / fields.length) * 100);
}

// @route   GET /api/student/ai-coach
// @desc    Get AI coach data and insights
// @access  Private (Student)
router.get('/ai-coach', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get student's recent activities for AI insights
    const recentApplications = await JobApplication.find({ student: studentId })
      .populate('jobPosting', 'title category')
      .sort({ appliedDate: -1 })
      .limit(5);

    const recentPracticeSessions = await PracticeSession.find({ student: studentId })
      .sort({ completedAt: -1 })
      .limit(5);

    const skillProgress = await SkillProgress.find({ student: studentId });

    // Generate AI insights based on student data
    const aiInsights = [];

    // Interview performance analysis
    if (recentPracticeSessions.length > 0) {
      const avgScore = recentPracticeSessions.reduce((sum, session) => sum + (session.score || 0), 0) / recentPracticeSessions.length;
      if (avgScore < 70) {
        aiInsights.push({
          title: 'Interview Performance Analysis',
          description: 'Based on your recent mock interviews, focus on system design questions',
          icon: 'FaLightbulb',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50'
        });
      }
    }

    // Resume optimization suggestion
    let studentProfileCompletion = 0;
    if (req.user.constructor.modelName === 'Student') {
      studentProfileCompletion = req.user.profileCompletion || 0;
    } else {
      const user = await User.findById(studentId).select('student');
      studentProfileCompletion = user?.student?.profileCompletion || 0;
    }

    if (studentProfileCompletion < 80) {
      aiInsights.push({
        title: 'Resume Optimization',
        description: 'Your resume could be improved by adding more quantifiable achievements',
        icon: 'FaStar',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50'
      });
    }

    // Career path recommendation
    if (recentApplications.length > 0) {
      const categories = recentApplications.map(app => app.jobPosting?.category).filter(Boolean);
      if (categories.length > 0) {
        aiInsights.push({
          title: 'Career Path Recommendation',
          description: `Consider exploring ${categories[0]} roles based on your profile`,
          icon: 'FaUserGraduate',
          color: 'text-green-500',
          bgColor: 'bg-green-50'
        });
      }
    }

    // Recent conversations (mock data for now)
    const recentConversations = [
      {
        id: 1,
        topic: 'System Design Interview Tips',
        date: '2 hours ago',
        status: 'completed'
      },
      {
        id: 2,
        topic: 'Resume Feedback Request',
        date: '1 day ago',
        status: 'in-progress'
      },
      {
        id: 3,
        topic: 'Career Path Discussion',
        date: '3 days ago',
        status: 'completed'
      }
    ];

    // Performance metrics
    const performanceMetrics = {
      coachingSessions: recentPracticeSessions.length,
      interviewSuccess: recentApplications.filter(app => app.status === 'offer_received').length > 0 ? 92 : 75,
      skillsImproved: skillProgress.filter(skill => skill.proficiency >= 80).length,
      coachRating: 4.8
    };

    res.json({
      success: true,
      data: {
        aiInsights,
        recentConversations,
        performanceMetrics
      }
    });

  } catch (error) {
    console.error('AI Coach error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/student/ai-coach/session
// @desc    Create a new AI coaching session
// @access  Private (Student)
router.post('/ai-coach/session', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const { topic, type } = req.body;
    const studentId = req.user._id;

    // For now, just return success
    // In a real implementation, this would create a session with an AI service
    res.json({
      success: true,
      message: 'AI coaching session created successfully',
      data: {
        sessionId: Date.now(),
        topic,
        type,
        status: 'active'
      }
    });

  } catch (error) {
    console.error('AI Session creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});


// @route   PUT /api/student/profile/:studentId/approve
// @desc    Approve student profile (TPO/Superadmin only)
// @access  Private (TPO/Superadmin)
router.put('/profile/:studentId/approve', authenticateToken, async (req, res) => {
  try {
    // Check if user has permission to approve profiles
    if (!['tpo', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. TPO or Superadmin role required.'
      });
    }

    // Try Student collection first, then User collection
    let student = await Student.findById(req.params.studentId);
    let isStudentCollection = true;
    if (!student) {
      student = await User.findById(req.params.studentId);
      isStudentCollection = false;
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update student approval status
    if (isStudentCollection) {
      student.verificationStatus = 'verified';
      student.verifiedAt = new Date();
      student.verifiedBy = req.user._id;
    } else {
      student.approvalStatus = 'Approved';
      student.approvedAt = new Date();
      student.approvedBy = req.user._id;
      student.status = 'active';
    }
    await student.save();

    // Create notification for student
    const notification = new Notification({
      recipient: student._id,
      sender: req.user._id,
      title: 'Profile Approved',
      message: 'Your profile has been approved by the TPO. You can now access your dashboard.',
      type: 'achievement'
    });
    await notification.save();

    res.json({
      success: true,
      message: 'Student profile approved successfully',
      data: student
    });
  } catch (error) {
    console.error('Error approving student profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve student profile'
    });
  }
});

// @route   PUT /api/student/profile/:studentId/reject
// @desc    Reject student profile (TPO/Superadmin only)
// @access  Private (TPO/Superadmin)
router.put('/profile/:studentId/reject', authenticateToken, async (req, res) => {
  try {
    // Check if user has permission to reject profiles
    if (!['tpo', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. TPO or Superadmin role required.'
      });
    }

    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    // Try Student collection first, then User collection
    let student = await Student.findById(req.params.studentId);
    let isStudentCollection = true;
    if (!student) {
      student = await User.findById(req.params.studentId);
      isStudentCollection = false;
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update student approval status
    if (isStudentCollection) {
      student.verificationStatus = 'rejected';
      student.verificationNotes = reason;
    } else {
      student.approvalStatus = 'Rejected';
      student.rejectedAt = new Date();
      student.rejectedBy = req.user._id;
      student.rejectionReason = reason;
    }
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
    console.error('Error rejecting student profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject student profile'
    });
  }
});

// @route   GET /api/student/internship-offers
// @desc    Get internship offers for students
// @access  Private (Student)
router.get('/internship-offers', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const { page = 1, limit = 12, search, category, location, type } = req.query;
    const skip = (page - 1) * limit;

    // Get student's college name for filtering
    let collegeName = null;

    // Check Student collection first (new structure)
    if (req.user.constructor.modelName === 'Student') {
      collegeName = req.user.collegeName;
    } else {
      // Fallback to User collection (legacy)
      const studentUser = await User.findById(req.user._id);
      collegeName = studentUser?.student?.collegeName;
    }

    if (!collegeName) {
      return res.status(400).json({
        success: false,
        message: 'Student profile not found or college not configured'
      });
    }

    // Build filter query — check both employmentType (new form) and legacy type field
    const filter = {
      $or: [
        { employmentType: 'internship' },
        { type: 'internship' }
      ],
      isActive: true,
      $and: [
        {
          $or: [
            { applicationDeadline: { $gte: new Date() } },
            { deadline: { $gte: new Date() } }
          ]
        },
        {
          $or: [
            { targetColleges: { $in: [collegeName] } },
            { targetColleges: { $exists: false } },
            { targetColleges: { $size: 0 } }
          ]
        }
      ]
    };

    if (search) {
      filter.$and = [
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'company.company.companyName': { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }

    if (category && category !== 'All') {
      filter.$or = [
        { category: category },
        { jobCategory: category },
        { department: category }
      ];
    }

    if (location && location !== 'All') {
      filter.$or = [
        { location: { $regex: location, $options: 'i' } },
        { companyLocation: { $regex: location, $options: 'i' } },
        { workLocations: { $regex: location, $options: 'i' } }
      ];
    }

    if (req.query.workMode && req.query.workMode !== 'All') {
      filter.workMode = req.query.workMode.toLowerCase();
    }

    if (req.query.duration && req.query.duration !== 'All') {
      filter.internshipDuration = { $regex: req.query.duration, $options: 'i' };
    }

    if (req.query.ppo && req.query.ppo !== 'All') {
      filter.ppoPossibility = req.query.ppo === 'Yes' ? { $in: ['yes', 'performance_based'] } : 'no';
    }

    if (req.query.stipend && req.query.stipend !== 'All') {
      if (req.query.stipend === 'Paid') {
        filter.stipend = { $gt: 0 };
      } else if (req.query.stipend === 'Unpaid') {
        filter.$or = [{ stipend: 0 }, { stipend: { $exists: false } }];
      }
    }

    // Get internships with pagination
    const internships = await JobPosting.find(filter)
      .populate('company', 'companyName email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalInternships = await JobPosting.countDocuments(filter);
    const totalPages = Math.ceil(totalInternships / limit);

    // Check if current user has applied to each internship
    const studentId = req.user._id;
    const userApplications = await JobApplication.find({
      student: studentId,
      jobPosting: { $in: internships.map(job => job._id) }
    });

    const appliedJobIds = new Set(userApplications.map(app => app.jobPosting.toString()));

    // Add application status to each internship
    const internshipsWithStatus = internships.map(internship => {
      const internshipObj = internship.toObject();
      const companyDoc = internship.company;
      
      // Fallback for company logo from company profile (Cloudinary)
      internshipObj.companyLogo = internship.companyLogo || companyDoc?.profilePicture || null;
      
      internshipObj.hasApplied = appliedJobIds.has(internship._id.toString());
      internshipObj.applicationCount = internship.applicationCount || 0;

      // Determine status based on deadline
      const now = new Date();
      const deadline = new Date(internship.deadline);
      if (deadline < now) {
        internshipObj.status = 'expired';
      } else if (deadline.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) { // Less than 7 days
        internshipObj.status = 'urgent';
      } else {
        internshipObj.status = 'active';
      }

      return internshipObj;
    });

    res.json({
      success: true,
      data: {
        internships: internshipsWithStatus,
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

// @route   POST /api/student/internship-offers/:internshipId/apply
// @desc    Apply for an internship
// @access  Private (Student)
router.post('/internship-offers/:internshipId/apply', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const { internshipId } = req.params;
    const studentId = req.user._id;

    // Check if internship exists and is active
    const internship = await JobPosting.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    if (!internship.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This internship is no longer active'
      });
    }

    if (new Date(internship.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check if student has already applied
    const existingApplication = await JobApplication.findOne({
      student: studentId,
      jobPosting: internshipId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this internship'
      });
    }

    // Create new application
    const application = new JobApplication({
      student: studentId,
      jobPosting: internshipId,
      company: internship.company,
      status: 'applied',
      appliedDate: new Date()
    });

    await application.save();

    // Update application count on job posting
    await JobPosting.findByIdAndUpdate(internshipId, {
      $inc: { applicationCount: 1 }
    });

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Error applying for internship:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application'
    });
  }
});

// @route   GET /api/student/internship-applications
// @desc    Get student's internship applications
// @access  Private (Student)
router.get('/internship-applications', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const studentId = req.user._id;

    const applications = await JobApplication.find({
      student: studentId,
      'jobPosting.type': 'internship'
    })
      .populate('jobPosting', 'title company companyLogo location deadline description requirements responsibilities skills duration package type')
      .populate('company', 'companyName email profilePicture')
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      data: {
        applications: applications.map(app => ({
          id: app._id,
          internshipTitle: app.jobPosting?.title,
          logo: app.jobPosting?.companyLogo || app.company?.profilePicture || null,
          company: app.company?.companyName,
          location: app.jobPosting?.location,
          status: app.status,
          appliedDate: app.appliedDate,
          deadline: app.jobPosting?.deadline
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

// @route   POST /api/student/upload-picture
// @desc    Upload student profile picture to Cloudinary
// @access  Private (Student)
router.post('/upload-picture', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const multer = require('multer');
    const cloudinary = require('cloudinary').v2;

    // Configure Cloudinary (uses env vars)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Check if Cloudinary is configured
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name'
    ) {
      return res.status(503).json({
        success: false,
        message: 'Cloudinary is not configured yet. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file.'
      });
    }

    // Use memory storage so file is in req.file.buffer
    const upload = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed'), false);
        }
      }
    }).single('picture');

    // Run multer as a promise
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload to Cloudinary using stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'student_profiles',
          public_id: `student_${req.user._id}`,
          overwrite: true,
          resource_type: 'image',
          transformation: [{ width: 400, height: 400, crop: 'limit', quality: 'auto' }]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Save Cloudinary URL to student profile
    // Try Student collection first, then User collection
    let student = await Student.findById(req.user._id);
    let isStudentCollection = true;
    if (!student) {
      student = await User.findById(req.user._id);
      isStudentCollection = false;
    }

    if (student) {
      if (isStudentCollection) {
        student.profilePicture = uploadResult.secure_url;
      } else {
        student.student = student.student || {};
        student.student.profilePicture = uploadResult.secure_url;
      }
      await student.save();
    }

    res.json({
      success: true,
      url: uploadResult.secure_url,
      message: 'Profile picture uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ success: false, message: 'Failed to upload profile picture', details: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET  /api/student/profile
// @desc    Get the logged-in student's full profile (mapped to frontend shape)
// @access  Private (Student)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/profile', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password -emailVerificationOTP -passwordResetToken');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const profile = {
      // identity
      name: student.name || '',
      email: student.email || '',
      phone: student.phoneNumber || '',
      address: student.address?.city
        ? `${student.address.city}${student.address.state ? ', ' + student.address.state : ''}`
        : '',
      summary: student.summary || '',
      profilePicture: student.profilePicture || '',

      // academics
      branch: student.branch || '',
      cgpa: student.cgpa || '',
      graduationYear: student.graduationYear || '',
      rollNumber: student.rollNumber || '',
      collegeName: student.collegeName || '',
      currentBacklogs: student.currentBacklogs || 0,

      // links
      linkedin: student.linkedinUrl || '',
      github: student.githubUrl || '',
      portfolio: student.portfolioUrl || '',

      // arrays for ResumeBuilder
      skills: (student.skills || []).map(s => s.name).filter(Boolean),

      education: student.resumeEducation && student.resumeEducation.length
        ? student.resumeEducation
        : (student.collegeName ? [{
          degree: student.degree || 'B.Tech',
          institution: student.collegeName || '',
          year: String(student.graduationYear || ''),
          gpa: String(student.cgpa || ''),
          achievements: ''
        }] : [{ degree: '', institution: '', year: '', gpa: '', achievements: '' }]),

      experience: student.resumeExperience && student.resumeExperience.length
        ? student.resumeExperience
        : (student.internships || []).map(i => ({
          title: i.role || '',
          company: i.company || '',
          duration: '',
          description: i.description || ''
        })),

      projects: (student.projects || []).map(p => ({
        name: p.title || '',
        description: p.description || '',
        technologies: (p.technologies || []).join(', '),
        link: p.githubUrl || p.liveUrl || ''
      })),

      certifications: (student.certifications || []).map(c => ({
        name: c.name || '',
        issuer: c.issuer || '',
        year: c.issueDate ? new Date(c.issueDate).getFullYear().toString() : ''
      })),

      // placement
      isPlaced: student.isPlaced || false,
      placementDetails: student.placementDetails || null,

      // meta
      profileCompletion: student.profileCompletion || 0,
      verificationStatus: student.verificationStatus || 'pending',
    };

    return res.json({ success: true, data: profile });
  } catch (err) {
    console.error('GET /profile error:', err);
    return res.status(500).json({ success: false, message: 'Server error', details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT  /api/student/profile
// @desc    Update the logged-in student's profile (accepts ResumeBuilder shape)
// @access  Private (Student)
// ─────────────────────────────────────────────────────────────────────────────
router.put('/profile', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const studentId = req.user._id;
    const d = req.body;

    // Build the $set payload progressively so we only touch fields that were sent
    const $set = {};

    // ── Basic fields ─────────────────────────────────────────────────────────
    if (d.name != null) $set.name = d.name;
    if (d.phoneNumber != null) $set.phoneNumber = d.phoneNumber;
    if (d.phone != null) $set.phoneNumber = d.phone;   // alias
    if (d.summary != null) $set.summary = d.summary;
    if (d.degree != null) $set.degree = d.degree;

    // ── Address ──────────────────────────────────────────────────────────────
    // Accept a flat "City, State" string (from profile page) or nested object
    const rawAddr = d.personalInfo?.address ?? d.address;
    if (rawAddr != null) {
      if (typeof rawAddr === 'string') {
        $set['address.city'] = rawAddr;
      } else {
        if (rawAddr.city != null) $set['address.city'] = rawAddr.city;
        if (rawAddr.state != null) $set['address.state'] = rawAddr.state;
        if (rawAddr.country != null) $set['address.country'] = rawAddr.country;
        if (rawAddr.zipCode != null) $set['address.zipCode'] = rawAddr.zipCode;
      }
    }

    // ── Academics ────────────────────────────────────────────────────────────
    const validBranches = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE', 'AI&DS', 'Other'];
    if (d.branch != null) {
      $set.branch = validBranches.includes(d.branch) ? d.branch : 'Other';
    }
    if (d.cgpa != null) {
      const parsed = parseFloat(d.cgpa);
      if (!isNaN(parsed)) $set.cgpa = parsed;
    }
    if (d.graduationYear != null) {
      const parsed = parseInt(d.graduationYear);
      if (!isNaN(parsed)) $set.graduationYear = parsed;
    }

    // ── Links ────────────────────────────────────────────────────────────────
    if (d.links?.linkedin != null) $set.linkedinUrl = d.links.linkedin;
    if (d.links?.github != null) $set.githubUrl = d.links.github;
    if (d.links?.portfolio != null) $set.portfolioUrl = d.links.portfolio;
    if (d.linkedinUrl != null) $set.linkedinUrl = d.linkedinUrl;
    if (d.githubUrl != null) $set.githubUrl = d.githubUrl;
    if (d.portfolioUrl != null) $set.portfolioUrl = d.portfolioUrl;

    // ── Skills ───────────────────────────────────────────────────────────────
    // Accept { technicalSkills:[] }, plain string[], or comma string
    if (d.skills != null) {
      let raw = [];
      if (d.skills?.technicalSkills) {
        raw = [...(d.skills.technicalSkills || []), ...(d.skills.softSkills || [])];
      } else if (Array.isArray(d.skills)) {
        raw = d.skills.map(s => (typeof s === 'string' ? s : s?.name)).filter(Boolean);
      } else if (typeof d.skills === 'string') {
        raw = d.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
      $set.skills = raw.map(name => ({ name, proficiency: 'Intermediate' }));
    }

    // ── Resume builder arrays ─────────────────────────────────────────────────
    if (Array.isArray(d.education)) $set.resumeEducation = d.education;
    if (Array.isArray(d.experience)) $set.resumeExperience = d.experience;

    // Projects: translate { name, description, technologies, link } → Student schema
    if (Array.isArray(d.projects)) {
      $set.projects = d.projects.filter(p => p.name).map(p => ({
        title: p.name || '',
        description: p.description || '',
        technologies: (p.technologies || '').split(',').map(t => t.trim()).filter(Boolean),
        githubUrl: p.link || '',
        liveUrl: '',
      }));
    }

    // Certifications
    if (Array.isArray(d.certifications)) {
      $set.certifications = d.certifications.filter(c => c.name).map(c => ({
        name: c.name || '',
        issuer: c.issuer || '',
        issueDate: c.year ? new Date(`${c.year}-01-01`) : undefined,
      }));
    }

    // ── Persist ───────────────────────────────────────────────────────────────
    // runValidators: false  → skip schema validators (graduationYear min, branch enum etc.)
    //                          those validators guard REGISTRATION, not profile updates
    const updated = await Student.findByIdAndUpdate(
      studentId,
      { $set },
      { new: true, runValidators: false }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Recalculate profile completion and save silently
    try {
      updated.calculateProfileCompletion();
      await Student.findByIdAndUpdate(
        studentId,
        { $set: { profileCompletion: updated.profileCompletion } },
        { runValidators: false }
      );
    } catch (_) { /* non-critical */ }

    return res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('PUT /profile error:', err.message, err.stack);
    return res.status(500).json({ success: false, message: 'Server error', details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET  /api/student/profile/approval-status
// @desc    Get TPO verification status for the current student
// @access  Private (Student)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/profile/approval-status', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .select('verificationStatus verificationNotes verifiedAt name email branch cgpa');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    return res.json({
      success: true,
      data: {
        status: student.verificationStatus || 'pending',
        notes: student.verificationNotes || '',
        verifiedAt: student.verifiedAt || null,
        student: {
          name: student.name,
          email: student.email,
          branch: student.branch,
          cgpa: student.cgpa,
        }
      }
    });
  } catch (err) {
    console.error('GET /profile/approval-status error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
