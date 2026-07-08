const { validationResult } = require('express-validator');
const Student        = require('../models/Student');
const Company        = require('../models/Company');
const TPO            = require('../models/TPO');
const User           = require('../models/User');
const JobPosting     = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const Interview      = require('../models/Interview');
const Notification   = require('../models/Notification');
const { buildInstituteFilter, verifyBulkInstituteAccess } = require('../middleware/tpoInstituteAccess');
const ApiError    = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { invalidateByPattern } = require('../utils/redisClient');
const { sendDriveApprovedEmailToCompany, sendDriveApprovedEmailToStudents } = require('../utils/emailService');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInstitute = (req) => req.tpoInstitute || req.user?.instituteName || 'Unknown';

// ─── 1. Dashboard Stats ───────────────────────────────────────────────────────

const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    const institute = getInstitute(req);
    console.log('[getDashboardStats] institute:', institute, '| userId:', req.user?._id);

    // Parallel: students, active companies, notifications, upcoming drives
    const [students, companies, recentActivities, upcomingDrivesRaw] = await Promise.all([
      Student.find({ collegeName: institute }).select('_id isPlaced branch placementDetails cgpa'),
      Company.find({ status: 'active' }).select('_id'),
      Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(10),
      JobPosting.find({ deadline: { $gte: new Date() }, isActive: true })
        .populate('company', 'companyName')
        .sort({ deadline: 1 })
        .limit(8),
    ]);

    const studentIds   = students.map(s => s._id);
    const applications = await JobApplication.find({ student: { $in: studentIds } }).select('student status jobPosting');

    // Core stats
    const placedStudents = students.filter(s => s.isPlaced);
    const placedWithPkg  = placedStudents.filter(s => s.placementDetails?.package?.amount);
    const avgPackage = placedWithPkg.length
      ? placedWithPkg.reduce((sum, s) => sum + s.placementDetails.package.amount, 0) / placedWithPkg.length
      : 0;
    const highestPackage = placedWithPkg.length
      ? Math.max(...placedWithPkg.map(s => s.placementDetails.package.amount))
      : 0;

    // Department breakdown
    const deptMap = {};
    students.forEach(s => {
      const d = s.branch || 'Unknown';
      if (!deptMap[d]) deptMap[d] = { total: 0, placed: 0 };
      deptMap[d].total++;
      if (s.isPlaced) deptMap[d].placed++;
    });
    const departmentStats = Object.entries(deptMap).map(([dept, v]) => ({
      department: dept,
      total:  v.total,
      placed: v.placed,
      rate:   v.total > 0 ? +(v.placed / v.total * 100).toFixed(1) : 0,
    })).sort((a, b) => b.rate - a.rate);

    // Enrich upcoming drives with application counts
    const driveAppCounts = await Promise.all(
      upcomingDrivesRaw.map(d =>
        JobApplication.countDocuments({ jobPosting: d._id, student: { $in: studentIds } })
      )
    );
    const upcomingDrives = upcomingDrivesRaw.map((d, i) => ({
      id:           d._id,
      title:        d.jobTitle || d.title,
      company:      d.company?.companyName || d.companyName || '',
      deadline:     d.deadline,
      applications: driveAppCounts[i] || 0,
    }));

    res.json(new ApiResponse(200, {
      stats: {
        totalStudents:     students.length,
        placedStudents:    placedStudents.length,
        activeCompanies:   companies.length,
        totalApplications: applications.length,
        totalOffers:       applications.filter(a => a.status === 'offer_received').length,
        averagePackage:    Math.round(avgPackage * 100) / 100,
        highestPackage:    highestPackage,
        placementRate:     students.length > 0 ? Math.round((placedStudents.length / students.length) * 1000) / 10 : 0,
        upcomingDrives:    upcomingDrives.length,
      },
      departmentStats,
      upcomingDrives,
      recentActivities: recentActivities.map(a => ({ id: a._id, message: a.message, time: a.createdAt, type: a.type })),
    }, 'Dashboard stats fetched'));
  } catch (err) {
    console.error('[getDashboardStats] ERROR:', err.message, '\nStack:', err.stack);
    throw err;
  }
});


// ─── 2. Get Students ──────────────────────────────────────────────────────────

