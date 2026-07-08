const JobPosting     = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const Interview      = require('../models/Interview');
const Company        = require('../models/Company');
const TPO            = require('../models/TPO');
const Notification   = require('../models/Notification');
const { sendStatusUpdateEmail } = require('../utils/emailService');
const { uploadToCloudinary, isCloudinaryConfigured, getPublicIdFromUrl, deleteFromCloudinary } = require('../utils/cloudinary');
const ApiError    = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { invalidateByPattern } = require('../utils/redisClient');

// ── Private helpers ──────────────────────────────────────────────────────────

const PROTECTED_PROFILE_FIELDS = [
  '_id', 'email', 'password', 'role', 'status', 'isVerified',
  'emailVerificationOTP', 'passwordResetToken', '__v',
];

const getTimelineEvent = (status) => {
  const configs = {
    applied:              { action: 'Application Received',  description: 'Your application has been received.' },
    test_scheduled:       { action: 'Assessment Phase',      description: 'A technical assessment has been scheduled.' },
    test_completed:       { action: 'Evaluation in Progress',description: 'Your test results are under review.' },
    interview_scheduled:  { action: 'Interview Phase',       description: 'An interview has been scheduled.' },
    interview_completed:  { action: 'Final Deliberation',    description: 'Interview completed. Awaiting decision.' },
    offer_received:       { action: 'Offer Generated',       description: 'Congratulations! An offer has been issued.' },
    rejected:             { action: 'Process Concluded',     description: 'The application process has ended.' },
    withdrawn:            { action: 'Application Withdrawn', description: 'This application was voluntarily withdrawn.' },
  };
  return configs[status] || { action: 'Status Updated', description: `Status changed to ${status}.` };
};

const notifySelectedTPOs = async (job, companyName, title) => {
  const selectedTPOIds = Array.isArray(job.targetTPOs) && job.targetTPOs.length > 0
    ? job.targetTPOs : null;
  const tpoQuery = selectedTPOIds
    ? { _id: { $in: selectedTPOIds }, status: 'active' }
    : { status: 'active' };
  const tpos = await TPO.find(tpoQuery).limit(50);

  job.collegeApprovals = tpos.map(t => ({ tpo: t._id, instituteName: t.instituteName, status: 'pending' }));

  await Promise.all(tpos.map(tpo =>
    Notification.createNotification({
      recipient: tpo._id,
      title: 'New On-Campus Drive Request',
      message: `${companyName} has requested an on-campus drive for "${title}". Please review.`,
      type: 'job',
      priority: 'high',
      relatedData: { jobPostingId: job._id, jobId: job.jobId },
    })
  ));
  return tpos;
};

// ── TPO List ─────────────────────────────────────────────────────────────────

/** GET /api/company/tpo-list */
const getTpoList = asyncHandler(async (req, res) => {
  const tpos = await TPO.find({ status: 'active' })
    .select('_id name instituteName email contactNumber')
    .sort({ instituteName: 1 });

  res.json(new ApiResponse(200, tpos.map(t => ({
    _id: t._id,
    name: t.name,
    instituteName: t.instituteName,
    email: t.email,
    contactNumber: t.contactNumber,
  })), 'TPO list fetched'));
});

// ── Jobs ─────────────────────────────────────────────────────────────────────

/** GET /api/company/jobs */
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await JobPosting.find({ company: req.user._id }).sort({ createdAt: -1 });

  const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
    const applicationCount = await JobApplication.countDocuments({ jobPosting: job._id });
    return { ...job.toObject(), applicationCount };
  }));

  res.json(new ApiResponse(200, jobsWithCounts, 'Jobs fetched'));
});

/** GET /api/company/jobs/:id */
const getJob = asyncHandler(async (req, res) => {
  const job = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });
  if (!job) throw new ApiError(404, 'Job not found');

  const applicationCount = await JobApplication.countDocuments({ jobPosting: job._id });
  res.json(new ApiResponse(200, { ...job.toObject(), applicationCount }, 'Job fetched'));
});

