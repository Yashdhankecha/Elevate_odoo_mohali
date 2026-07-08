const User        = require('../models/User');
const TPO         = require('../models/TPO');
const Company     = require('../models/Company');
const Student     = require('../models/Student');
const JobPosting  = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const ApiError    = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { invalidateByPattern } = require('../utils/redisClient');

// ─── Helper ───────────────────────────────────────────────────────────────────

const getTimeAgo = (date) => {
  const diff = Date.now() - new Date(date);
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins} min ago`;
  if (hrs  < 24)  return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// ─── 1. Overview ──────────────────────────────────────────────────────────────

const getOverview = asyncHandler(async (req, res) => {
  const [total, students, companies, tpos, pending, breakdown] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'company' }),
    User.countDocuments({ role: 'tpo' }),
    User.countDocuments({ isVerified: false }),
    User.aggregate([{ $match: { isVerified: false } }, { $group: { _id: '$role', count: { $sum: 1 } } }]),
  ]);

  const recent = await User.find().sort({ createdAt: -1 }).limit(10).select('role email createdAt isVerified').lean();
  const systemHealth = total > 0 ? ((total - pending) / total * 100).toFixed(1) : 0;

  const formattedActivities = recent.map(a => {
    const msgs  = { tpo: `New TPO registration: ${a.email}`, company: `New company registration: ${a.email}`, student: `New student registration: ${a.email}` };
    const types = { tpo: 'admin', company: 'company', student: 'student' };
    return { id: a._id, message: msgs[a.role] || `Activity: ${a.email}`, time: getTimeAgo(a.createdAt), type: types[a.role] || 'other', status: a.isVerified ? 'completed' : 'pending' };
  });

  res.json(new ApiResponse(200, {
    stats: [
      { title: 'Total Users',        value: String(total),     icon: 'FaUsers',        color: 'bg-blue-500' },
      { title: 'Active Companies',   value: String(companies), icon: 'FaBuilding',     color: 'bg-green-500' },
      { title: 'Institutions',       value: String(tpos),      icon: 'FaGraduationCap',color: 'bg-purple-500' },
      { title: 'Pending Approvals',  value: String(pending),   icon: 'FaUserShield',   color: 'bg-orange-500' },
      { title: 'System Health',      value: `${systemHealth}%`,icon: 'FaShieldAlt',    color: 'bg-indigo-500' },
      { title: 'Total Students',     value: String(students),  icon: 'FaDatabase',     color: 'bg-pink-500' },
    ],
    recentActivities: formattedActivities,
    pendingApprovals: [
      { type: 'Admin',   count: breakdown.find(p => p._id === 'tpo')?.count     || 0, priority: 'high' },
      { type: 'Company', count: breakdown.find(p => p._id === 'company')?.count || 0, priority: 'medium' },
      { type: 'Student', count: breakdown.find(p => p._id === 'student')?.count || 0, priority: 'low' },
    ],
  }, 'Overview fetched'));
});

// ─── 2. Admin Approvals ───────────────────────────────────────────────────────

const getAdminApprovals = asyncHandler(async (req, res) => {
  const requests = await User.find({ role: 'tpo', isVerified: false }).select('email createdAt').lean();
  const formatted = requests.map((r, i) => {
    const domain = r.email.split('@')[1];
    return { id: r._id, name: `Admin ${i + 1}`, email: r.email, institution: domain ? domain.replace('.ac.in', '').toUpperCase() : 'Unknown', department: 'Training & Placement', designation: 'TPO', status: 'pending', submittedDate: new Date(r.createdAt).toISOString().split('T')[0], priority: 'high' };
  });
  res.json(new ApiResponse(200, formatted, 'Admin approvals fetched'));
});

// ─── 3. Company Approvals ─────────────────────────────────────────────────────

const getCompanyApprovals = asyncHandler(async (req, res) => {
  const requests = await User.find({ role: 'company', isVerified: false }).select('email createdAt company').lean();
  const formatted = requests.map((r, i) => ({
    id: r._id, name: r.company?.companyName || `Company ${i + 1}`, email: r.email,
    phone: r.company?.contactNumber || '+91-00000-00000', industry: r.company?.industry || 'Technology',
    size: r.company?.companySize || 'Medium', status: 'pending',
    submittedDate: new Date(r.createdAt).toISOString().split('T')[0], priority: 'medium',
  }));
  res.json(new ApiResponse(200, formatted, 'Company approvals fetched'));
});

// ─── 4. Approve/Reject User ───────────────────────────────────────────────────

const approveUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (status === 'approved') {
    user.isVerified = true;
    await user.save();
    await Promise.all([invalidateByPattern('superadmin:*'), invalidateByPattern('stats:*')]);
    return res.json(new ApiResponse(200, null, 'User approved successfully'));
  } else if (status === 'rejected') {
    await User.findByIdAndDelete(userId);
    await Promise.all([invalidateByPattern('superadmin:*'), invalidateByPattern('stats:*')]);
    return res.json(new ApiResponse(200, null, 'User rejected and removed'));
  }
  throw new ApiError(400, 'Invalid status. Use "approved" or "rejected".');
});

// ─── 5. Institutions ──────────────────────────────────────────────────────────

const getInstitutions = asyncHandler(async (req, res) => {
  const institutions = await User.find({ role: 'tpo' }).select('email tpo createdAt isVerified').lean();
  const formatted = institutions.map((inst, i) => {
    const domain = inst.email.split('@')[1];
    return { id: inst._id, name: domain ? domain.replace('.ac.in', '').toUpperCase() : `Institution ${i + 1}`, email: inst.email, contact: inst.tpo?.contactNumber || '+91-00000-00000', location: inst.tpo?.location || 'Not specified', status: inst.isVerified ? 'active' : 'pending', registeredDate: new Date(inst.createdAt).toISOString().split('T')[0], adminCount: 1, studentCount: 0 };
  });
  res.json(new ApiResponse(200, formatted, 'Institutions fetched'));
});

// ─── 6. System Analytics ──────────────────────────────────────────────────────

const getSystemAnalytics = asyncHandler(async (req, res) => {
  const [total, verified, pending] = await Promise.all([User.countDocuments(), User.countDocuments({ isVerified: true }), User.countDocuments({ isVerified: false })]);
  res.json(new ApiResponse(200, { totalUsers: total, verifiedUsers: verified, pendingUsers: pending, verificationRate: total > 0 ? ((verified / total) * 100).toFixed(1) : 0, systemUptime: '99.9%', lastBackup: new Date().toISOString(), securityStatus: 'Secure' }, 'System analytics fetched'));
});

// ─── 7. Registered TPOs ───────────────────────────────────────────────────────

const getRegisteredTPOs = asyncHandler(async (req, res) => {
  const tpos = await TPO.find().select('-password -emailVerificationOTP -passwordResetToken').sort({ createdAt: -1 }).lean();
  res.json(new ApiResponse(200, tpos, 'Registered TPOs fetched'));
});

// ─── 8. Registered Companies ─────────────────────────────────────────────────

const getRegisteredCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().select('-password -emailVerificationOTP -passwordResetToken').sort({ createdAt: -1 }).lean();
  res.json(new ApiResponse(200, companies, 'Registered companies fetched'));
});

// ─── 9. Update Status ─────────────────────────────────────────────────────────

const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, type } = req.body;
  if (!['active', 'pending', 'rejected'].includes(status)) throw new ApiError(400, 'Invalid status');
  const Model = type === 'tpo' ? TPO : type === 'company' ? Company : null;
  if (!Model) throw new ApiError(400, 'Invalid type');
  const updated = await Model.findByIdAndUpdate(id, { status }, { new: true }).select('-password -emailVerificationOTP -passwordResetToken');
  if (!updated) throw new ApiError(404, `${type} not found`);
  await Promise.all([
    invalidateByPattern('superadmin:*'),
    invalidateByPattern(type === 'tpo' ? 'tpo:*' : 'company:*'),
    invalidateByPattern('stats:*'),
  ]);
  res.json(new ApiResponse(200, updated, `${type} status updated to ${status}`));
});

// ─── 10. Management Stats ─────────────────────────────────────────────────────

const getManagementStats = asyncHandler(async (req, res) => {
  const [tpoStats, companyStats, totalTpos, totalCompanies] = await Promise.all([
    TPO.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Company.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    TPO.countDocuments(),
    Company.countDocuments(),
  ]);
  const find = (arr, val) => arr.find(s => s._id === val)?.count || 0;
  res.json(new ApiResponse(200, {
    tpos:      { total: totalTpos,     active: find(tpoStats, 'active'),     pending: find(tpoStats, 'pending'),     rejected: find(tpoStats, 'rejected') },
    companies: { total: totalCompanies, active: find(companyStats, 'active'), pending: find(companyStats, 'pending'), rejected: find(companyStats, 'rejected') },
  }, 'Management stats fetched'));
});

// ─── 11. Full Dashboard Stats ─────────────────────────────────────────────────

const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  // ── Core counts (parallel) ────────────────────────────────────────────────
  const [
    totalStudents, totalTPOs, totalCompanies,
    totalJobs, totalApplications,
    pendingTPOs, pendingCompanies,
    activeTPOs, activeCompanies,
    placedStudents, activeJobs,
    offerReceived, rejected,
  ] = await Promise.all([
    Student.countDocuments({}),
    TPO.countDocuments({}),
    Company.countDocuments({}),
    JobPosting.countDocuments({}),
    JobApplication.countDocuments({}),
    TPO.countDocuments({ status: 'pending' }),
    Company.countDocuments({ status: 'pending' }),
    TPO.countDocuments({ status: 'active' }),
    Company.countDocuments({ status: 'active' }),
    Student.countDocuments({ isPlaced: true }),
    JobPosting.countDocuments({ status: { $in: ['active', 'approved'] } }),
    JobApplication.countDocuments({ status: 'offer_received' }),
    JobApplication.countDocuments({ status: 'rejected' }),
  ]);

  // ── Monthly registration trend (last 12 months) ───────────────────────────
  const monthLabels = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthLabels.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: d.toLocaleString('default', { month: 'short' }) });
  }

  const [studentTrend, tpoTrend, companyTrend, jobTrend] = await Promise.all([
    Student.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, count: { $sum: 1 } } }
    ]),
    TPO.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, count: { $sum: 1 } } }
    ]),
    Company.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, count: { $sum: 1 } } }
    ]),
    JobPosting.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, count: { $sum: 1 } } }
    ]),
  ]);

  const findCount = (arr, y, m) => arr.find(x => x._id.y === y && x._id.m === m)?.count || 0;
  const registrationTrend = monthLabels.map(({ year, month, label }) => ({
    month: label,
    students:  findCount(studentTrend, year, month),
    tpos:      findCount(tpoTrend, year, month),
    companies: findCount(companyTrend, year, month),
    jobs:      findCount(jobTrend, year, month),
  }));

  // ── Branch distribution ───────────────────────────────────────────────────
  const branchAgg = await Student.aggregate([
    { $match: { branch: { $exists: true, $ne: null } } },
    { $group: { _id: '$branch', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);
  const branchDistribution = branchAgg.map(b => ({ name: b._id, value: b.count }));

  // ── Application funnel ────────────────────────────────────────────────────
  const funnelAgg = await JobApplication.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  const funnelMap = {};
  funnelAgg.forEach(f => { funnelMap[f._id] = f.count; });
  const applicationFunnel = [
    { stage: 'Applied',           count: funnelMap['applied'] || 0 },
    { stage: 'Test Scheduled',    count: funnelMap['test_scheduled'] || 0 },
    { stage: 'Interview',         count: funnelMap['interview_scheduled'] || 0 },
    { stage: 'Offer Received',    count: funnelMap['offer_received'] || 0 },
    { stage: 'Rejected',          count: funnelMap['rejected'] || 0 },
  ];

  // ── Job industry breakdown ────────────────────────────────────────────────
  const industryAgg = await JobPosting.aggregate([
    { $group: { _id: '$industry', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 6 },
  ]);
  const industryBreakdown = industryAgg.map(i => ({ name: i._id || 'Other', value: i.count }));

  // ── Top companies by job postings ─────────────────────────────────────────
  const topCompaniesAgg = await JobPosting.aggregate([
    { $group: { _id: '$companyName', jobs: { $sum: 1 }, views: { $sum: '$views' } } },
    { $sort: { jobs: -1 } },
    { $limit: 5 },
  ]);
  const topCompanies = topCompaniesAgg.map(c => ({ name: c._id, jobs: c.jobs, views: c.views || 0 }));

  // ── TPO status breakdown ──────────────────────────────────────────────────
  const tpoStatusAgg = await TPO.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const companyStatusAgg = await Company.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const findStatus = (arr, s) => arr.find(x => x._id === s)?.count || 0;

  // ── Recent activities ─────────────────────────────────────────────────────
  const [recentStudents, recentTPOs, recentCompanies, recentJobs] = await Promise.all([
    Student.find().sort({ createdAt: -1 }).limit(4).select('name email createdAt').lean(),
    TPO.find().sort({ createdAt: -1 }).limit(3).select('name email instituteName createdAt status').lean(),
    Company.find().sort({ createdAt: -1 }).limit(3).select('companyName email industry createdAt status').lean(),
    JobPosting.find().sort({ createdAt: -1 }).limit(3).select('jobTitle companyName status createdAt').lean(),
  ]);

  const recentActivities = [
    ...recentStudents.map(s => ({ type: 'student', message: `New student registered: ${s.name || s.email}`, time: s.createdAt, icon: 'user' })),
    ...recentTPOs.map(t => ({ type: 'tpo', message: `TPO registered: ${t.name} (${t.instituteName || ''})`, time: t.createdAt, status: t.status, icon: 'shield' })),
    ...recentCompanies.map(c => ({ type: 'company', message: `Company joined: ${c.companyName}`, time: c.createdAt, status: c.status, icon: 'building' })),
    ...recentJobs.map(j => ({ type: 'job', message: `Job posted: ${j.jobTitle} @ ${j.companyName}`, time: j.createdAt, status: j.status, icon: 'briefcase' })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 12);

  res.json(new ApiResponse(200, {
    // Core stats
    totalStudents, totalTPOs, totalCompanies, totalJobs, totalApplications,
    placedStudents, activeJobs, offerReceived,
    pendingTPOs, pendingCompanies,
    activeTPOs, activeCompanies,
    placementRate: totalStudents > 0 ? +((placedStudents / totalStudents) * 100).toFixed(1) : 0,
    offerRate: totalApplications > 0 ? +((offerReceived / totalApplications) * 100).toFixed(1) : 0,
    // Trends & charts
    registrationTrend,
    branchDistribution,
    applicationFunnel,
    industryBreakdown,
    topCompanies,
    // Status breakdown
    tpoStatus: {
      active: findStatus(tpoStatusAgg, 'active'),
      pending: findStatus(tpoStatusAgg, 'pending'),
      rejected: findStatus(tpoStatusAgg, 'rejected'),
    },
    companyStatus: {
      active: findStatus(companyStatusAgg, 'active'),
      pending: findStatus(companyStatusAgg, 'pending'),
      rejected: findStatus(companyStatusAgg, 'rejected'),
    },
    // Recent
    recentActivities,
  }, 'Dashboard stats fetched'));
});

module.exports = { getOverview, getAdminApprovals, getCompanyApprovals, approveUser, getInstitutions, getSystemAnalytics, getRegisteredTPOs, getRegisteredCompanies, updateStatus, getManagementStats, getDashboardStats };