const getStudents = asyncHandler(async (req, res) => {
  const { search, department, status, minCGPA, maxCGPA, page = 1, limit = 10 } = req.query;
  const filter = buildInstituteFilter(getInstitute(req));

  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { rollNumber: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];
  if (department && department !== 'All') filter.branch = department;
  if (status === 'Placed')     filter.isPlaced = true;
  if (status === 'Not Placed') filter.isPlaced = false;
  if (minCGPA) filter.cgpa = { $gte: parseFloat(minCGPA) };
  if (maxCGPA) filter.cgpa = { ...(filter.cgpa || {}), $lte: parseFloat(maxCGPA) };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [students, total] = await Promise.all([
    Student.find(filter).select('-password -emailVerificationOTP -passwordResetToken').sort({ cgpa: -1 }).skip(skip).limit(parseInt(limit)),
    Student.countDocuments(filter),
  ]);

  const withCounts = await Promise.all(students.map(async s => {
    const apps = await JobApplication.find({ student: s._id });
    return { ...s.toObject(), applications: apps.length, offers: apps.filter(a => a.status === 'offer_received').length };
  }));

  res.json(new ApiResponse(200, {
    students: withCounts,
    pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), total },
  }, 'Students fetched'));
});

// ─── 3. Create Student ────────────────────────────────────────────────────────

const createStudent = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const { name, email, rollNumber, branch, cgpa, phoneNumber, graduationYear, skills, isPlaced, package: pkg, companyName, jobTitle } = req.body;
  const institute = getInstitute(req);

  const [emailExists, rollExists] = await Promise.all([
    Student.findOne({ email }),
    Student.findOne({ rollNumber, collegeName: institute }),
  ]);
  if (emailExists) throw new ApiError(400, 'Email already registered');
  if (rollExists)  throw new ApiError(400, 'Roll number already exists in this institute');

  const student = await Student.create({
    name, email, phoneNumber, role: 'student', status: 'active', isVerified: true,
    rollNumber, branch, cgpa: parseFloat(cgpa), collegeName: institute,
    graduationYear: graduationYear || new Date().getFullYear(),
    skills: skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [],
    isPlaced: isPlaced || false,
    placementDetails: isPlaced ? {
      company: companyName,
      package: { amount: pkg ? parseFloat(pkg) : 0, currency: 'INR', type: 'CTC' },
      role: jobTitle, placementDate: new Date(),
    } : null,
  });

  res.status(201).json(new ApiResponse(201, student, 'Student added successfully'));
  // Invalidate TPO dashboard caches (student count changed)
  invalidateByPattern('tpo-dash:*'); invalidateByPattern('tpo-analytics:*'); invalidateByPattern('stats:*');
});

// ─── 4. Update Student ────────────────────────────────────────────────────────

const updateStudent = asyncHandler(async (req, res) => {
  const student = req.student; // set by verifyStudentInstitute middleware
  const d = req.body;
  const pick = (key) => d[key] ?? d.student?.[key];

  if (d.name) student.name = d.name;
  if (d.email) student.email = d.email;
  if (d.phoneNumber) student.phoneNumber = d.phoneNumber;
  if (pick('rollNumber'))    student.rollNumber    = pick('rollNumber');
  if (pick('branch'))        student.branch        = pick('branch');
  if (pick('cgpa'))          student.cgpa          = parseFloat(pick('cgpa'));
  if (pick('graduationYear'))student.graduationYear= pick('graduationYear');
  if (pick('skills'))        student.skills        = pick('skills');
  if (pick('isPlaced') !== undefined) student.isPlaced = pick('isPlaced');

  await student.save();
  res.json(new ApiResponse(200, student, 'Student updated'));
  invalidateByPattern('tpo-dash:*'); invalidateByPattern('tpo-analytics:*');
});

// ─── 5. Delete Student ────────────────────────────────────────────────────────

const deleteStudent = asyncHandler(async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json(new ApiResponse(200, null, 'Student deleted'));
  invalidateByPattern('tpo-dash:*'); invalidateByPattern('tpo-analytics:*'); invalidateByPattern('stats:*');
});

// ─── 6. Approve Student ───────────────────────────────────────────────────────

const approveStudent = asyncHandler(async (req, res) => {
  const student = req.student || await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, 'Student not found');

  student.verificationStatus = 'verified';
  student.verifiedAt  = new Date();
  student.verifiedBy  = req.user._id;
  await student.save();

  await Notification.create({ recipient: student._id, sender: req.user._id,
    title: 'Profile Approved', message: 'Your profile has been approved by the TPO.', type: 'achievement' });

  res.json(new ApiResponse(200, student, 'Student approved'));
  invalidateByPattern('tpo-dash:*');
});

