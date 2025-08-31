const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
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

    // Get student data
    const student = await User.findById(studentId).select('student');
    
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
      .populate('jobPosting', 'title')
      .populate('company', 'company.companyName')
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
    .populate('jobPosting', 'title')
    .populate('company', 'company.companyName')
    .sort({ interviewDate: 1 })
    .limit(3);

    res.json({
      success: true,
      data: {
        student: student.student,
        stats: {
          applicationsSubmitted: applicationStats.total,
          practiceSessions: practiceStats.total,
          skillsMastered,
          averageTestScore: practiceStats.averageScore,
          interviewsScheduled: upcomingInterviews.length,
          profileCompletion: student.student.profileCompletion || 0
        },
        recentActivities: [
          ...recentApplications.map(app => ({
            id: app._id,
            message: `Applied for ${app.jobPosting?.title || 'position'} at ${app.company?.company?.companyName || 'Company'}`,
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
          task: `Interview for ${interview.jobPosting?.title || 'position'} at ${interview.company?.company?.companyName || 'Company'}`,
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
      page = 1, 
      limit = 10,
      sortBy = 'postedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (minSalary) {
      query['package.min'] = { $gte: parseInt(minSalary) * 100000 }; // Convert LPA to actual amount
    }
    
    if (maxSalary) {
      query['package.max'] = { $lte: parseInt(maxSalary) * 100000 };
    }
    
    if (experience) {
      query['experience.max'] = { $lte: parseInt(experience) };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await JobPosting.find(query)
      .populate('company', 'company.companyName company.industry company.logo')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await JobPosting.countDocuments(query);

    // Get unique values for filters
    const locations = await JobPosting.distinct('location', { isActive: true });
    const categories = await JobPosting.distinct('category', { isActive: true });
    const types = await JobPosting.distinct('type', { isActive: true });

    res.json({
      success: true,
      data: {
        jobs: jobs.map(job => ({
          id: job._id,
          title: job.title,
          company: job.company?.company?.companyName || 'Company',
          companyLogo: job.company?.company?.logo || null,
          location: job.location,
          salary: job.package ? 
            `₹${job.package.min/100000}-${job.package.max/100000} LPA` : 
            'Not specified',
          experience: job.experience ? 
            `${job.experience.min}-${job.experience.max} years` : 
            'Not specified',
          jobType: job.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          department: job.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: job.description,
          requirements: job.requirements || [],
          responsibilities: job.responsibilities || [],
          skills: job.skills || [],
          postedDate: job.postedAt,
          deadline: job.deadline,
          applications: job.applicationCount,
          views: job.views,
          isRemote: job.location?.toLowerCase().includes('remote') || false
        })),
        filters: {
          locations: locations.filter(loc => loc).sort(),
          categories: categories.map(cat => ({
            value: cat,
            label: cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
          })),
          types: types.map(type => ({
            value: type,
            label: type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
          }))
        },
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/student/jobs/:jobId/apply
// @desc    Apply for a job
// @access  Private (Student)
router.post('/jobs/:jobId/apply', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const studentId = req.user._id;
    const jobId = req.params.jobId;
    const { coverLetter, portfolio, availability, salary } = req.body;

    // Check if job exists and is active
    const job = await JobPosting.findOne({ _id: jobId, isActive: true });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or inactive'
      });
    }

    // Check if already applied
    const existingApplication = await JobApplication.findOne({
      student: studentId,
      jobPosting: jobId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create application
    const application = new JobApplication({
      student: studentId,
      jobPosting: jobId,
      company: job.company,
      coverLetter,
      portfolio,
      availability,
      expectedSalary: salary,
      status: 'applied',
      appliedDate: new Date()
    });

    await application.save();

    // Update job application count
    await JobPosting.findByIdAndUpdate(jobId, {
      $inc: { applicationCount: 1 }
    });

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId: application._id,
        status: 'applied'
      }
    });

  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/student/applications
// @desc    Get student's job applications
// @access  Private (Student)
router.get('/applications', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const studentId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { student: studentId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const applications = await JobApplication.find(query)
      .populate('jobPosting', 'title category package location type')
      .populate('company', 'company.companyName company.industry')
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
      { $group: { _id: '$jobPosting.category', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        applications: applications.map(app => ({
          id: app._id,
          logo: null, // You can add company logos later
          role: app.jobPosting?.title || 'Position',
          company: app.company?.company?.companyName || 'Company',
          salary: app.jobPosting?.package ? 
            `₹${app.jobPosting.package.min/100000}-${app.jobPosting.package.max/100000} LPA` : 
            'Not specified',
          status: {
            label: app.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            color: getStatusColor(app.status)
          },
          appliedDate: app.appliedDate
        })),
        stats,
        categoryStats: categoryStats.map(cat => ({
          label: cat._id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
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
     .populate('company', 'company.companyName');

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
      { $group: { 
        _id: '$category', 
        count: { $sum: 1 },
        averageScore: { $avg: '$score' },
        totalTime: { $sum: '$timeSpent' }
      }}
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

// @route   GET /api/student/placement-history
// @desc    Get student's placement history and achievements
// @access  Private (Student)
router.get('/placement-history', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get all applications with detailed information
    const applications = await JobApplication.find({ student: studentId })
      .populate('jobPosting', 'title category package location type')
      .populate('company', 'company.companyName company.industry')
      .sort({ appliedDate: -1 });

    // Calculate placement statistics
    const totalApplications = applications.length;
    const offersReceived = applications.filter(app => app.status === 'offer_received').length;
    const companiesApplied = new Set(applications.map(app => app.company?._id?.toString())).size;
    const successRate = totalApplications > 0 ? Math.round((offersReceived / totalApplications) * 100) : 0;

    // Get placement stats
    const placementStats = [
      { label: 'Offers Received', value: offersReceived.toString(), color: 'text-green-600' },
      { label: 'Companies Applied', value: companiesApplied.toString(), color: 'text-blue-600' },
      { label: 'Success Rate', value: `${successRate}%`, color: 'text-purple-600' }
    ];

    // Create company timeline with detailed information
    const companyTimeline = applications.map(app => {
      const timeline = [];
      
      // Add application step
      timeline.push({
        step: 'Applied',
        date: app.appliedDate,
        status: 'completed'
      });

      // Add test steps if applicable
      if (['test_scheduled', 'test_completed', 'interview_scheduled', 'interview_completed', 'offer_received'].includes(app.status)) {
        timeline.push({
          step: 'Test Passed',
          date: app.testDate || new Date(app.appliedDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          status: 'completed'
        });
      }

      // Add interview steps if applicable
      if (['interview_scheduled', 'interview_completed', 'offer_received'].includes(app.status)) {
        timeline.push({
          step: 'Interview',
          date: app.interviewDate || new Date(app.appliedDate.getTime() + 14 * 24 * 60 * 60 * 1000),
          status: app.status === 'offer_received' ? 'completed' : 'scheduled'
        });
      }

      // Add offer step if received
      if (app.status === 'offer_received') {
        timeline.push({
          step: 'Offer',
          date: app.offerDetails?.joiningDate || new Date(app.appliedDate.getTime() + 21 * 24 * 60 * 60 * 1000),
          status: 'completed'
        });
      }

      return {
        id: app._id,
        logo: null, // You can add company logos later
        company: app.company?.company?.companyName || 'Company',
        role: app.jobPosting?.title || 'Position',
        timeline,
        status: {
          label: app.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          color: getStatusColor(app.status)
        },
        offerDetails: app.status === 'offer_received' ? 
          `${app.offerDetails?.package || 'Package'}, ${app.offerDetails?.role || 'Role'}, Joining: ${app.offerDetails?.joiningDate ? new Date(app.offerDetails.joiningDate).toLocaleDateString() : 'TBD'}` : 
          null
      };
    });

    // Generate achievements based on applications
    const achievements = [];
    
    if (offersReceived > 0) {
      achievements.push({
        title: 'First Offer',
        description: `Received first job offer from ${applications.find(app => app.status === 'offer_received')?.company?.company?.companyName || 'Company'}`,
        date: applications.find(app => app.status === 'offer_received')?.appliedDate?.toLocaleDateString() || 'Recent',
        icon: 'FaTrophy'
      });
    }

    const interviewCount = applications.filter(app => ['interview_scheduled', 'interview_completed', 'offer_received'].includes(app.status)).length;
    if (interviewCount > 0) {
      achievements.push({
        title: 'Interview Success',
        description: `Cleared ${interviewCount} technical interviews`,
        date: 'Recent',
        icon: 'FaCheckCircle'
      });
    }

    const highScoreTests = applications.filter(app => app.testScore && app.testScore >= 90).length;
    if (highScoreTests > 0) {
      achievements.push({
        title: 'Test Excellence',
        description: `Scored 90%+ in ${highScoreTests} coding tests`,
        date: 'Recent',
        icon: 'FaChartBar'
      });
    }

    // Calculate performance metrics
    const interviewSuccessRate = interviewCount > 0 ? Math.round((offersReceived / interviewCount) * 100) : 0;
    const averageResponseTime = applications.length > 0 ? 
      Math.round(applications.reduce((sum, app) => {
        const responseTime = app.testDate ? (app.testDate - app.appliedDate) / (1000 * 60 * 60 * 24) : 7;
        return sum + responseTime;
      }, 0) / applications.length) : 0;

    const highestPackage = applications
      .filter(app => app.status === 'offer_received' && app.offerDetails?.package)
      .reduce((max, app) => {
        const packageValue = parseInt(app.offerDetails.package.replace(/[^\d]/g, ''));
        return packageValue > max ? packageValue : max;
      }, 0);

    // Get upcoming interviews
    const upcomingInterviews = applications
      .filter(app => app.status === 'interview_scheduled' && app.interviewDate > new Date())
      .map(app => ({
        company: app.company?.company?.companyName || 'Company',
        role: app.jobPosting?.title || 'Position',
        date: app.interviewDate,
        time: app.interviewDate.toLocaleTimeString()
      }));

    res.json({
      success: true,
      data: {
        placementStats,
        companyTimeline,
        achievements,
        performanceSummary: {
          applicationSuccessRate: successRate,
          interviewSuccessRate,
          averageResponseTime: `${averageResponseTime} days`,
          highestPackage: highestPackage > 0 ? `₹${highestPackage} LPA` : 'N/A'
        },
        upcomingEvents: upcomingInterviews
      }
    });

  } catch (error) {
    console.error('Placement history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/student/profile
// @desc    Get student profile
// @access  Private (Student)
router.get('/profile', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const studentId = req.user._id;
    
    const user = await User.findById(studentId).select('student');
    
    if (!user || !user.student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.json({
      success: true,
      data: user.student
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/student/profile
// @desc    Update student profile
// @access  Private (Student)
router.put('/profile', [
  authenticateToken,
  ensureStudent,
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('cgpa').optional().isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),
  body('skills').optional().isObject().withMessage('Skills must be an object')
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
    const updateData = {};

    // Build update object based on provided fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        updateData[`student.${key}`] = req.body[key];
      }
    });

    // Calculate profile completion
    const profileCompletion = calculateProfileCompletion(req.body);

    const updatedUser = await User.findByIdAndUpdate(
      studentId,
      {
        ...updateData,
        'student.profileCompletion': profileCompletion
      },
      { new: true }
    ).select('student');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser.student
    });

  } catch (error) {
    console.error('Profile update error:', error);
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
      .populate('company', 'company.companyName')
      .sort({ appliedDate: -1 })
      .limit(5);

    // Get upcoming interviews
    const upcomingInterviews = await JobApplication.find({
      student: studentId,
      status: 'interview_scheduled',
      interviewDate: { $gte: new Date() }
    })
    .populate('jobPosting', 'title')
    .populate('company', 'company.companyName')
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
    const student = await User.findById(studentId).select('student');
    if (student.student.profileCompletion < 80) {
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

// @route   GET /api/student/profile/approval-status
// @desc    Get student profile approval status
// @access  Private (Student)
router.get('/profile/approval-status', authenticateToken, ensureStudent, async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: {
        approvalStatus: student.approvalStatus || 'Pending',
        approvedAt: student.approvedAt,
        approvedBy: student.approvedBy,
        rejectedAt: student.rejectedAt,
        rejectedBy: student.rejectedBy,
        rejectionReason: student.rejectionReason
      }
    });
  } catch (error) {
    console.error('Error fetching approval status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approval status'
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

    const student = await User.findById(req.params.studentId);
    
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

    const student = await User.findById(req.params.studentId);
    
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

    // Build filter query
    const filter = {
      type: 'internship',
      isActive: true,
      deadline: { $gte: new Date() } // Only show active internships
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'company.companyName': { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (location && location !== 'All') {
      filter.location = location;
    }

    if (type && type !== 'All') {
      filter.internshipType = type;
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
    .populate('jobPosting', 'title company location deadline')
    .populate('company', 'companyName')
    .sort({ appliedDate: -1 });

    res.json({
      success: true,
      data: {
        applications: applications.map(app => ({
          id: app._id,
          internshipTitle: app.jobPosting?.title,
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

module.exports = router;
