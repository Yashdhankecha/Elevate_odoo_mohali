const Student        = require('../models/Student');
const Company        = require('../models/Company');
const TPO            = require('../models/TPO');
const SuperAdmin     = require('../models/SuperAdmin');
const ApiError       = require('../utils/ApiError');
const ApiResponse    = require('../utils/ApiResponse');
const asyncHandler   = require('../utils/asyncHandler');

// ── Overview ──────────────────────────────────────────────────────────────────

/** GET /api/admin/stats */
const getStats = asyncHandler(async (req, res) => {
  const [students, companies, tpos, superadmins] = await Promise.all([
    Student.countDocuments({}),
    Company.countDocuments({}),
    TPO.countDocuments({}),
    SuperAdmin.countDocuments({}),
  ]);
  res.json(new ApiResponse(200, { students, companies, tpos, superadmins }, 'Stats fetched'));
});

/** GET /api/admin/pending-users */
const getPendingUsers = asyncHandler(async (req, res) => {
  const [students, companies, tpos] = await Promise.all([
    Student.find({ isActive: false, isVerified: true }).select('-password').sort({ createdAt: -1 }),
    Company.find({ status: 'pending', isVerified: true }).select('-password').sort({ createdAt: -1 }),
    TPO.find({ status: 'pending', isVerified: true }).select('-password').sort({ createdAt: -1 }),
  ]);

  res.json(new ApiResponse(200, {
    students:  students.map(s => ({ ...s.toObject(), userType: 'student' })),
    companies: companies.map(c => ({ ...c.toObject(), userType: 'company' })),
    tpos:      tpos.map(t => ({ ...t.toObject(), userType: 'tpo' })),
    total:     students.length + companies.length + tpos.length,
  }, 'Pending users fetched'));
});

/** PATCH /api/admin/users/:userType/:id/approve */
const approveUser = asyncHandler(async (req, res) => {
  const { userType, id } = req.params;
  const ModelMap = { student: Student, company: Company, tpo: TPO };
  const Model = ModelMap[userType];
  if (!Model) throw new ApiError(400, 'Invalid user type');

  const updateData = userType === 'student'
    ? { isActive: true }
    : { status: 'active' };

  const user = await Model.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select('-password');
  if (!user) throw new ApiError(404, `${userType} not found`);

  res.json(new ApiResponse(200, user, `${userType} approved successfully`));
});

/** PATCH /api/admin/users/:userType/:id/reject */
const rejectUser = asyncHandler(async (req, res) => {
  const { userType, id } = req.params;
  const { reason } = req.body;
  const ModelMap = { student: Student, company: Company, tpo: TPO };
  const Model = ModelMap[userType];
  if (!Model) throw new ApiError(400, 'Invalid user type');

  const updateData = userType === 'student'
    ? { isActive: false, rejectionReason: reason }
    : { status: 'rejected', rejectionReason: reason };

  const user = await Model.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select('-password');
  if (!user) throw new ApiError(404, `${userType} not found`);

  res.json(new ApiResponse(200, user, `${userType} rejected`));
});

// ── Raw-collection counters (admin panel stat cards) ─────────────────────────

const mongoose = require('mongoose');
const User     = require('../models/User');

const ensureDB = () => {
  if (mongoose.connection.readyState !== 1) throw new ApiError(500, 'Database connection not ready');
};

const getTotalStudents = asyncHandler(async (req, res) => {
  ensureDB();
  const db = mongoose.connection.db;
  const [a, b] = await Promise.all([db.collection('users').countDocuments({ role: 'student' }), db.collection('students').countDocuments({})]);
  res.json(new ApiResponse(200, { count: a + b }, 'Total students'));
});

const getTotalCompanies = asyncHandler(async (req, res) => {
  ensureDB();
  const db = mongoose.connection.db;
  const [a, b] = await Promise.all([db.collection('users').countDocuments({ role: 'company' }), db.collection('companies').countDocuments({})]);
  res.json(new ApiResponse(200, { count: a + b }, 'Total companies'));
});

const getTotalJobPostings = asyncHandler(async (req, res) => {
  ensureDB();
  const count = await mongoose.connection.db.collection('jobpostings').countDocuments({});
  res.json(new ApiResponse(200, { count }, 'Total job postings'));
});

