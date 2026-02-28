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

// Delete a job
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
      .populate('student', 'name email phoneNumber') // Student model fields
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

// Update application status
// Update application status
router.patch('/applications/:id/status', auth, ensureCompany, async (req, res) => {
  try {
    const { status } = req.body;

    const application = await JobApplication.findOne({ _id: req.params.id, company: req.user._id });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== COMPANY PROFILE ====================

// Get company profile
// Get company profile
router.get('/profile', auth, ensureCompany, async (req, res) => {
  try {
    // req.user is already the Company document
    const company = req.user;

    // Safety check
    if (!company) {
      const dbCompany = await Company.findById(req.user._id).select('-password');
      return res.json(dbCompany);
    }

    const companyObj = company.toObject ? company.toObject() : company;
    if (companyObj.password) delete companyObj.password;

    res.json(companyObj);
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update company profile
router.put('/profile', auth, ensureCompany, async (req, res) => {
  try {
    const updateData = req.body;
    let company = await Company.findById(req.user._id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const protectedFields = ['_id', 'email', 'password', 'role', 'status', 'isVerified'];
    Object.keys(updateData).forEach(key => {
      if (!protectedFields.includes(key)) {
        company[key] = updateData[key];
      }
    });

    await company.save();

    const companyResponse = company.toObject();
    delete companyResponse.password;

    res.json(companyResponse);
  } catch (error) {
    console.error('Error updating company profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