// ─── 7. Reject Student ────────────────────────────────────────────────────────

const rejectStudent = asyncHandler(async (req, res) => {
  const { reason = 'No reason provided' } = req.body;
  const student = req.student || await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, 'Student not found');

  student.verificationStatus = 'rejected';
  student.verificationNotes  = reason;
  await student.save();

  await Notification.create({ recipient: student._id, sender: req.user._id,
    title: 'Profile Rejected', message: `Your profile was rejected. Reason: ${reason}`, type: 'admin' });

  res.json(new ApiResponse(200, student, 'Student rejected'));
  invalidateByPattern('tpo-dash:*');
});

// ─── 8. Bulk Approve ─────────────────────────────────────────────────────────

const bulkApproveStudents = asyncHandler(async (req, res) => {
  const { studentIds } = req.body;
  if (!Array.isArray(studentIds) || !studentIds.length) throw new ApiError(400, 'Student IDs array required');

  await verifyBulkInstituteAccess(studentIds, getInstitute(req));

  const result = await Student.updateMany(
    { _id: { $in: studentIds }, collegeName: getInstitute(req) },
    { $set: { verificationStatus: 'verified', verifiedAt: new Date(), verifiedBy: req.user._id } }
  );
  res.json(new ApiResponse(200, { modifiedCount: result.modifiedCount }, `${result.modifiedCount} students approved`));
  invalidateByPattern('tpo-dash:*');
});

// ─── 9. Update Placement ─────────────────────────────────────────────────────

const updatePlacement = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const student = req.student;
  if (req.body.isPlaced !== undefined) student.isPlaced = req.body.isPlaced;
  if (req.body.package || req.body.companyName || req.body.jobTitle) {
    student.placementDetails = {
      company:  req.body.companyName || student.placementDetails?.company,
      package:  { amount: req.body.package || student.placementDetails?.package?.amount || 0, currency: 'INR', type: 'CTC' },
      role:     req.body.jobTitle    || student.placementDetails?.role,
      placementDate: req.body.placementDate ? new Date(req.body.placementDate) : student.placementDetails?.placementDate || new Date(),
    };
  }
  await student.save();
  res.json(new ApiResponse(200, student, 'Placement updated'));
  // Placement data changed → invalidate everything that shows placement stats
  Promise.all([
    invalidateByPattern('tpo-dash:*'), invalidateByPattern('tpo-analytics:*'),
    invalidateByPattern('tpo-trends:*'), invalidateByPattern('stats:*'),
    invalidateByPattern('superadmin:*'),
  ]);
});

// ─── 10. Get Companies ────────────────────────────────────────────────────────

const getCompanies = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = { status: 'active' };
  if (search) filter.$or = [
    { companyName: { $regex: search, $options: 'i' } },
    { email:       { $regex: search, $options: 'i' } },
  ];
  const companies = await Company.find(filter).select('_id companyName industry email').sort({ companyName: 1 });
  res.json(new ApiResponse(200, companies, 'Companies fetched'));
});

// ─── 11. Reports & Analytics ──────────────────────────────────────────────────

