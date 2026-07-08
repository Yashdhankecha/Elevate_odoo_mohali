const Student        = require('../models/Student');
const User           = require('../models/User');
const JobPosting     = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const PracticeSession = require('../models/PracticeSession');
const SkillProgress  = require('../models/SkillProgress');
const Notification   = require('../models/Notification');
const { uploadToCloudinary, isCloudinaryConfigured } = require('../utils/cloudinary');
const ApiError    = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { invalidateByPattern } = require('../utils/redisClient');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const resolveStudentId = (req) =>
  req.user.constructor.modelName === 'Student' ? req.user._id : req.user._id;

// ─── 1. Dashboard ─────────────────────────────────────────────────────────────

const getDashboard = asyncHandler(async (req, res) => {
  const studentId = resolveStudentId(req);

  const [applications, practiceSessions, skillProgress, recentApplications, upcomingInterviews] = await Promise.all([
    JobApplication.find({ student: studentId }),
    PracticeSession.find({ student: studentId }),
    SkillProgress.find({ student: studentId }),
    JobApplication.find({ student: studentId }).populate('jobPosting', 'title jobTitle companyName').populate('company', 'companyName').sort({ appliedDate: -1 }).limit(5),
    JobApplication.find({ student: studentId, status: 'interview_scheduled', interviewDate: { $gte: new Date() } })
      .populate('jobPosting', 'title jobTitle companyName').sort({ interviewDate: 1 }).limit(3),
  ]);

  const recentPracticeSessions = practiceSessions.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0, 5);

  res.json(new ApiResponse(200, {
    student: req.user,
    stats: {
      applicationsSubmitted: applications.length,
      practiceSessions:      practiceSessions.length,
      skillsMastered:        skillProgress.filter(s => s.proficiency >= 80).length,
      averageTestScore:      practiceSessions.length > 0
        ? Math.round(practiceSessions.reduce((s, p) => s + (p.score || 0), 0) / practiceSessions.length) : 0,
      interviewsScheduled: upcomingInterviews.length,
      profileCompletion:   req.user.profileCompletion || 0,
    },
    recentActivities: [
      ...recentApplications.map(a => ({ id: a._id, message: `Applied for ${a.jobPosting?.title || a.jobPosting?.jobTitle || 'position'}`, time: a.appliedDate, type: 'application' })),
      ...recentPracticeSessions.map(s => ({ id: s._id, message: `Completed ${s.topic} with ${s.score}%`, time: s.completedAt, type: 'practice' })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5),
    upcomingTasks: upcomingInterviews.map(i => ({ id: i._id, task: `Interview for ${i.jobPosting?.title || 'position'}`, time: i.interviewDate, priority: 'high' })),
  }, 'Dashboard fetched'));
});

// ─── 2. Get Jobs ──────────────────────────────────────────────────────────────

