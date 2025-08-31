const express = require('express');
const router = express.Router();
const { authenticateToken: auth } = require('../middleware/auth');
const Job = require('../models/Job');
const Interview = require('../models/Interview');
const Application = require('../models/Application');
const User = require('../models/User');

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
    const jobs = await Job.find({ company: req.user.id })
      .populate('applications')
      .sort({ createdAt: -1 });
    
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new job
router.post('/jobs', auth, ensureCompany, async (req, res) => {
  try {
    const {
      title,
      department,
      description,
      requirements,
      location,
      salary,
      type,
      deadline
    } = req.body;

    const job = new Job({
      title,
      company: req.user.id,
      department,
      description,
      requirements: requirements || [],
      location,
      salary,
      type,
      deadline: new Date(deadline),
      status: 'Draft'
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a job
router.put('/jobs/:id', auth, ensureCompany, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, company: req.user.id });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const {
      title,
      department,
      description,
      requirements,
      location,
      salary,
      type,
      deadline,
      status
    } = req.body;

    job.title = title || job.title;
    job.department = department || job.department;
    job.description = description || job.description;
    job.requirements = requirements || job.requirements;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.type = type || job.type;
    job.deadline = deadline ? new Date(deadline) : job.deadline;
    job.status = status || job.status;

    await job.save();
    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a job
router.delete('/jobs/:id', auth, ensureCompany, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, company: req.user.id });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for a specific job
router.get('/jobs/:id/applications', auth, ensureCompany, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, company: req.user.id });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const applications = await Application.find({ job: req.params.id })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

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
router.get('/dashboard/stats', auth, ensureCompany, async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.id });
    const interviews = await Interview.find({ company: req.user.id });
    const applications = await Application.find({ company: req.user.id });

    const stats = {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => job.status === 'Active').length,
      draftJobs: jobs.filter(job => job.status === 'Draft').length,
      totalInterviews: interviews.length,
      scheduledInterviews: interviews.filter(interview => interview.status === 'Scheduled').length,
      completedInterviews: interviews.filter(interview => interview.status === 'Completed').length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'pending').length,
      shortlistedApplications: applications.filter(app => app.status === 'shortlisted').length
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== APPLICATIONS ====================

// Get all applications for the company
router.get('/applications', auth, ensureCompany, async (req, res) => {
  try {
    const { status, job } = req.query;
    let query = { company: req.user.id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (job) {
      query.job = job;
    }

    const applications = await Application.find(query)
      .populate('applicant', 'name email')
      .populate('job', 'title department')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific application details
router.get('/applications/:id', auth, ensureCompany, async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, company: req.user.id })
      .populate('applicant', 'name email phone')
      .populate('job', 'title department description requirements');

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
router.patch('/applications/:id/status', auth, ensureCompany, async (req, res) => {
  try {
    const { status } = req.body;
    
    const application = await Application.findOne({ _id: req.params.id, company: req.user.id });
    
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
router.get('/profile', auth, ensureCompany, async (req, res) => {
  try {
    const company = await User.findById(req.user.id).select('-password');
    res.json(company);
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update company profile
router.put('/profile', auth, ensureCompany, async (req, res) => {
  try {
    const {
      companyName,
      contactNumber,
      industry,
      companySize,
      website,
      address,
      description
    } = req.body;

    const company = await User.findById(req.user.id);
    
    if (companyName) company.company.companyName = companyName;
    if (contactNumber) company.company.contactNumber = contactNumber;
    if (industry) company.company.industry = industry;
    if (companySize) company.company.companySize = companySize;
    if (website) company.company.website = website;
    if (description) company.company.description = description;

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