const getReportsAnalytics = asyncHandler(async (req, res) => {
  const institute = getInstitute(req);

  const students = await Student.find({ collegeName: institute })
    .select('_id isPlaced branch placementDetails name cgpa');
  const studentIds = students.map(s => s._id);

  const applications = await JobApplication.find({ student: { $in: studentIds } })
    .populate('company', 'companyName')
    .select('student status company jobPosting createdAt');

  // Overview
  const placed      = students.filter(s => s.isPlaced);
  const placedPkg   = placed.filter(s => s.placementDetails?.package?.amount);
  const avgPkg = placedPkg.length
    ? placedPkg.reduce((sum, s) => sum + s.placementDetails.package.amount, 0) / placedPkg.length : 0;

  // Department stats
  const deptMap = {};
  students.forEach(s => {
    const d = s.branch || 'Unknown';
    if (!deptMap[d]) deptMap[d] = { total: 0, placed: 0, pkgSum: 0, pkgCount: 0 };
    deptMap[d].total++;
    if (s.isPlaced) {
      deptMap[d].placed++;
      if (s.placementDetails?.package?.amount) {
        deptMap[d].pkgSum   += s.placementDetails.package.amount;
        deptMap[d].pkgCount += 1;
      }
    }
  });
  const departmentStats = Object.entries(deptMap).map(([dept, v]) => ({
    department: dept,
    total:      v.total,
    placed:     v.placed,
    rate:       v.total > 0 ? +(v.placed / v.total * 100).toFixed(1) : 0,
    avgPackage: v.pkgCount > 0 ? Math.round(v.pkgSum / v.pkgCount) : 0,
  })).sort((a, b) => b.rate - a.rate);

  // Company / recruiter stats — group applications by company
  const companyMap = {};
  applications.forEach(a => {
    const cName = a.company?.companyName || 'Unknown';
    if (!companyMap[cName]) companyMap[cName] = { company: cName, applications: 0, offers: 0 };
    companyMap[cName].applications++;
    if (a.status === 'offer_received') companyMap[cName].offers++;
  });
  const companyStats = Object.values(companyMap)
    .map(c => ({ ...c, successRate: c.applications > 0 ? +(c.offers / c.applications * 100).toFixed(1) : 0 }))
    .sort((a, b) => b.offers - a.offers)
    .slice(0, 10);

  // Recent placements — placed students with company & package
  const recentPlacements = placed
    .filter(s => s.placementDetails?.company)
    .sort((a, b) => new Date(b.placementDetails?.placementDate) - new Date(a.placementDetails?.placementDate))
    .slice(0, 20)
    .map(s => ({
      student:    s.name,
      department: s.branch,
      company:    s.placementDetails.company,
      package:    s.placementDetails.package?.amount || 0,
      date:       s.placementDetails.placementDate,
    }));

  res.json(new ApiResponse(200, {
    overview: {
      totalStudents:     students.length,
      placedStudents:    placed.length,
      placementRate:     students.length > 0 ? +(placed.length / students.length * 100).toFixed(1) : 0,
      totalApplications: applications.length,
      totalOffers:       applications.filter(a => a.status === 'offer_received').length,
      averagePackage:    Math.round(avgPkg),
    },
    departmentStats,
    companyStats,
    recentPlacements,
  }, 'Analytics fetched'));
});

// ─── 12. Activity Feed ────────────────────────────────────────────────────────

const getActivityFeed = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [activities, total] = await Promise.all([
    Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Notification.countDocuments({ recipient: req.user._id }),
  ]);
  res.json(new ApiResponse(200, {
    activities: activities.map(a => ({ id: a._id, title: a.title, message: a.message, type: a.type, createdAt: a.createdAt, isRead: a.isRead })),
    pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), total },
  }, 'Activity feed fetched'));
});

// ─── 13. Placement Trends ─────────────────────────────────────────────────────

const getPlacementTrends = asyncHandler(async (req, res) => {
  const { period = '12' } = req.query;
  const students   = await Student.find({ collegeName: getInstitute(req) });
  const studentIds = students.map(s => s._id);
  const applications = await JobApplication.find({ student: { $in: studentIds } });

  const trends = [];
  const now = new Date();
  for (let i = parseInt(period) - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const apps  = applications.filter(a => a.createdAt >= start && a.createdAt <= end);
    const placed = applications.filter(a => a.status === 'offer_received' && a.updatedAt >= start && a.updatedAt <= end);
    trends.push({ month: start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), applications: apps.length, placements: placed.length });
  }
  res.json(new ApiResponse(200, { trends }, 'Placement trends fetched'));
});

// ─── 14. Update Profile ───────────────────────────────────────────────────────

const updateProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const allowed = ['name', 'contactNumber', 'designation', 'department', 'address'];
  allowed.forEach(f => { if (req.body[f] !== undefined) req.user[f] = req.body[f]; });
  await req.user.save();
  res.json(new ApiResponse(200, req.user, 'Profile updated'));
});

// ─── 15. Send Notification ────────────────────────────────────────────────────

const sendNotification = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const { title, message, type, recipients, department } = req.body;
  const institute = getInstitute(req);

  const filter = { collegeName: institute };
  if (department && department !== 'All') filter.branch = department;

  let targetStudents = await Student.find(filter).select('_id');
  if (recipients?.length) targetStudents = targetStudents.filter(s => recipients.includes(s._id.toString()));

  const docs = targetStudents.map(s => ({ recipient: s._id, sender: req.user._id, title, message, type }));
  await Notification.insertMany(docs);

  res.json(new ApiResponse(200, { sentCount: docs.length }, `Notification sent to ${docs.length} students`));
});