/** POST /api/company/jobs */
const createJob = asyncHandler(async (req, res) => {
  const body = req.body;

  // Comprehensive form (has jobTitle field)
  if (body.jobTitle) {
    const job = new JobPosting({
      ...body,
      company: req.user._id,
      createdBy: req.user._id,
      status: body.status || 'draft',
      isActive: false,
    });

    if (job.status === 'draft') {
      await job.save({ validateBeforeSave: false });
    } else {
      await job.save();
    }

    if (body.status === 'pending_approval' && body.driveType === 'on_campus') {
      await notifySelectedTPOs(job, body.companyName, body.jobTitle);
      await job.save({ validateBeforeSave: false });
    }

    if (body.status === 'active' && body.driveType === 'off_campus') {
      job.isActive = true;
      job.postedAt = new Date();
      await job.save();
    }

    return res.status(201).json(new ApiResponse(201, job, 'Job created'));
  }

  // Legacy simple form
  const { title, department, description, requirements, location, salary, type, deadline, skills, experience } = body;

  let packageMin = 0, packageMax = 0;
  if (salary && typeof salary === 'string') {
    const matches = salary.match(/(\d+)/g);
    if (matches) {
      packageMin = parseInt(matches[0]) * 100000;
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
    experience: experience || { min: 0, max: 2 },
  });

  await job.save();
  res.status(201).json(new ApiResponse(201, job, 'Job created'));
  // Invalidate caches when a new job is created
  invalidateByPattern('company-dash:*'); invalidateByPattern('company-analytics:*'); invalidateByPattern('stats:*');
});

/** PATCH /api/company/jobs/:id/draft */
const saveJobDraft = asyncHandler(async (req, res) => {
  const job = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });
  if (!job) throw new ApiError(404, 'Job not found');
  if (!['draft', 'changes_requested'].includes(job.status))
    throw new ApiError(400, 'Can only save drafts for draft or changes-requested jobs');

  Object.keys(req.body).forEach(key => {
    if (!['_id', 'company', 'jobId'].includes(key)) job[key] = req.body[key];
  });
  job.status = 'draft';
  await job.save({ validateBeforeSave: false });
  res.json(new ApiResponse(200, job, 'Draft saved'));
});

/** POST /api/company/jobs/:id/submit */
const submitJob = asyncHandler(async (req, res) => {
  const job = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });
  if (!job) throw new ApiError(404, 'Job not found');
  if (!['draft', 'changes_requested'].includes(job.status))
    throw new ApiError(400, 'Job cannot be submitted in its current state');

  if (job.driveType === 'on_campus') {
    job.status = 'pending_approval';
    await notifySelectedTPOs(job, job.companyName || 'A company', job.jobTitle || job.title);
    await job.save();
    return res.json(new ApiResponse(200, job, 'Drive request sent to selected colleges for approval'));
  }

  // Off-campus: auto-publish
  job.status = 'active';
  job.isActive = true;
  job.postedAt = new Date();
  await job.save();
  res.json(new ApiResponse(200, job, 'Job published successfully'));
  invalidateByPattern('company-dash:*'); invalidateByPattern('company-analytics:*'); invalidateByPattern('stats:*');
});

/** PUT /api/company/jobs/:id */
const updateJob = asyncHandler(async (req, res) => {
  const job = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });
  if (!job) throw new ApiError(404, 'Job not found');

  const body = req.body;
  const PROTECTED = ['_id', 'company', 'jobId', 'createdBy', 'createdAt'];

  if (body.jobTitle) {
    Object.keys(body).forEach(key => { if (!PROTECTED.includes(key)) job[key] = body[key]; });
    await job.save();
    return res.json(new ApiResponse(200, job, 'Job updated'));
  }

  // Legacy update
  const { title, department, description, requirements, location, salary, type, deadline, status, skills } = body;
  if (title) job.title = title;
  if (department) job.category = department;
  if (description) job.description = description;
  if (requirements) job.requirements = Array.isArray(requirements) ? requirements : [requirements];
  if (location) job.location = location;
  if (salary) {
    let min = 0, max = 0;
    if (typeof salary === 'string') {
      const m = salary.match(/(\d+)/g);
      if (m) { min = parseInt(m[0]) * 100000; max = m[1] ? parseInt(m[1]) * 100000 : min; }
    } else { min = salary.min; max = salary.max; }
    job.package = { min, max, currency: 'INR' };
  }
  if (type) job.type = type;
  if (deadline) job.deadline = new Date(deadline);
  if (status) job.isActive = status === 'Active';
  if (skills) job.skills = Array.isArray(skills) ? skills : [];
  await job.save();
  res.json(new ApiResponse(200, job, 'Job updated'));
  invalidateByPattern('company-dash:*'); invalidateByPattern('company-analytics:*');
});

