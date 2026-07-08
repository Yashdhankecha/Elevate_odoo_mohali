const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { cacheResponse } = require('../middleware/cacheMiddleware');
const { tpoInstituteAccess, verifyStudentInstitute, verifyBulkInstituteAccess } = require('../middleware/tpoInstituteAccess');

const {
  getDashboardStats,
  getStudents, createStudent, updateStudent, deleteStudent,
  approveStudent, rejectStudent, bulkApproveStudents,
  updatePlacement, getCompanies,
  getReportsAnalytics, getActivityFeed, getPlacementTrends,
  updateProfile, sendNotification,
  getStudentApplications, updateCompanyStatus,
  getInterviews, getInterviewStats, createInterview, updateInterview, deleteInterview,
  getJobs, getDriveRequests, getDriveRequest, updateDriveStatus, getPartnerCompanies,
} = require('../controllers/tpoController');

const router = express.Router();

// ── Auth guard shorthand ──────────────────────────────────────────────────────
const isTPO = (req, res, next) => {
  if (req.user.role !== 'tpo') return res.status(403).json({ success: false, message: 'TPO access only.' });
  next();
};
const auth  = [authenticateToken, isTPO];
const authI = [authenticateToken, isTPO, tpoInstituteAccess];   // + institute filter
const authS = [authenticateToken, isTPO, verifyStudentInstitute]; // + student ownership

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get('/dashboard-stats', ...authI, cacheResponse('tpo-dash', 300,
  (req) => req.user._id.toString()
), getDashboardStats);  // 5 min, per-user

// ── Students ──────────────────────────────────────────────────────────────────
router.get('/students',                        ...authI, getStudents);
router.post('/students', ...authI, [
  body('name').notEmpty(), body('email').isEmail(),
  body('rollNumber').notEmpty(), body('branch').notEmpty(),
  body('cgpa').isFloat({ min: 0, max: 10 }),
], createStudent);
router.put('/students/bulk-update',            ...authI, bulkApproveStudents); // reuse bulk logic
router.put('/students/bulk-approve',           ...authI, bulkApproveStudents);
router.put('/students/:id',                    ...authS, updateStudent);
router.delete('/students/:id',                 ...authS, deleteStudent);
router.put('/students/:id/approve',            ...authS, approveStudent);
router.put('/students/:id/reject',             ...authS, rejectStudent);
router.put('/students/:studentId/placement',   ...authS, [
  body('isPlaced').optional().isBoolean(),
  body('package').optional().isNumeric(),
], updatePlacement);
router.get('/students/:studentId/applications',...authS, getStudentApplications);

// Student profile approve/reject (new URLs, safe from conflicts)
router.put('/students/:studentId/profile-approve', ...authS, approveStudent);
router.put('/students/:studentId/profile-reject',  ...authS, rejectStudent);

// ── Companies ─────────────────────────────────────────────────────────────────
router.get('/companies',                        ...auth, cacheResponse('tpo', 900), getCompanies);  // 15 min
router.put('/companies/:companyId/status', ...auth, [body('status').isIn(['active','inactive','pending'])], updateCompanyStatus);

// ── Analytics & Reporting ─────────────────────────────────────────────────────
router.get('/reports-analytics', ...auth, cacheResponse('tpo-analytics', 900,
  (req) => req.user._id.toString()
), getReportsAnalytics);  // 15 min, per-user
router.get('/activity-feed',     ...auth, getActivityFeed);
router.get('/placement-trends',  ...auth, cacheResponse('tpo-trends', 1800,
  (req) => `${req.user._id}:${req.query.period || '12'}`
), getPlacementTrends);  // 30 min, per-user+period

// ── Profile ───────────────────────────────────────────────────────────────────
router.put('/profile', ...auth, [
  body('name').optional().isLength({ min: 2, max: 50 }),
  body('contactNumber').optional(),
], updateProfile);

// ── Notifications ─────────────────────────────────────────────────────────────
router.post('/notifications', ...auth, [
  body('title').isLength({ min: 5, max: 100 }),
  body('message').isLength({ min: 10, max: 500 }),
  body('type').isIn(['info', 'success', 'warning', 'error']),
], sendNotification);

// ── Interviews ────────────────────────────────────────────────────────────────
router.get('/interviews/stats',  ...auth, cacheResponse('tpo-interview-stats', 300,
  (req) => req.user._id.toString()
), getInterviewStats);  // 5 min, per-user
router.get('/interviews',        ...auth, getInterviews);
router.post('/interviews',       ...auth, createInterview);
router.put('/interviews/:id',    ...auth, updateInterview);
router.delete('/interviews/:id', ...auth, deleteInterview);

// ── Jobs ──────────────────────────────────────────────────────────────────────
router.get('/jobs', ...auth, getJobs);

// ── Drive Requests ────────────────────────────────────────────────────────────
router.get('/drive-requests',              ...auth, getDriveRequests);
router.get('/drive-requests/:id',          ...auth, getDriveRequest);
router.patch('/drive-requests/:id/status', ...auth, updateDriveStatus);

// ── Partner Companies ─────────────────────────────────────────────────────────
router.get('/partner-companies', ...auth, cacheResponse('tpo-partners', 900,
  (req) => req.user._id.toString()
), getPartnerCompanies);  // 15 min, per-user

module.exports = router;