// ─── 16. Get Interviews ───────────────────────────────────────────────────────

const getInterviews = asyncHandler(async (req, res) => {
  const institute = getInstitute(req);
  const { search, status, dateFrom, dateTo, page = 1, limit = 10 } = req.query;

  const students = await Student.find({ collegeName: institute }).select('_id');
  const studentIds = students.map(s => s._id);

  const filter = { candidate: { $in: studentIds } };
  if (status && status !== 'All') filter.status = status;
  if (dateFrom) filter.date = { $gte: new Date(dateFrom) };
  if (dateTo)   filter.date = { ...(filter.date || {}), $lte: new Date(dateTo) };
  if (search) {
    // Search by candidate name via a pre-populated match — filter post-populate
    // We'll do name filtering after population
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  let query = Interview.find(filter)
    .populate('candidate', 'name email branch')
    .populate('company', 'companyName')
    .sort({ date: 1 });

  // Get total before applying pagination for count
  const allMatching = await Interview.find(filter).populate('candidate', 'name').lean();

  // Apply search filter on populated candidate name
  let filtered = allMatching;
  if (search) {
    const q = search.toLowerCase();
    filtered = allMatching.filter(i =>
      (i.candidate?.name || i.candidate || '').toLowerCase().includes(q)
    );
  }

  const total = filtered.length;

  // Re-run paginated query (search on name requires post-populate filtering)
  const allPopulated = await Interview.find(filter)
    .populate('candidate', 'name email branch')
    .populate('company', 'companyName')
    .sort({ date: 1 })
    .lean();

  let result = allPopulated;
  if (search) {
    const q = search.toLowerCase();
    result = allPopulated.filter(i =>
      (i.candidate?.name || i.candidate || '').toLowerCase().includes(q) ||
      (i.interviewer || '').toLowerCase().includes(q)
    );
  }

  const paginated = result.slice(skip, skip + parseInt(limit));

  res.json(new ApiResponse(200, {
    interviews: paginated,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(result.length / parseInt(limit)),
      totalInterviews: result.length,
    },
  }, 'Interviews fetched'));
});

const getInterviewStats = asyncHandler(async (req, res) => {
  const institute = getInstitute(req);
  const students  = await Student.find({ collegeName: institute }).select('_id');
  const studentIds = students.map(s => s._id);

  const interviews = await Interview.find({ candidate: { $in: studentIds } });

  const total     = interviews.length;
  const scheduled = interviews.filter(i => i.status === 'Scheduled').length;
  const completed = interviews.filter(i => i.status === 'Completed').length;
  const cancelled = interviews.filter(i => i.status === 'Cancelled').length;
  const inProgress = interviews.filter(i => i.status === 'In Progress').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json(new ApiResponse(200, {
    overview: { totalInterviews: total, scheduledInterviews: scheduled, completedInterviews: completed, cancelledInterviews: cancelled, inProgressInterviews: inProgress, completionRate },
  }, 'Interview stats fetched'));
});

const createInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(new ApiResponse(201, interview, 'Interview created'));
});

const updateInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });
  if (!interview) throw new ApiError(404, 'Interview not found');
  res.json(new ApiResponse(200, interview, 'Interview updated'));
});

const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findByIdAndDelete(req.params.id);
  if (!interview) throw new ApiError(404, 'Interview not found');
  res.json(new ApiResponse(200, null, 'Interview deleted'));
});

// ─── 17. Jobs for TPO ─────────────────────────────────────────────────────────

const getJobs = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.status = status;
  if (search) filter.$or = [{ jobTitle: { $regex: search, $options: 'i' } }, { companyName: { $regex: search, $options: 'i' } }];

  const [jobs, total] = await Promise.all([
    JobPosting.find(filter).populate('company', 'companyName email profilePicture').sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit)),
    JobPosting.countDocuments(filter),
  ]);
  res.json(new ApiResponse(200, { jobs, pagination: { total, currentPage: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) } }, 'Jobs fetched'));
});

// ─── 18. Drive Requests ───────────────────────────────────────────────────────