/** PATCH /api/company/jobs/:id/toggle-active */
const toggleJobActive = asyncHandler(async (req, res) => {
  const job = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });
  if (!job) throw new ApiError(404, 'Job not found');

  const newIsActive = !job.isActive;
  const newStatus   = newIsActive ? (job.status === 'closed' ? 'active' : job.status) : 'closed';

  const updated = await JobPosting.findByIdAndUpdate(
    job._id,
    { $set: { isActive: newIsActive, status: newStatus } },
    { new: true, runValidators: false }
  );
  res.json(new ApiResponse(200, {
    isActive: updated.isActive,
    status: updated.status,
  }, `Job is now ${updated.isActive ? 'open' : 'closed'}`));
  invalidateByPattern('company-dash:*'); invalidateByPattern('company-analytics:*'); invalidateByPattern('stats:*');
});

/** DELETE /api/company/jobs/:id */
const deleteJob = asyncHandler(async (req, res) => {
  const job = await JobPosting.findOneAndDelete({ _id: req.params.id, company: req.user._id });
  if (!job) throw new ApiError(404, 'Job not found');

  await JobApplication.deleteMany({ jobPosting: req.params.id });
  res.json(new ApiResponse(200, null, 'Job deleted successfully'));
  invalidateByPattern('company-dash:*'); invalidateByPattern('company-analytics:*'); invalidateByPattern('stats:*');
});

/** GET /api/company/jobs/:id/applications */
const getJobApplications = asyncHandler(async (req, res) => {
  const job = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });
  if (!job) throw new ApiError(404, 'Job not found');

  const applications = await JobApplication.find({ jobPosting: req.params.id })
    .populate('student', 'name email phoneNumber collegeName branch cgpa graduationYear resume profilePicture')
    .populate('jobPosting', 'title')
    .sort({ appliedDate: -1 });

  res.json(new ApiResponse(200, applications, 'Applications fetched'));
});

// ── Interviews ────────────────────────────────────────────────────────────────

/** GET /api/company/interviews */
const getInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ company: req.user._id }).sort({ date: 1 });
  res.json(new ApiResponse(200, interviews, 'Interviews fetched'));
});

/** POST /api/company/interviews */
const createInterview = asyncHandler(async (req, res) => {
  const { candidate, role, date, time, type, interviewer, location, duration, notes } = req.body;
  const interview = await Interview.create({
    company: req.user._id,
    candidate, role, date: new Date(date), time, type, interviewer, location, duration, notes,
  });
  res.status(201).json(new ApiResponse(201, interview, 'Interview created'));
});

/** PUT /api/company/interviews/:id */
const updateInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, company: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found');

  const fields = ['candidate', 'role', 'time', 'type', 'interviewer', 'location', 'duration', 'notes'];
  fields.forEach(f => { if (req.body[f]) interview[f] = req.body[f]; });
  if (req.body.date) interview.date = new Date(req.body.date);
  await interview.save();
  res.json(new ApiResponse(200, interview, 'Interview updated'));
});

/** DELETE /api/company/interviews/:id */
const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOneAndDelete({ _id: req.params.id, company: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found');
  res.json(new ApiResponse(200, null, 'Interview deleted'));
});

/** PATCH /api/company/interviews/:id/status */
const updateInterviewStatus = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, company: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found');
  interview.status = req.body.status;
  await interview.save();
  res.json(new ApiResponse(200, interview, 'Interview status updated'));
});

// ── Dashboard ─────────────────────────────────────────────────────────────────

/** GET /api/company/dashboard/stats */
const getDashboardStats = asyncHandler(async (req, res) => {
  const [jobs, interviews, applications] = await Promise.all([
    JobPosting.find({ company: req.user._id }),
    Interview.find({ company: req.user._id }),
    JobApplication.find({ company: req.user._id }),
  ]);

  res.json(new ApiResponse(200, {
    totalJobs:               jobs.length,
    activeJobs:              jobs.filter(j => j.isActive).length,
    draftJobs:               jobs.filter(j => !j.isActive).length,
    totalInterviews:         interviews.length,
    scheduledInterviews:     interviews.filter(i => i.status === 'Scheduled').length,
    completedInterviews:     interviews.filter(i => i.status === 'Completed').length,
    totalApplications:       applications.length,
    pendingApplications:     applications.filter(a => a.status === 'applied').length,
    shortlistedApplications: applications.filter(a => ['shortlisted', 'interview_scheduled'].includes(a.status)).length,
  }, 'Dashboard stats fetched'));
});