const getTotalApplications = asyncHandler(async (req, res) => {
  ensureDB();
  const count = await mongoose.connection.db.collection('jobapplications').countDocuments({});
  res.json(new ApiResponse(200, { count }, 'Total applications'));
});

const getRecentActivities = asyncHandler(async (req, res) => {
  const recent = await User.find().sort({ createdAt: -1 }).limit(10).select('role email createdAt name companyName').lean();
  const activities = recent.map(a => {
    const msgs = { tpo: `New TPO registration: ${a.email}`, company: `New company registration: ${a.companyName || a.email}`, student: `New student registration: ${a.name || a.email}`, superadmin: `Superadmin activity: ${a.email}` };
    const types = { tpo: 'admin_registration', company: 'company_registration', student: 'student_registration', superadmin: 'superadmin_activity' };
    return { id: a._id, message: msgs[a.role] || `Activity: ${a.email}`, type: types[a.role] || 'activity', date: a.createdAt };
  });
  res.json(new ApiResponse(200, { activities }, 'Recent activities'));
});

const getPendingRegistrations = asyncHandler(async (req, res) => {
  ensureDB();
  const db = mongoose.connection.db;
  const [fromUsers, fromTPOs, fromCompanies] = await Promise.all([
    db.collection('users').find({ role: { $in: ['tpo', 'company'] }, status: 'pending' }).toArray(),
    db.collection('tpos').find({ status: 'pending' }).toArray(),
    db.collection('companies').find({ status: 'pending' }).toArray(),
  ]);
  fromTPOs.forEach(t => { if (!t.role) t.role = 'tpo'; });
  fromCompanies.forEach(c => { if (!c.role) c.role = 'company'; });
  const all = [...fromUsers, ...fromTPOs, ...fromCompanies].map(u => ({
    id: u._id, email: u.email, role: u.role || 'tpo', status: 'pending', createdAt: u.createdAt,
    name: u.role === 'company' ? (u.company?.companyName || u.companyName || 'Company') : (u.name || u.instituteName || 'TPO'),
    instituteName: u.instituteName || u.company?.companyName || u.companyName || 'N/A',
  }));
  res.json(new ApiResponse(200, { pendingUsers: all }, `${all.length} pending registrations`));
});

const approveUserRaw = asyncHandler(async (req, res) => {
  ensureDB();
  const db = mongoose.connection.db;
  const oid = new mongoose.Types.ObjectId(req.params.id);
  let result = await db.collection('users').updateOne({ _id: oid, role: { $in: ['tpo', 'company'] } }, { $set: { status: 'active' } });
  let type = 'User';
  if (result.matchedCount === 0) { result = await db.collection('tpos').updateOne({ _id: oid }, { $set: { status: 'active' } }); type = 'TPO'; }
  if (result.matchedCount === 0) { result = await db.collection('companies').updateOne({ _id: oid }, { $set: { status: 'active' } }); type = 'Company'; }
  if (result.matchedCount === 0) throw new ApiError(404, 'User not found');
  if (result.modifiedCount === 0) throw new ApiError(400, `${type} was already approved`);
  res.json(new ApiResponse(200, null, `${type} approved successfully`));
});

const rejectUserRaw = asyncHandler(async (req, res) => {
  ensureDB();
  const db = mongoose.connection.db;
  const oid = new mongoose.Types.ObjectId(req.params.id);
  let result = await db.collection('users').updateOne({ _id: oid, role: { $in: ['tpo', 'company'] } }, { $set: { status: 'rejected' } });
  let type = 'User';
  if (result.matchedCount === 0) { result = await db.collection('tpos').updateOne({ _id: oid }, { $set: { status: 'rejected' } }); type = 'TPO'; }
  if (result.matchedCount === 0) { result = await db.collection('companies').updateOne({ _id: oid }, { $set: { status: 'rejected' } }); type = 'Company'; }
  if (result.matchedCount === 0) throw new ApiError(404, 'User not found');
  if (result.modifiedCount === 0) throw new ApiError(400, `${type} was already rejected`);
  res.json(new ApiResponse(200, null, `${type} rejected successfully`));
});

module.exports = {
  getStats, getPendingUsers, approveUser, rejectUser,
  getTotalStudents, getTotalCompanies, getTotalJobPostings, getTotalApplications,
  getRecentActivities, getPendingRegistrations, approveUserRaw, rejectUserRaw,
};