const getDriveRequests = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const tpoId = req.user._id;
  const query = { driveType: 'on_campus', $or: [{ targetTPOs: tpoId }, { 'collegeApprovals.tpo': tpoId }] };

  if (status && status !== 'all') {
    const approvalStatus = status === 'active' ? 'approved' : status;
    query.collegeApprovals = { $elemMatch: { tpo: tpoId, status: approvalStatus } };
    delete query.$or;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [jobs, total] = await Promise.all([
    JobPosting.find(query).populate('company', 'companyName email industry profilePicture').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    JobPosting.countDocuments(query),
  ]);

  const enriched = jobs.map(job => {
    const obj = job.toObject();
    const mine = (obj.collegeApprovals || []).find(a => a.tpo?.toString() === tpoId.toString());
    return { ...obj, myApprovalStatus: mine?.status || 'pending', myApprovalComment: mine?.comment || '' };
  });

  res.json(new ApiResponse(200, { driveRequests: enriched, pagination: { total, currentPage: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) } }, 'Drive requests fetched'));
});

const getDriveRequest = asyncHandler(async (req, res) => {
  const tpoId = req.user._id;
  const job   = await JobPosting.findOne({ _id: req.params.id, driveType: 'on_campus', $or: [{ targetTPOs: tpoId }, { 'collegeApprovals.tpo': tpoId }] })
    .populate('company', 'companyName email industry companySize website profilePicture description');
  if (!job) throw new ApiError(404, 'Drive request not found');

  const obj  = job.toObject();
  const mine = (obj.collegeApprovals || []).find(a => a.tpo?.toString() === tpoId.toString());
  res.json(new ApiResponse(200, { ...obj, myApprovalStatus: mine?.status || 'pending', myApprovalComment: mine?.comment || '' }, 'Drive request fetched'));
});

const updateDriveStatus = asyncHandler(async (req, res) => {
  const { status, comment } = req.body;
  if (!['approved', 'rejected'].includes(status)) throw new ApiError(400, 'Status must be approved or rejected');

  const tpoId = req.user._id;
  const job   = await JobPosting.findOne({ _id: req.params.id, driveType: 'on_campus', $or: [{ targetTPOs: tpoId }, { 'collegeApprovals.tpo': tpoId }] })
    .populate('company', 'companyName email industry');
  if (!job) throw new ApiError(404, 'Drive request not found');

  const idx = (job.collegeApprovals || []).findIndex(a => a.tpo?.toString() === tpoId.toString());
  if (idx >= 0) {
    job.collegeApprovals[idx].status      = status;
    job.collegeApprovals[idx].comment     = comment || '';
    job.collegeApprovals[idx].respondedAt = new Date();
  } else {
    if (!job.collegeApprovals) job.collegeApprovals = [];
    job.collegeApprovals.push({ tpo: tpoId, instituteName: req.user.instituteName || '', status, comment: comment || '', respondedAt: new Date() });
  }

  const instituteName = req.user.instituteName || req.user.name || 'Your institution';
  const jobTitle      = job.jobTitle || job.title || 'Position';
  const companyName   = job.company?.companyName || 'Company';
  const companyEmail  = job.company?.email;

  if (status === 'approved') {
    job.status = 'active'; job.isActive = true;
    if (!job.postedAt) job.postedAt = new Date();

    // Add to TPO partner companies
    const tpo = await TPO.findById(tpoId);
    if (tpo && !tpo.partnerCompanies?.some(p => p.company?.toString() === job.company._id?.toString())) {
      if (!tpo.partnerCompanies) tpo.partnerCompanies = [];
      tpo.partnerCompanies.push({ company: job.company._id, companyName, industry: job.company.industry, addedAt: new Date(), jobPostingId: job._id });
      await tpo.save();
    }

    // In-app notification to company
    await Notification.createNotification({ recipient: job.company._id, title: 'Drive Approved 🎉', message: `${instituteName} approved your drive for "${jobTitle}". It is now live!`, type: 'approval', priority: 'high', relatedData: { jobPostingId: job._id } });

    // Email to company
    if (companyEmail) {
      sendDriveApprovedEmailToCompany(companyEmail, companyName, jobTitle, instituteName).catch(e => console.error('Company approval email failed:', e.message));
    }

    // Fetch all students from this institute, notify + email them
    const students = await Student.find({ collegeName: instituteName }).select('_id email name');
    if (students.length > 0) {
      // In-app notifications (bulk insert)
      const notifDocs = students.map(s => ({
        recipient: s._id,
        title: `New On-Campus Drive 🎉`,
        message: `${companyName} is coming to your campus for "${jobTitle}". Log in to view details and apply!`,
        type: 'job',
        priority: 'high',
        relatedData: { jobPostingId: job._id },
      }));
      await Notification.insertMany(notifDocs).catch(e => console.error('Student notifications failed:', e.message));

      // Bulk email to students (fire-and-forget)
      const emails = students.map(s => s.email).filter(Boolean);
      sendDriveApprovedEmailToStudents(emails, companyName, jobTitle, instituteName).catch(e => console.error('Student approval emails failed:', e.message));
    }
  } else {
    await Notification.createNotification({ recipient: job.company._id, title: 'Drive Declined', message: `${instituteName} declined your drive for "${jobTitle}". ${comment ? `Reason: ${comment}` : ''}`, type: 'approval', priority: 'high', relatedData: { jobPostingId: job._id } });
  }

  job.markModified('collegeApprovals');
  await job.save({ validateBeforeSave: false });
  res.json(new ApiResponse(200, { status, jobStatus: job.status }, status === 'approved' ? 'Drive approved! Job is now live.' : 'Drive declined.'));
  // Drive status changed → invalidate TPO + company caches
  Promise.all([
    invalidateByPattern('tpo-dash:*'), invalidateByPattern('tpo-partners:*'),
    invalidateByPattern('company-dash:*'), invalidateByPattern('company-analytics:*'),
    invalidateByPattern('stats:*'),
  ]);
});