/** GET /api/company/dashboard/analytics — rich analytics with per-job breakdown */
const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const companyId = req.user._id;

  const [jobs, activeJobs, totalApplications] = await Promise.all([
    JobPosting.find({ company: companyId }).select('_id jobTitle title employmentType type isActive status'),
    JobPosting.countDocuments({ company: companyId, isActive: true }),
    JobApplication.countDocuments({ company: companyId }),
  ]);

  // Per-job aggregation: applications, shortlisted, hired
  const jobStatsRaw = await JobApplication.aggregate([
    { $match: { company: companyId } },
    {
      $group: {
        _id: '$jobPosting',
        applications: { $sum: 1 },
        shortlisted: {
          $sum: { $cond: [{ $in: ['$status', ['shortlisted', 'interview_scheduled', 'interview_completed']] }, 1, 0] },
        },
        hired: { $sum: { $cond: [{ $eq: ['$status', 'offer_received'] }, 1, 0] } },
      },
    },
  ]);

  const jobStats = jobs.map(j => {
    const stats = jobStatsRaw.find(s => s._id?.toString() === j._id.toString()) || { applications: 0, shortlisted: 0, hired: 0 };
    return {
      _id: j._id,
      title: j.jobTitle || j.title,
      type: j.employmentType || j.type,
      applications: stats.applications,
      shortlisted: stats.shortlisted,
      hired: stats.hired,
      status: j.isActive ? 'Active' : 'Closed',
    };
  }).sort((a, b) => b.applications - a.applications);

  // Recent hires
  const recentHires = await JobApplication.find({ company: companyId, status: 'offer_received' })
    .populate('student', 'name department branch')
    .populate('jobPosting', 'jobTitle title')
    .sort({ updatedAt: -1 })
    .limit(5);

  // Overall conversion funnel
  const [shortlistCount, hireCount] = await Promise.all([
    JobApplication.countDocuments({ company: companyId, status: { $in: ['shortlisted', 'interview_scheduled', 'interview_completed'] } }),
    JobApplication.countDocuments({ company: companyId, status: 'offer_received' }),
  ]);

  res.json(new ApiResponse(200, {
    summary: {
      totalJobs: jobs.length,
      activeJobs,
      totalApplications,
      shortlisted: shortlistCount,
      hired: hireCount,
      conversionRate: totalApplications > 0 ? ((hireCount / totalApplications) * 100).toFixed(1) : 0,
    },
    jobStats,
    recentHires: recentHires.map(h => ({
      _id: h._id,
      studentName: h.student?.name,
      department: h.student?.department || h.student?.branch,
      jobTitle: h.jobPosting?.jobTitle || h.jobPosting?.title,
      hiredAt: h.updatedAt,
    })),
  }, 'Dashboard analytics fetched'));
});

// ── Applications ──────────────────────────────────────────────────────────────

/** GET /api/company/applications */
const getApplications = asyncHandler(async (req, res) => {
  const { status, job } = req.query;
  const query = { company: req.user._id };
  if (status && status !== 'all') query.status = status;
  if (job) query.jobPosting = job;

  const applications = await JobApplication.find(query)
    .populate('student', 'name email phoneNumber')
    .populate('jobPosting', 'title category')
    .sort({ appliedDate: -1 });

  res.json(new ApiResponse(200, applications, 'Applications fetched'));
});

/** GET /api/company/applications/:id */
const getApplication = asyncHandler(async (req, res) => {
  const application = await JobApplication.findOne({ _id: req.params.id, company: req.user._id })
    .populate('student', 'name email phoneNumber resume')
    .populate('jobPosting', 'title category description requirements');
  if (!application) throw new ApiError(404, 'Application not found');
  res.json(new ApiResponse(200, application, 'Application fetched'));
});

/** PATCH /api/company/applications/:id/status */
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, roundName } = req.body;

  const application = await JobApplication.findOne({ _id: req.params.id, company: req.user._id })
    .populate('student', 'name email')
    .populate('jobPosting', 'title companyName');
  if (!application) throw new ApiError(404, 'Application not found');

  if (application.status !== status || application.currentRoundName !== roundName) {
    application.status = status;
    if (roundName) application.currentRoundName = roundName;
    const event = getTimelineEvent(status);
    application.timeline.push({
      action: roundName || event.action,
      description: roundName ? `Advanced to ${roundName}.` : event.description,
      date: new Date(),
    });
    await application.save();
  }

  if (application.student?.email) {
    const companyData = await Company.findById(req.user._id);
    await sendStatusUpdateEmail(
      application.student.email,
      application.student.name,
      companyData?.companyName || 'Elevate Platform',
      application.jobPosting?.title || 'Job Role',
      status
    );
  }

  res.json(new ApiResponse(200, application, 'Application status updated'));
  invalidateByPattern('company-dash:*'); invalidateByPattern('company-analytics:*');
});

