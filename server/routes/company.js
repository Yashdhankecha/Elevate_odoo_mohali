const express = require('express');
const router = express.Router();
const { authenticateToken: auth } = require('../middleware/auth');
const JobPosting = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const Interview = require('../models/Interview');
const Company = require('../models/Company');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const TPOAction = require('../models/TPOAction');
const TPO = require('../models/TPO');
const { sendStatusUpdateEmail } = require('../utils/emailService');

// Middleware to ensure user is a company
const ensureCompany = async (req, res, next) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Access denied. Company role required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== TPO LIST (for on-campus drive college selector) ====================

// Get all active TPOs so company can select target colleges for on-campus drives
router.get('/tpo-list', auth, ensureCompany, async (req, res) => {
  try {
    const tpos = await TPO.find({ status: 'active' })
      .select('_id name instituteName email contactNumber')
      .sort({ instituteName: 1 });

    res.json(tpos.map(t => ({
      _id: t._id,
      name: t.name,
      instituteName: t.instituteName,
      email: t.email,
      contactNumber: t.contactNumber,
    })));
  } catch (error) {
    console.error('Error fetching TPO list:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== JOB MANAGEMENT ====================

// Get all jobs for the company
router.get('/jobs', auth, ensureCompany, async (req, res) => {
  try {
    const jobs = await JobPosting.find({ company: req.user._id })
      .sort({ createdAt: -1 });

    // Calculate application counts for each job
    const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
      const applicationCount = await JobApplication.countDocuments({ jobPosting: job._id });
      return {
        ...job.toObject(),
        applicationCount
      };
    }));

    res.json(jobsWithCounts);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single job posting with full details
router.get('/jobs/:id', auth, ensureCompany, async (req, res) => {
  try {
    const job = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const applicationCount = await JobApplication.countDocuments({ jobPosting: job._id });
    res.json({ ...job.toObject(), applicationCount });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new job (supports both legacy simple form and new comprehensive form)
router.post('/jobs', auth, ensureCompany, async (req, res) => {
  try {
    const body = req.body;

    // Detect if this is a comprehensive form submission (has jobTitle field)
    if (body.jobTitle) {
      // Comprehensive job posting form
      const job = new JobPosting({
        ...body,
        company: req.user._id,
        createdBy: req.user._id,
        status: body.status || 'draft',
        isActive: false
      });
      // If saving as draft, bypass validation so partial forms work
      if (job.status === 'draft') {
        await job.save({ validateBeforeSave: false });
      } else {
        await job.save();
      }

      // If submitting for on-campus, set pending approval and notify TPOs
      if (body.status === 'pending_approval' && body.driveType === 'on_campus') {
        // Find all TPOs to notify
        const tpos = await TPO.find({ status: 'active' }).limit(50);
        for (const tpo of tpos) {
          await Notification.createNotification({
            recipient: tpo._id,
            title: 'New On-Campus Job Posting Pending Approval',
            message: `${body.companyName} has submitted a new on-campus job posting for "${body.jobTitle}". Review and approve.`,
            type: 'job',
            priority: 'high',
            relatedData: { jobPostingId: job._id, jobId: job.jobId }
          });
        }
      }

      // If off-campus, auto-publish
      if (body.status === 'active' && body.driveType === 'off_campus') {
        job.isActive = true;
        job.postedAt = new Date();
        await job.save();
      }

      return res.status(201).json(job);
    }

    // Legacy simple form
    const { title, department, description, requirements, location, salary, type, deadline, skills, experience } = body;

    let packageMin = 0;
    let packageMax = 0;
    if (salary && typeof salary === 'string') {
      const matches = salary.match(/(\d+)/g);
      if (matches) {
        packageMin = matches[0] ? parseInt(matches[0]) * 100000 : 0;
        packageMax = matches[1] ? parseInt(matches[1]) * 100000 : packageMin;
      }
    } else if (salary && typeof salary === 'object') {
      packageMin = salary.min;
      packageMax = salary.max;
    }

    const job = new JobPosting({
      company: req.user._id,
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      location,
      package: { min: packageMin, max: packageMax, currency: 'INR' },
      type: type || 'full-time',
      deadline: new Date(deadline),
      skills: Array.isArray(skills) ? skills : [],
      category: department || 'software-engineering',
      isActive: true,
      experience: experience || { min: 0, max: 2 }
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    require('fs').appendFileSync('job_create_error.log', new Date().toISOString() + ': ' + error.stack + '\n');
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Save job as draft (partial data ok)
router.patch('/jobs/:id/draft', auth, ensureCompany, async (req, res) => {
  try {
    const job = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (!['draft', 'changes_requested'].includes(job.status)) {
      return res.status(400).json({ message: 'Can only save drafts for draft or changes-requested jobs' });
    }

    // Merge partial data
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'company' && key !== 'jobId') {
        job[key] = req.body[key];
      }
    });
    job.status = 'draft';
    await job.save({ validateBeforeSave: false });
    res.json(job);
  } catch (error) {
    console.error('Error saving draft:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit job for approval (on-campus) or publish (off-campus)
router.post('/jobs/:id/submit', auth, ensureCompany, async (req, res) => {
  try {
    const job = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (!['draft', 'changes_requested'].includes(job.status)) {
      return res.status(400).json({ message: 'Job cannot be submitted in its current state' });
    }

    if (job.driveType === 'on_campus') {
      job.status = 'pending_approval';
      await job.save();

      // Notify TPOs
      const tpos = await TPO.find({ status: 'active' }).limit(50);
      for (const tpo of tpos) {
        await Notification.createNotification({
          recipient: tpo._id,
          title: 'Job Posting Pending Approval',
          message: `${job.companyName || 'A company'} submitted "${job.jobTitle || job.title}" for on-campus drive review.`,
          type: 'job',
          priority: 'high',
          relatedData: { jobPostingId: job._id, jobId: job.jobId }
        });
      }

      res.json({ message: 'Job submitted for TPO approval', job });
    } else {
      // Off-campus: auto-publish
      job.status = 'active';
      job.isActive = true;
      job.postedAt = new Date();
      await job.save();
      res.json({ message: 'Job published successfully', job });
    }
  } catch (error) {
    console.error('Error submitting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a job (supports both legacy and comprehensive form)
router.put('/jobs/:id', auth, ensureCompany, async (req, res) => {
  try {
    const job = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const body = req.body;

    // Comprehensive form update (has jobTitle)
    if (body.jobTitle) {
      const protectedFields = ['_id', 'company', 'jobId', 'createdBy', 'createdAt'];
      Object.keys(body).forEach(key => {
        if (!protectedFields.includes(key)) {
          job[key] = body[key];
        }
      });
      await job.save();
      return res.json(job);
    }

    // Legacy form update
    const { title, department, description, requirements, location, salary, type, deadline, status, skills } = body;

    if (title) job.title = title;
    if (department) job.category = department;
    if (description) job.description = description;
    if (requirements) job.requirements = Array.isArray(requirements) ? requirements : [requirements];
    if (location) job.location = location;

    if (salary) {
      let packageMin = 0;
      let packageMax = 0;
      if (typeof salary === 'string') {
        const matches = salary.match(/(\d+)/g);
        if (matches) {
          packageMin = matches[0] ? parseInt(matches[0]) * 100000 : 0;
          packageMax = matches[1] ? parseInt(matches[1]) * 100000 : packageMin;
        }
      } else {
        packageMin = salary.min;
        packageMax = salary.max;
      }
      job.package = { min: packageMin, max: packageMax, currency: 'INR' };
    }

    if (type) job.type = type;
    if (deadline) job.deadline = new Date(deadline);
    if (status) job.isActive = status === 'Active';
    if (skills) job.skills = Array.isArray(skills) ? skills : [];

    await job.save();
    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle a job's active status (open/close applications)
router.patch('/jobs/:id/toggle-active', auth, ensureCompany, async (req, res) => {
  try {
    const job = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const newIsActive = !job.isActive;
    const newStatus = newIsActive
      ? (job.status === 'closed' ? 'active' : job.status)
      : 'closed';

    // Use findByIdAndUpdate to bypass full-document validation on required fields
    const updated = await JobPosting.findByIdAndUpdate(
      job._id,
      { $set: { isActive: newIsActive, status: newStatus } },
      { new: true, runValidators: false }
    );

    res.json({
      isActive: updated.isActive,
      status: updated.status,
      message: `Job is now ${updated.isActive ? 'open' : 'closed'}`
    });
  } catch (error) {
    console.error('Error toggling job status:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Delete a job
router.delete('/jobs/:id', auth, ensureCompany, async (req, res) => {
  try {
    const job = await JobPosting.findOneAndDelete({ _id: req.params.id, company: req.user._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Optionally delete associated applications
    await JobApplication.deleteMany({ jobPosting: req.params.id });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for a specific job
router.get('/jobs/:id/applications', auth, ensureCompany, async (req, res) => {
  try {
    const job = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const applications = await JobApplication.find({ jobPosting: req.params.id })
      .populate('student', 'name email phoneNumber collegeName branch cgpa graduationYear resume profilePicture')
      .populate('jobPosting', 'title')
      .sort({ appliedDate: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== INTERVIEW SCHEDULING ====================

// Get all interviews for the company
router.get('/interviews', auth, ensureCompany, async (req, res) => {
  try {
    const interviews = await Interview.find({ company: req.user.id })
      .sort({ date: 1 });

    res.json(interviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new interview
router.post('/interviews', auth, ensureCompany, async (req, res) => {
  try {
    const {
      candidate,
      role,
      date,
      time,
      type,
      interviewer,
      location,
      duration,
      notes
    } = req.body;

    const interview = new Interview({
      company: req.user.id,
      candidate,
      role,
      date: new Date(date),
      time,
      type,
      interviewer,
      location,
      duration,
      notes
    });

    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an interview
router.put('/interviews/:id', auth, ensureCompany, async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, company: req.user.id });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
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
      notes
    } = req.body;

    interview.candidate = candidate || interview.candidate;
    interview.role = role || interview.role;
    interview.date = date ? new Date(date) : interview.date;
    interview.time = time || interview.time;
    interview.type = type || interview.type;
    interview.interviewer = interviewer || interview.interviewer;
    interview.location = location || interview.location;
    interview.duration = duration || interview.duration;
    interview.notes = notes || interview.notes;

    await interview.save();
    res.json(interview);
  } catch (error) {
    console.error('Error updating interview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an interview
router.delete('/interviews/:id', auth, ensureCompany, async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({ _id: req.params.id, company: req.user.id });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Error deleting interview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update interview status
router.patch('/interviews/:id/status', auth, ensureCompany, async (req, res) => {
  try {
    const { status } = req.body;

    const interview = await Interview.findOne({ _id: req.params.id, company: req.user.id });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.status = status;
    await interview.save();

    res.json(interview);
  } catch (error) {
    console.error('Error updating interview status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== DASHBOARD ====================

// Get dashboard statistics
// Get dashboard statistics
router.get('/dashboard/stats', auth, ensureCompany, async (req, res) => {
  try {
    const jobs = await JobPosting.find({ company: req.user._id });
    const interviews = await Interview.find({ company: req.user._id });
    const applications = await JobApplication.find({ company: req.user._id });

    const stats = {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => job.isActive).length,
      draftJobs: jobs.filter(job => !job.isActive).length,
      totalInterviews: interviews.length,
      scheduledInterviews: interviews.filter(interview => interview.status === 'Scheduled').length,
      completedInterviews: interviews.filter(interview => interview.status === 'Completed').length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'applied').length,
      shortlistedApplications: applications.filter(app => app.status === 'shortlisted' || app.status === 'interview_scheduled').length
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== APPLICATIONS ====================

// Get all applications for the company
// Get all applications for the company
router.get('/applications', auth, ensureCompany, async (req, res) => {
  try {
    const { status, job } = req.query;
    let query = { company: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (job) {
      query.jobPosting = job;
    }

    const applications = await JobApplication.find(query)
      .populate('student', 'name email phoneNumber')
      .populate('jobPosting', 'title category')
      .sort({ appliedDate: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific application details
// Get specific application details
router.get('/applications/:id', auth, ensureCompany, async (req, res) => {
  try {
    const application = await JobApplication.findOne({ _id: req.params.id, company: req.user._id })
      .populate('student', 'name email phoneNumber student.resume')
      .populate('jobPosting', 'title category description requirements');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const getTimelineEvent = (status) => {
  const configs = {
    'applied': { action: 'Application Received', description: 'Your application has been successfully transmitted to the company vault.' },
    'test_scheduled': { action: 'Assessment Phase', description: 'Technical assessment or aptitude test has been scheduled.' },
    'test_completed': { action: 'Evaluation in Progress', description: 'Your test results are currently under internal review.' },
    'interview_scheduled': { action: 'Interview Phase', description: 'Expert interviews have been coordinated with the hiring team.' },
    'interview_completed': { action: 'Final Deliberation', description: 'Interview rounds completed. Awaiting final decision.' },
    'offer_received': { action: 'Offer Generated', description: 'Congratulations! An offer has been issued for this position.' },
    'rejected': { action: 'Process Concluded', description: 'The application process for this position has ended.' },
    'withdrawn': { action: 'Mission Aborted', description: 'This application was voluntarily withdrawn from the process.' }
  };
  return configs[status] || { action: 'Status Updated', description: `Application status changed to ${status}.` };
};

// Update application status
router.patch('/applications/:id/status', auth, ensureCompany, async (req, res) => {
  try {
    const { status, roundName } = req.body;

    const application = await JobApplication.findOne({ _id: req.params.id, company: req.user._id })
      .populate('student', 'name email')
      .populate('jobPosting', 'title companyName');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== status || application.currentRoundName !== roundName) {
      application.status = status;
      if (roundName) application.currentRoundName = roundName;
      
      const event = getTimelineEvent(status);
      application.timeline.push({
        action: roundName || event.action,
        description: roundName ? `Advanced to ${roundName}.` : event.description,
        date: new Date()
      });
      await application.save();
    }

    // Send email to student
    if (application.student && application.student.email) {
      const companyData = await Company.findById(req.user._id);
      const companyName = companyData ? companyData.companyName : (application.jobPosting?.companyName || 'Elevate Tracker Company');
      
      await sendStatusUpdateEmail(
        application.student.email,
        application.student.name,
        companyName,
        application.jobPosting?.title || 'Job Role',
        status
      );
    }

    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Advance multiple applications to a new status (round)
router.post('/jobs/:id/advance-round', auth, ensureCompany, async (req, res) => {
  try {
    const { applicantIds, newStatus, roundName } = req.body;
    
    if (!applicantIds || !Array.isArray(applicantIds) || applicantIds.length === 0) {
      return res.status(400).json({ message: 'No applicants selected' });
    }

    const jobPosting = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const companyData = await Company.findById(req.user._id);
    const companyName = companyData ? companyData.companyName : (jobPosting.companyName || 'Elevate Tracker Company');

    let successCount = 0;

    for (const applicantId of applicantIds) {
      const application = await JobApplication.findOne({ _id: applicantId, jobPosting: jobPosting._id })
        .populate('student', 'name email');
      
      if (application) {
        if ((newStatus && application.status !== newStatus) || (roundName && application.currentRoundName !== roundName)) {
          if (newStatus) application.status = newStatus;
          if (roundName) application.currentRoundName = roundName;
          
          const event = getTimelineEvent(newStatus || application.status);
          application.timeline.push({
            action: roundName || event.action,
            description: roundName ? `Advanced to ${roundName}.` : event.description,
            date: new Date()
          });
          await application.save();
        }

        // Send standard status update email
        if (application.student && application.student.email) {
          await sendStatusUpdateEmail(
            application.student.email,
            application.student.name,
            companyName,
            jobPosting.title || jobPosting.jobTitle || 'Job Role',
            newStatus || application.status
          );
        }
        successCount++;
      }
    }

    res.json({ message: `Successfully updated ${successCount} applicants`, successCount });
  } catch (error) {
    console.error('Error updating applicants status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== COMPANY PROFILE ====================

// Get company profile — always fetch fresh from DB so all fields are present
router.get('/profile', auth, ensureCompany, async (req, res) => {
  try {
    const company = await Company.findById(req.user._id).select('-password -emailVerificationOTP -passwordResetToken');

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company.toObject());
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update company profile
router.put('/profile', auth, ensureCompany, async (req, res) => {
  try {
    const updateData = req.body;

    // Strip protected/internal fields from the update payload
    const protectedFields = ['_id', 'email', 'password', 'role', 'status', 'isVerified',
      'emailVerificationOTP', 'passwordResetToken', '__v'];
    const safeUpdate = {};
    Object.keys(updateData).forEach(key => {
      if (!protectedFields.includes(key) && updateData[key] !== undefined) {
        safeUpdate[key] = updateData[key];
      }
    });

    // Use findByIdAndUpdate with $set so all fields (including description) are saved reliably
    const updatedCompany = await Company.findByIdAndUpdate(
      req.user._id,
      { $set: safeUpdate },
      { new: true, runValidators: false, select: '-password -emailVerificationOTP -passwordResetToken' }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(updatedCompany.toObject());
  } catch (error) {
    console.error('Error updating company profile:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// ==================== COMPANY LOGO UPLOAD (Cloudinary) ====================

// Upload company logo to Cloudinary
router.post('/upload-logo', auth, ensureCompany, async (req, res) => {
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
    }).single('logo');

    // Run multer as a promise
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary using stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'company_logos',
          public_id: `company_${req.user._id}`,
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

    // Save Cloudinary URL to company profile
    const company = await Company.findById(req.user._id);
    if (company) {
      company.profilePicture = uploadResult.secure_url;
      await company.save();
    }

    res.json({
      url: uploadResult.secure_url,
      message: 'Logo uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ message: 'Failed to upload logo', details: error.message });
  }
});

// ==================== ANALYTICS & REPORTS ====================

// Get recruitment analytics for company dashboard
router.get('/analytics', auth, ensureCompany, async (req, res) => {
  try {
    const companyId = req.user._id;
    const { period } = req.query;

    // Build date filter based on period
    let dateFilter = {};
    const now = new Date();
    if (period === 'last_6_months') {
      dateFilter = { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 6)) } };
    } else if (period === 'last_3_months') {
      dateFilter = { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 3)) } };
    } else if (period === 'current_month') {
      dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
    }

    // 1. Overview Stats
    const totalJobs = await JobPosting.countDocuments({ company: companyId });
    const activeJobs = await JobPosting.countDocuments({ company: companyId, status: 'active' });
    const totalApplications = await JobApplication.countDocuments({ company: companyId, ...dateFilter });
    const shortlistedCandidates = await JobApplication.countDocuments({ 
      company: companyId, 
      status: { $in: ['test_scheduled', 'test_completed', 'interview_scheduled', 'interview_completed'] },
      ...dateFilter
    });
    const hiredCandidates = await JobApplication.countDocuments({ 
      company: companyId, 
      status: 'offer_received',
      ...dateFilter
    });

    // 2. Job-wise Stats (Performance Matrix)
    const jobs = await JobPosting.find({ company: companyId }).select('jobTitle employmentType applicationCount views');
    
    // For more detailed job stats, aggregate applications
    const jobStatsRaw = await JobApplication.aggregate([
      { $match: { company: companyId, ...dateFilter } },
      { $group: {
          _id: '$jobPosting',
          applications: { $sum: 1 },
          shortlisted: { $sum: { $cond: [{ $in: ['$status', ['test_scheduled', 'test_completed', 'interview_scheduled', 'interview_completed']] }, 1, 0] } },
          hired: { $sum: { $cond: [{ $eq: ['$status', 'offer_received'] }, 1, 0] } }
      }}
    ]);

    const jobStats = jobs.map(j => {
      const stats = jobStatsRaw.find(s => s._id.toString() === j._id.toString()) || { applications: 0, shortlisted: 0, hired: 0 };
      return {
        _id: j._id,
        title: j.jobTitle,
        type: j.employmentType,
        applications: stats.applications,
        shortlisted: stats.shortlisted,
        hired: stats.hired,
        status: activeJobs > 0 ? 'Active' : 'Closed' // Simple logic
      };
    }).sort((a, b) => b.applications - a.applications);

    // 3. Recent Hires (Delta Log)
    const recentHires = await JobApplication.find({ 
      company: companyId, 
      status: 'offer_received' 
    })
    .populate('student', 'name department')
    .sort({ updatedAt: -1 })
    .limit(5);

    // 4. Upcoming Interviews
    const upcomingInterviews = await Interview.find({
      company: companyId,
      status: 'Scheduled',
      date: { $gte: new Date() }
    })
    .sort({ date: 1, time: 1 })
    .limit(5);

    // 5. Response Time (Approximate - Difference between applied and last update)
    // In a real app, you'd track specific state transitions. 
    // Here we'll take a sample and average it.
    const responseSample = await JobApplication.find({ 
      company: companyId, 
      status: { $ne: 'applied' } 
    }).limit(50);
    
    let avgResponse = 0;
    if (responseSample.length > 0) {
      const totalDiff = responseSample.reduce((acc, curr) => {
        return acc + (curr.updatedAt - curr.appliedDate);
      }, 0);
      avgResponse = (totalDiff / responseSample.length / (1000 * 60 * 60 * 24)).toFixed(1);
    }

    res.json({
      overview: {
        totalJobs,
        activeJobs,
        totalApplications,
        shortlistedCandidates,
        hiredCandidates,
        averageResponseTime: avgResponse || 1.5,
        topPerformingJob: jobStats[0]?.title || 'N/A',
        mostAppliedJob: jobStats[0]?.title || 'N/A'
      },
      jobStats,
      recentHires: recentHires.map(h => ({
        candidate: h.student?.name || 'Unknown',
        position: jobStats.find(s => s._id.toString() === h.jobPosting.toString())?.title || 'Position',
        department: h.student?.department || 'N/A',
        hireDate: h.updatedAt.toISOString().split('T')[0]
      })),
      upcomingInterviews: upcomingInterviews.map(i => ({
        candidate: i.candidate,
        position: i.role,
        date: i.date.toISOString().split('T')[0],
        time: i.time,
        type: i.type,
        status: 'Locked'
      }))
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error fetching intelligence' });
  }
});

module.exports = router;