// ─── 19. Partner Companies ────────────────────────────────────────────────────

const getPartnerCompanies = asyncHandler(async (req, res) => {
  const tpoId = req.user._id;
  const { search } = req.query;

  const approvedJobs = await JobPosting.find({
    driveType: 'on_campus',
    $or: [{ 'collegeApprovals': { $elemMatch: { tpo: tpoId, status: 'approved' } } }, { targetTPOs: tpoId, status: 'active' }],
  }).populate('company', 'companyName email industry companySize website address profilePicture description contactNumber').sort({ createdAt: -1 });

  const map = {};
  for (const job of approvedJobs) {
    if (!job.company) continue;
    const cId = job.company._id.toString();
    if (!map[cId]) map[cId] = { ...job.company.toObject(), drives: [], totalDrives: 0, lastDriveDate: null };
    const driveDate = job.tentativeDriveDate || job.approvedAt || job.createdAt;
    map[cId].drives.push({ jobId: job.jobId, jobTitle: job.jobTitle || job.title, driveDate, status: job.status });
    map[cId].totalDrives++;
    if (!map[cId].lastDriveDate || driveDate > map[cId].lastDriveDate) map[cId].lastDriveDate = driveDate;
  }

  let list = Object.values(map);
  if (search) { const q = search.toLowerCase(); list = list.filter(c => c.companyName?.toLowerCase().includes(q) || c.industry?.toLowerCase().includes(q)); }
  res.json(new ApiResponse(200, { companies: list, total: list.length }, 'Partner companies fetched'));
});

// ─── 20. Student Applications (TPO view) ─────────────────────────────────────

const getStudentApplications = asyncHandler(async (req, res) => {
  const apps = await JobApplication.find({ student: req.params.studentId })
    .populate('jobPosting', 'title company deadline')
    .populate('company', 'companyName')
    .sort({ createdAt: -1 });
  res.json(new ApiResponse(200, { applications: apps }, 'Applications fetched'));
});

// ─── 21. Update Company Status ────────────────────────────────────────────────

const updateCompanyStatus = asyncHandler(async (req, res) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const company = await Company.findById(req.params.companyId);
  if (!company) throw new ApiError(404, 'Company not found');
  company.status = req.body.status;
  await company.save();
  res.json(new ApiResponse(200, company, 'Company status updated'));
  invalidateByPattern('tpo:*'); invalidateByPattern('superadmin:*');
});

module.exports = {
  getDashboardStats, getStudents, createStudent, updateStudent, deleteStudent,
  approveStudent, rejectStudent, bulkApproveStudents, updatePlacement, getCompanies,
  getReportsAnalytics, getActivityFeed, getPlacementTrends, updateProfile, sendNotification,
  getInterviews, getInterviewStats, createInterview, updateInterview, deleteInterview,
  getJobs, getDriveRequests, getDriveRequest, updateDriveStatus, getPartnerCompanies,
  getStudentApplications, updateCompanyStatus,
};