/** POST /api/company/jobs/:id/advance-round */
const advanceRound = asyncHandler(async (req, res) => {
  const { applicantIds, newStatus, roundName } = req.body;
  if (!Array.isArray(applicantIds) || applicantIds.length === 0)
    throw new ApiError(400, 'No applicants selected');

  const jobPosting = await JobPosting.findOne({ _id: req.params.id, company: req.user._id });
  if (!jobPosting) throw new ApiError(404, 'Job not found');

  const companyData  = await Company.findById(req.user._id);
  const companyName  = companyData?.companyName || 'Elevate Platform';
  const jobTitle     = jobPosting.title || jobPosting.jobTitle || 'Job Role';

  let successCount = 0;
  await Promise.all(applicantIds.map(async (applicantId) => {
    const application = await JobApplication.findOne({ _id: applicantId, jobPosting: jobPosting._id })
      .populate('student', 'name email');
    if (!application) return;

    if (newStatus) application.status = newStatus;
    if (roundName) application.currentRoundName = roundName;
    const event = getTimelineEvent(newStatus || application.status);
    application.timeline.push({
      action: roundName || event.action,
      description: roundName ? `Advanced to ${roundName}.` : event.description,
      date: new Date(),
    });
    await application.save();

    if (application.student?.email)
      await sendStatusUpdateEmail(application.student.email, application.student.name, companyName, jobTitle, newStatus || application.status);

    successCount++;
  }));

  res.json(new ApiResponse(200, { successCount }, `${successCount} applicants updated`));
  invalidateByPattern('company-dash:*'); invalidateByPattern('company-analytics:*');
});

// ── Profile ───────────────────────────────────────────────────────────────────

/** GET /api/company/profile */
const getProfile = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.user._id)
    .select('-password -emailVerificationOTP -passwordResetToken');
  if (!company) throw new ApiError(404, 'Company not found');
  res.json(new ApiResponse(200, company.toObject(), 'Profile fetched'));
});

/** PUT /api/company/profile */
const updateProfile = asyncHandler(async (req, res) => {
  const safeUpdate = {};
  Object.keys(req.body).forEach(key => {
    if (!PROTECTED_PROFILE_FIELDS.includes(key) && req.body[key] !== undefined)
      safeUpdate[key] = req.body[key];
  });

  const updated = await Company.findByIdAndUpdate(
    req.user._id,
    { $set: safeUpdate },
    { new: true, runValidators: false, select: '-password -emailVerificationOTP -passwordResetToken' }
  );
  if (!updated) throw new ApiError(404, 'Company not found');
  res.json(new ApiResponse(200, updated.toObject(), 'Profile updated'));
});

// ── Logo upload ───────────────────────────────────────────────────────────────

/** POST /api/company/upload-logo */
const uploadLogo = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured())
    throw new ApiError(503, 'Image upload service is not configured');
  if (!req.file)
    throw new ApiError(400, 'No file uploaded');

  const result = await uploadToCloudinary(req.file.buffer, 'elevate/company-logos', {
    transformation: [{ width: 400, height: 400, crop: 'limit' }],
  });

  // Delete old logo from Cloudinary if it exists
  const company = await Company.findById(req.user._id);
  if (company?.profilePicture) {
    const oldPublicId = getPublicIdFromUrl(company.profilePicture);
    if (oldPublicId) await deleteFromCloudinary(oldPublicId).catch(() => {});
  }

  const updated = await Company.findByIdAndUpdate(
    req.user._id,
    { $set: { profilePicture: result.secure_url } },
    { new: true, select: 'profilePicture companyName' }
  );

  res.json(new ApiResponse(200, {
    url: result.secure_url,
    profilePicture: updated.profilePicture,
  }, 'Logo uploaded successfully'));
});

module.exports = {
  getTpoList,
  getJobs, getJob, createJob, saveJobDraft, submitJob, updateJob, toggleJobActive, deleteJob, getJobApplications,
  getInterviews, createInterview, updateInterview, deleteInterview, updateInterviewStatus,
  getDashboardStats, getDashboardAnalytics,
  getApplications, getApplication, updateApplicationStatus, advanceRound,
  getProfile, updateProfile,
  uploadLogo,
};