const getJobs = asyncHandler(async (req, res) => {
  const { search, location, category, type, minSalary, maxSalary, eligibleOnly = 'false', page = 1, limit = 10, sortBy = 'postedAt', sortOrder = 'desc' } = req.query;

  const student = await Student.findById(req.user._id).select('collegeName cgpa branch graduationYear currentBacklogs');
  const studentCollege = (student?.collegeName || '').trim();

  // Find the TPO for this student's college so we can filter on-campus jobs by approval
  let approvedByTpoId = null;
  if (studentCollege) {
    const tpo = await require('../models/TPO').findOne({ instituteName: { $regex: new RegExp(`^${studentCollege.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }).select('_id');
    if (tpo) approvedByTpoId = tpo._id;
  }

  // Build the on-campus visibility condition:
  // - off-campus jobs: always visible
  // - on-campus jobs: only if the student's TPO has approved it
  const onCampusCondition = approvedByTpoId
    ? { driveType: 'on_campus', collegeApprovals: { $elemMatch: { tpo: approvedByTpoId, status: 'approved' } } }
    : null; // no TPO found → student sees no on-campus jobs

  const offCampusCondition = { driveType: { $ne: 'on_campus' } };

  const visibilityConditions = onCampusCondition
    ? [offCampusCondition, onCampusCondition]
    : [offCampusCondition];

  const query = { $and: [{ $or: [{ status: 'active' }, { isActive: true }] }, { $or: visibilityConditions }] };

  if (eligibleOnly === 'true' && student) {
    if (student.cgpa) query.$and.push({ $or: [{ 'eligibilityCriteria.minCgpaPercentage.value': { $exists: false } }, { 'eligibilityCriteria.minCgpaPercentage.value': { $lte: student.cgpa } }] });
    if (student.branch) query.$and.push({ $or: [{ eligibleBranches: { $exists: false } }, { eligibleBranches: { $size: 0 } }, { eligibleBranches: { $elemMatch: { $regex: new RegExp(`^${student.branch.trim()}$`, 'i') } } }] });
  }

  if (search)   query.$and.push({ $or: [{ title: { $regex: search, $options: 'i' } }, { jobTitle: { $regex: search, $options: 'i' } }] });
  if (location) query.location = { $regex: location, $options: 'i' };
  if (category) query.category = category;
  if (type)     query.type = type;
  if (minSalary) query.ctc = { $gte: parseInt(minSalary) * 100000 };
  if (maxSalary) query.ctc = { ...(query.ctc || {}), $lte: parseInt(maxSalary) * 100000 };
  if (req.query.workMode  && req.query.workMode  !== 'All') query.workMode  = req.query.workMode.toLowerCase();
  if (req.query.driveType && req.query.driveType !== 'All') query.driveType = req.query.driveType;

  const sort = {};
  sort[sortBy === 'postedAt' ? 'createdAt' : sortBy] = sortOrder === 'desc' ? -1 : 1;

  const [jobs, total] = await Promise.all([
    JobPosting.find(query).populate('company', 'companyName email profilePicture').sort(sort).skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit)),
    JobPosting.countDocuments(query),
  ]);

  const userApplications = await JobApplication.find({ student: req.user._id, jobPosting: { $in: jobs.map(j => j._id) } });
  const appliedSet = new Set(userApplications.map(a => a.jobPosting.toString()));

  const [locations, categories, types] = await Promise.all([
    JobPosting.distinct('location', { isActive: true }),
    JobPosting.distinct('category', { isActive: true }),
    JobPosting.distinct('type', { isActive: true }),
  ]);

  res.json(new ApiResponse(200, {
    jobs: jobs.map(job => {
      const c = job.company;
      return {
        id: job._id, hasApplied: appliedSet.has(job._id.toString()),
        title: job.jobTitle || job.title,
        company: job.companyName || c?.companyName || 'Company',
        companyLogo: job.companyLogo || c?.profilePicture || null,
        location: job.companyLocation || job.location,
        salary: job.ctc ? `₹${(job.ctc / 100000).toFixed(1)} LPA` : job.stipend ? `₹${Number(job.stipend).toLocaleString()}/mo` : 'Not specified',
        jobType: (job.employmentType || job.type || '').replace(/-/g, ' '),
        description: job.jobDescription || job.description,
        skills: job.requiredSkills || job.skills || [],
        postedDate: job.createdAt || job.postedAt,
        deadline: job.applicationDeadline || job.deadline,
        driveType: job.driveType, isOnCampus: job.driveType === 'on_campus',
        jobId: job.jobId, eligibilityCriteria: job.eligibilityCriteria,
        eligibleBranches: job.eligibleBranches, targetBatches: job.targetBatches,
      };
    }),
    filters: {
      locations: locations.filter(Boolean).sort(),
      categories: categories.filter(Boolean).map(v => ({ value: v, label: v.replace(/-/g, ' ') })),
      types: types.filter(Boolean).map(v => ({ value: v, label: v.replace(/-/g, ' ') })),
      driveTypes: [{ value: 'All', label: 'All Jobs' }, { value: 'on_campus', label: 'On Campus' }, { value: 'off_campus', label: 'Off Campus' }],
    },
    pagination: { current: parseInt(page), total: Math.ceil(total / parseInt(limit)), hasNext: parseInt(page) * parseInt(limit) < total, hasPrev: parseInt(page) > 1 },
  }, 'Jobs fetched'));
});

// ─── 3. Apply for Job ─────────────────────────────────────────────────────────

const applyForJob = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const job = await JobPosting.findOne({ _id: req.params.jobId, isActive: true });
  if (!job) throw new ApiError(404, 'Job not found or no longer active');

  // Eligibility check for on-campus drives
  if (job.driveType === 'on_campus') {
    const student = await Student.findById(studentId).select('collegeName cgpa branch graduationYear currentBacklogs');
    if (!student) throw new ApiError(404, 'Student profile not found');

    const issues = [];
    const ec = job.eligibilityCriteria || {};

    if (job.targetColleges?.length) {
      const match = job.targetColleges.some(tc => tc.toLowerCase().trim() === student.collegeName?.toLowerCase().trim());
      if (!match) throw new ApiError(403, 'This drive is not available for your college.');
    }
    if (ec.minCgpaPercentage?.value > 0 && (student.cgpa || 0) < ec.minCgpaPercentage.value)
      issues.push(`Your CGPA (${student.cgpa}) is below the minimum (${ec.minCgpaPercentage.value}).`);
    if (job.eligibleBranches?.length && !job.eligibleBranches.some(b => b.toLowerCase() === student.branch?.toLowerCase()))
      issues.push(`Your branch (${student.branch}) is not eligible.`);
    if (job.targetBatches?.length && !job.targetBatches.some(b => String(b) === String(student.graduationYear)))
      issues.push(`Your batch (${student.graduationYear}) is not targeted.`);
    if (!ec.backlogsAllowed && (student.currentBacklogs || 0) > 0)
      issues.push('Active backlogs are not allowed.');

    if (issues.length) return res.status(400).json({ success: false, message: 'Eligibility criteria not met.', issues });
  }

  const existing = await JobApplication.findOne({ student: studentId, jobPosting: req.params.jobId });
  if (existing) throw new ApiError(400, 'You have already applied for this position.');

  // Resume: uploaded file or profile resume
  let resumeUrl = '';
  if (req.file) {
    if (!isCloudinaryConfigured()) throw new ApiError(503, 'File upload service not configured');
    const result = await uploadToCloudinary(req.file.buffer, 'student_resumes', { resource_type: 'raw' });
    resumeUrl = result.secure_url;
  } else {
    const s = await Student.findById(studentId).select('resume');
    resumeUrl = s?.resume || '';
  }

  const application = await JobApplication.create({
    student: studentId, jobPosting: req.params.jobId, company: job.company,
    coverLetter: req.body.coverLetter, resume: resumeUrl,
    employmentType: job.employmentType || job.type || 'full-time',
    status: 'applied', appliedDate: new Date(),
  });

  await JobPosting.findByIdAndUpdate(req.params.jobId, { $inc: { applicationCount: 1 } });
  res.status(201).json(new ApiResponse(201, { applicationId: application._id, status: 'applied' }, 'Application submitted successfully'));
  // New application → invalidate company dashboards + public stats
  invalidateByPattern('company-dash:*'); invalidateByPattern('company-analytics:*'); invalidateByPattern('stats:*');
});

// ─── 4. Get Applications ──────────────────────────────────────────────────────

const getApplications = asyncHandler(async (req, res) => {
  const studentId = resolveStudentId(req);
  const { status, page = 1, limit = 10 } = req.query;

  const query = { student: studentId };
  if (status && status !== 'all') query.status = status;

  const [applications, total, allApps] = await Promise.all([
    JobApplication.find(query)
      .populate('jobPosting', 'selectionRounds totalRounds jobTitle companyName title package ctc stipend location type employmentType description requirements responsibilities skills duration deadline applicationDeadline')
      .populate('company', 'companyName email profilePicture')
      .sort({ appliedDate: -1 }).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit)),
    JobApplication.countDocuments(query),
    JobApplication.find({ student: studentId }),
  ]);

  const stats = {
    total: allApps.length,
    inProgress: allApps.filter(a => ['applied', 'test_scheduled', 'test_completed', 'interview_scheduled'].includes(a.status)).length,
    offers:     allApps.filter(a => a.status === 'offer_received').length,
    rejected:   allApps.filter(a => a.status === 'rejected').length,
  };

  res.json(new ApiResponse(200, {
    applications: applications.map(app => ({
      id: app._id,
      role: app.jobPosting?.title || app.jobPosting?.jobTitle || 'Position',
      company: app.company?.companyName || 'Company',
      salary: app.jobPosting?.ctc ? `₹${(app.jobPosting.ctc / 100000).toFixed(1)} LPA`
        : app.jobPosting?.stipend > 0 ? `₹${Number(app.jobPosting.stipend).toLocaleString()}/mo` : 'Not specified',
      status: app.status,
      appliedDate: new Date(app.appliedDate).toLocaleDateString(),
      type: app.employmentType || app.jobPosting?.employmentType || app.jobPosting?.type || 'full-time',
      coverLetter: app.coverLetter, resume: app.resume, timeline: app.timeline,
      selectionRounds: app.jobPosting?.selectionRounds || [],
    })),
    stats,
    pagination: { current: parseInt(page), total: Math.ceil(total / parseInt(limit)), hasNext: parseInt(page) * parseInt(limit) < total, hasPrev: parseInt(page) > 1 },
  }, 'Applications fetched'));
});

// ─── 5. Get Single Application ────────────────────────────────────────────────

const getApplication = asyncHandler(async (req, res) => {
  const application = await JobApplication.findOne({ _id: req.params.applicationId, student: req.user._id })
    .populate('jobPosting', 'selectionRounds totalRounds jobTitle title companyName package ctc stipend location type employmentType description requirements responsibilities skills duration deadline applicationDeadline')
    .populate('company', 'companyName email profilePicture');
  if (!application) throw new ApiError(404, 'Application not found');

  res.json(new ApiResponse(200, {
    id: application._id,
    role: application.jobPosting?.title || application.jobPosting?.jobTitle || 'Position',
    company: application.company?.companyName || 'Company',
    status: application.status, appliedDate: new Date(application.appliedDate).toLocaleDateString(),
    description: application.jobPosting?.description, requirements: application.jobPosting?.requirements,
    skills: application.jobPosting?.skills, deadline: application.jobPosting?.deadline || application.jobPosting?.applicationDeadline,
    type: application.jobPosting?.employmentType || application.jobPosting?.type,
    coverLetter: application.coverLetter, resume: application.resume,
    notes: application.notes, timeline: application.timeline || [],
    selectionRounds: application.jobPosting?.selectionRounds || [],
  }, 'Application fetched'));
});

// ─── 6. Update Application ────────────────────────────────────────────────────

const updateApplication = asyncHandler(async (req, res) => {
  const { coverLetter, notes, resume } = req.body;
  const application = await JobApplication.findOne({ _id: req.params.applicationId, student: req.user._id });
  if (!application) throw new ApiError(404, 'Application not found');

  if (coverLetter !== undefined) application.coverLetter = coverLetter;
  if (notes       !== undefined) application.notes       = notes;
  if (resume      !== undefined) application.resume      = resume;
  await application.save();
  res.json(new ApiResponse(200, application, 'Application updated'));
});

// ─── 7. Get Practice Sessions ─────────────────────────────────────────────────

const getPracticeSessions = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const studentId = req.user._id;
  const query = { student: studentId };
  if (category && category !== 'all') query.category = category;

  const [sessions, total, catStats] = await Promise.all([
    PracticeSession.find(query).sort({ completedAt: -1 }).skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit)),
    PracticeSession.countDocuments(query),
    PracticeSession.aggregate([
      { $match: { student: studentId } },
      { $group: { _id: '$category', count: { $sum: 1 }, averageScore: { $avg: '$score' }, totalTime: { $sum: '$timeSpent' } } },
    ]),
  ]);

  res.json(new ApiResponse(200, {
    sessions: sessions.map(s => ({ id: s._id, topic: s.topic, category: s.category, difficulty: s.difficulty, score: s.score, timeSpent: s.timeSpent, completedAt: s.completedAt, totalQuestions: s.totalQuestions, correctAnswers: s.correctAnswers })),
    categoryStats: catStats.map(c => ({ category: c._id, count: c.count, averageScore: Math.round(c.averageScore || 0), totalTime: c.totalTime })),
    pagination: { current: parseInt(page), total: Math.ceil(total / parseInt(limit)), hasNext: parseInt(page) * parseInt(limit) < total, hasPrev: parseInt(page) > 1 },
  }, 'Practice sessions fetched'));
});

// ─── 8. Get Skills ────────────────────────────────────────────────────────────

const getSkills = asyncHandler(async (req, res) => {
  const skills = await SkillProgress.find({ student: req.user._id });
  const tech = skills.filter(s => s.category === 'technical');
  const soft = skills.filter(s => s.category === 'soft-skills');
  const avg  = arr => arr.length > 0 ? Math.round(arr.reduce((s, x) => s + x.proficiency, 0) / arr.length) : 0;

  res.json(new ApiResponse(200, {
    technicalSkills: tech.map(s => ({ skill: s.skill, proficiency: s.proficiency, targetProficiency: s.targetProficiency, lastUpdated: s.lastUpdated })),
    softSkills:      soft.map(s => ({ skill: s.skill, proficiency: s.proficiency, targetProficiency: s.targetProficiency, lastUpdated: s.lastUpdated })),
    stats: { technical: { total: tech.length, mastered: tech.filter(s => s.proficiency >= 80).length, average: avg(tech) }, softSkills: { total: soft.length, mastered: soft.filter(s => s.proficiency >= 80).length, average: avg(soft) } },
  }, 'Skills fetched'));
});

// ─── 9. Create Practice Session ───────────────────────────────────────────────

const createPracticeSession = asyncHandler(async (req, res) => {
  const { topic, category, difficulty, score, totalQuestions, correctAnswers, timeSpent, questions, feedback } = req.body;
  const studentId = req.user._id;

  const session = await PracticeSession.create({ student: studentId, topic, category, difficulty, score, totalQuestions, correctAnswers, timeSpent, questions: questions || [], feedback: feedback || {} });

  // Update skill progress
  const skillMap = { 'data-structures': 'Data Structures & Algorithms', 'algorithms': 'Data Structures & Algorithms', 'system-design': 'System Design', 'database': 'Database Management', 'web-development': 'Web Development', 'machine-learning': 'Machine Learning', 'soft-skills': 'Communication' };
  const skillName = skillMap[category];
  if (skillName) {
    let sp = await SkillProgress.findOne({ student: studentId, skill: skillName });
    if (!sp) {
      sp = new SkillProgress({ student: studentId, skill: skillName, category: category === 'soft-skills' ? 'soft-skills' : 'technical', proficiency: score });
    } else {
      sp.proficiency = Math.min(100, Math.round((sp.proficiency + score) / 2));
    }
    sp.lastUpdated = new Date();
    await sp.save();
  }

  res.status(201).json(new ApiResponse(201, session, 'Practice session saved'));
});

// ─── 10. Notifications ────────────────────────────────────────────────────────

const getNotifications = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const [recentApps, upcomingInterviews, recentPractice] = await Promise.all([
    JobApplication.find({ student: studentId }).populate('jobPosting', 'title').populate('company', 'companyName').sort({ appliedDate: -1 }).limit(5),
    JobApplication.find({ student: studentId, status: 'interview_scheduled', interviewDate: { $gte: new Date() } }).populate('jobPosting', 'title').sort({ interviewDate: 1 }).limit(3),
    PracticeSession.find({ student: studentId }).sort({ completedAt: -1 }).limit(3),
  ]);

  const notifications = [];
  recentApps.forEach(a => {
    if (['test_scheduled', 'interview_scheduled', 'offer_received'].includes(a.status)) {
      const msgs = { test_scheduled: `Test scheduled for ${a.jobPosting?.title || 'position'}`, interview_scheduled: `Interview scheduled for ${a.jobPosting?.title || 'position'}`, offer_received: `🎉 Offer received for ${a.jobPosting?.title || 'position'}` };
      notifications.push({ id: `app_${a._id}`, message: msgs[a.status], time: a.updatedAt, type: a.status === 'offer_received' ? 'offer' : 'application', unread: true });
    }
  });
  recentPractice.filter(s => s.score >= 90).forEach(s => {
    notifications.push({ id: `practice_${s._id}`, message: `Excellent! Scored ${s.score}% in ${s.topic}`, time: s.completedAt, type: 'achievement', unread: true });
  });

  notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
  const start = (parseInt(page) - 1) * parseInt(limit);
  const paginated = notifications.slice(start, start + parseInt(limit));

  res.json(new ApiResponse(200, { notifications: paginated, unreadCount: notifications.filter(n => n.unread).length, pagination: { current: parseInt(page), total: Math.ceil(notifications.length / parseInt(limit)) } }, 'Notifications fetched'));
});

const markNotificationsRead = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, null, 'Notifications marked as read'));
});

// ─── 11. AI Coach ─────────────────────────────────────────────────────────────

const getAiCoach = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const [recentApps, recentPractice, skillProgress] = await Promise.all([
    JobApplication.find({ student: studentId }).populate('jobPosting', 'title category').sort({ appliedDate: -1 }).limit(5),
    PracticeSession.find({ student: studentId }).sort({ completedAt: -1 }).limit(5),
    SkillProgress.find({ student: studentId }),
  ]);

  const insights = [];
  if (recentPractice.length > 0) {
    const avg = recentPractice.reduce((s, p) => s + (p.score || 0), 0) / recentPractice.length;
    if (avg < 70) insights.push({ title: 'Interview Performance', description: 'Focus on system design questions based on your recent scores', icon: 'FaLightbulb', color: 'text-yellow-500' });
  }
  if ((req.user.profileCompletion || 0) < 80) insights.push({ title: 'Resume Optimization', description: 'Add more quantifiable achievements to your profile', icon: 'FaStar', color: 'text-blue-500' });
  if (recentApps.length > 0 && recentApps[0].jobPosting?.category) insights.push({ title: 'Career Path', description: `Consider exploring ${recentApps[0].jobPosting.category} roles`, icon: 'FaUserGraduate', color: 'text-green-500' });

  res.json(new ApiResponse(200, {
    aiInsights: insights,
    recentConversations: [{ id: 1, topic: 'System Design Interview Tips', date: '2 hours ago', status: 'completed' }],
    performanceMetrics: { coachingSessions: recentPractice.length, interviewSuccess: recentApps.filter(a => a.status === 'offer_received').length > 0 ? 92 : 75, skillsImproved: skillProgress.filter(s => s.proficiency >= 80).length, coachRating: 4.8 },
  }, 'AI Coach fetched'));
});

const createAiCoachSession = asyncHandler(async (req, res) => {
  const { topic, type } = req.body;
  res.json(new ApiResponse(200, { sessionId: Date.now(), topic, type, status: 'active' }, 'AI coaching session created'));
});

// ─── 12. Internships ──────────────────────────────────────────────────────────

const getInternshipOffers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, search, category, location } = req.query;
  const collegeName = req.user.collegeName;
  if (!collegeName) throw new ApiError(400, 'Student profile not found or college not configured');

  const filter = {
    $or: [{ employmentType: 'internship' }, { type: 'internship' }],
    isActive: true,
    $and: [
      { $or: [{ applicationDeadline: { $gte: new Date() } }, { deadline: { $gte: new Date() } }] },
      { $or: [{ targetColleges: { $in: [collegeName] } }, { targetColleges: { $exists: false } }, { targetColleges: { $size: 0 } }] },
    ],
  };
  if (search) filter.$and.push({ $or: [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }] });
  if (category && category !== 'All') filter.$or = [{ category }, { jobCategory: category }, { department: category }];
  if (req.query.workMode && req.query.workMode !== 'All') filter.workMode = req.query.workMode.toLowerCase();

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [internships, total] = await Promise.all([
    JobPosting.find(filter).populate('company', 'companyName email profilePicture').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    JobPosting.countDocuments(filter),
  ]);

  const userApps = await JobApplication.find({ student: req.user._id, jobPosting: { $in: internships.map(j => j._id) } });
  const appliedSet = new Set(userApps.map(a => a.jobPosting.toString()));
  const now = new Date();

  res.json(new ApiResponse(200, {
    internships: internships.map(i => {
      const obj = i.toObject();
      obj.hasApplied = appliedSet.has(i._id.toString());
      obj.companyLogo = i.companyLogo || i.company?.profilePicture || null;
      const deadline = new Date(i.deadline);
      obj.status = deadline < now ? 'expired' : (deadline - now < 7 * 86400000 ? 'urgent' : 'active');
      return obj;
    }),
    pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), total, hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)), hasPrev: parseInt(page) > 1 },
  }, 'Internship offers fetched'));
});

const applyForInternship = asyncHandler(async (req, res) => {
  const { internshipId } = req.params;
  const studentId = req.user._id;

  const internship = await JobPosting.findById(internshipId);
  if (!internship)           throw new ApiError(404, 'Internship not found');
  if (!internship.isActive)  throw new ApiError(400, 'This internship is no longer active');
  if (new Date(internship.deadline) < new Date()) throw new ApiError(400, 'Application deadline has passed');

  const existing = await JobApplication.findOne({ student: studentId, jobPosting: internshipId });
  if (existing) throw new ApiError(400, 'You have already applied for this internship');

  const application = await JobApplication.create({ student: studentId, jobPosting: internshipId, company: internship.company, status: 'applied', appliedDate: new Date() });
  await JobPosting.findByIdAndUpdate(internshipId, { $inc: { applicationCount: 1 } });
  res.status(201).json(new ApiResponse(201, application, 'Application submitted successfully'));
  invalidateByPattern('company-dash:*'); invalidateByPattern('company-analytics:*'); invalidateByPattern('stats:*');
});

const getInternshipApplications = asyncHandler(async (req, res) => {
  const applications = await JobApplication.find({ student: req.user._id })
    .populate({ path: 'jobPosting', match: { $or: [{ employmentType: 'internship' }, { type: 'internship' }] }, select: 'title companyLogo location deadline' })
    .populate('company', 'companyName profilePicture').sort({ appliedDate: -1 });

  const filtered = applications.filter(a => a.jobPosting);
  res.json(new ApiResponse(200, { applications: filtered.map(a => ({ id: a._id, internshipTitle: a.jobPosting?.title, company: a.company?.companyName, location: a.jobPosting?.location, status: a.status, appliedDate: a.appliedDate, deadline: a.jobPosting?.deadline })) }, 'Internship applications fetched'));
});

// ─── 13. Profile ──────────────────────────────────────────────────────────────

const getProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id).select('-password -emailVerificationOTP -passwordResetToken');
  if (!student) throw new ApiError(404, 'Student profile not found');

  res.json(new ApiResponse(200, {
    name: student.name || '', email: student.email || '', phone: student.phoneNumber || '',
    address: student.address?.city ? `${student.address.city}${student.address.state ? ', ' + student.address.state : ''}` : '',
    summary: student.summary || '', profilePicture: student.profilePicture || '',
    branch: student.branch || '', cgpa: student.cgpa || '', graduationYear: student.graduationYear || '',
    rollNumber: student.rollNumber || '', collegeName: student.collegeName || '', currentBacklogs: student.currentBacklogs || 0,
    linkedin: student.linkedinUrl || '', github: student.githubUrl || '', portfolio: student.portfolioUrl || '',
    skills: (student.skills || []).map(s => s.name).filter(Boolean),
    education: student.resumeEducation?.length ? student.resumeEducation : [{ degree: student.degree || 'B.Tech', institution: student.collegeName || '', year: String(student.graduationYear || ''), gpa: String(student.cgpa || ''), achievements: '' }],
    experience: student.resumeExperience?.length ? student.resumeExperience : (student.internships || []).map(i => ({ title: i.role || '', company: i.company || '', duration: '', description: i.description || '' })),
    projects: (student.projects || []).map(p => ({ name: p.title || '', description: p.description || '', technologies: (p.technologies || []).join(', '), link: p.githubUrl || p.liveUrl || '' })),
    certifications: (student.certifications || []).map(c => ({ name: c.name || '', issuer: c.issuer || '', year: c.issueDate ? new Date(c.issueDate).getFullYear().toString() : '' })),
    isPlaced: student.isPlaced || false, placementDetails: student.placementDetails || null,
    profileCompletion: student.profileCompletion || 0, verificationStatus: student.verificationStatus || 'pending',
  }, 'Profile fetched'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const d = req.body;
  const $set = {};

  if (d.name != null)      $set.name = d.name;
  if (d.phoneNumber != null || d.phone != null) $set.phoneNumber = d.phoneNumber ?? d.phone;
  if (d.summary != null)   $set.summary = d.summary;
  if (d.degree != null)    $set.degree = d.degree;

  const rawAddr = d.personalInfo?.address ?? d.address;
  if (rawAddr != null) {
    if (typeof rawAddr === 'string') { $set['address.city'] = rawAddr; }
    else {
      if (rawAddr.city != null)    $set['address.city']    = rawAddr.city;
      if (rawAddr.state != null)   $set['address.state']   = rawAddr.state;
      if (rawAddr.country != null) $set['address.country'] = rawAddr.country;
    }
  }

  const validBranches = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE', 'AI&DS', 'Other'];
  if (d.branch != null) $set.branch = validBranches.includes(d.branch) ? d.branch : 'Other';
  if (d.cgpa != null && !isNaN(parseFloat(d.cgpa))) $set.cgpa = parseFloat(d.cgpa);
  if (d.graduationYear != null && !isNaN(parseInt(d.graduationYear))) $set.graduationYear = parseInt(d.graduationYear);

  if (d.links?.linkedin != null) $set.linkedinUrl  = d.links.linkedin;
  if (d.links?.github != null)   $set.githubUrl    = d.links.github;
  if (d.links?.portfolio != null) $set.portfolioUrl = d.links.portfolio;
  if (d.linkedinUrl != null)  $set.linkedinUrl  = d.linkedinUrl;
  if (d.githubUrl != null)    $set.githubUrl    = d.githubUrl;
  if (d.portfolioUrl != null) $set.portfolioUrl = d.portfolioUrl;

  if (d.skills != null) {
    let raw = [];
    if (d.skills?.technicalSkills) raw = [...(d.skills.technicalSkills || []), ...(d.skills.softSkills || [])];
    else if (Array.isArray(d.skills)) raw = d.skills.map(s => typeof s === 'string' ? s : s?.name).filter(Boolean);
    else if (typeof d.skills === 'string') raw = d.skills.split(',').map(s => s.trim()).filter(Boolean);
    $set.skills = raw.map(name => ({ name, proficiency: 'Intermediate' }));
  }

  if (Array.isArray(d.education))      $set.resumeEducation  = d.education;
  if (Array.isArray(d.experience))     $set.resumeExperience = d.experience;
  if (Array.isArray(d.projects))       $set.projects = d.projects.filter(p => p.name).map(p => ({ title: p.name, description: p.description || '', technologies: (p.technologies || '').split(',').map(t => t.trim()).filter(Boolean), githubUrl: p.link || '' }));
  if (Array.isArray(d.certifications)) $set.certifications = d.certifications.filter(c => c.name).map(c => ({ name: c.name, issuer: c.issuer || '', issueDate: c.year ? new Date(`${c.year}-01-01`) : undefined }));

  const updated = await Student.findByIdAndUpdate(studentId, { $set }, { new: true, runValidators: false });
  if (!updated) throw new ApiError(404, 'Student not found');

  try { updated.calculateProfileCompletion(); await Student.findByIdAndUpdate(studentId, { $set: { profileCompletion: updated.profileCompletion } }, { runValidators: false }); } catch (_) {}

  res.json(new ApiResponse(200, null, 'Profile updated successfully'));
});

const getApprovalStatus = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id).select('verificationStatus verificationNotes verifiedAt name email branch cgpa');
  if (!student) throw new ApiError(404, 'Student not found');
  res.json(new ApiResponse(200, { status: student.verificationStatus || 'pending', notes: student.verificationNotes || '', verifiedAt: student.verifiedAt || null, student: { name: student.name, email: student.email, branch: student.branch, cgpa: student.cgpa } }, 'Approval status fetched'));
});

// ─── 14. Upload Picture ───────────────────────────────────────────────────────

const uploadPicture = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured()) throw new ApiError(503, 'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env');
  if (!req.file) throw new ApiError(400, 'No file uploaded');

  const result = await uploadToCloudinary(req.file.buffer, 'student_profiles', {
    public_id: `student_${req.user._id}`, overwrite: true, resource_type: 'image',
    transformation: [{ width: 400, height: 400, crop: 'limit', quality: 'auto' }],
  });

  const student = await Student.findById(req.user._id);
  if (student) { student.profilePicture = result.secure_url; await student.save(); }

  res.json(new ApiResponse(200, { url: result.secure_url }, 'Profile picture uploaded successfully'));
});

module.exports = {
  getDashboard, getJobs, applyForJob,
  getApplications, getApplication, updateApplication,
  getPracticeSessions, getSkills, createPracticeSession,
  getNotifications, markNotificationsRead,
  getAiCoach, createAiCoachSession,
  getInternshipOffers, applyForInternship, getInternshipApplications,
  getProfile, updateProfile, getApprovalStatus, uploadPicture,
};


