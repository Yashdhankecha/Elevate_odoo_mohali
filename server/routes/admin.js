const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { isSuperadmin } = require('../middleware/roleGuard');
const {
  getTotalStudents, getTotalCompanies, getTotalJobPostings, getTotalApplications,
  getRecentActivities, getPendingRegistrations, approveUserRaw, rejectUserRaw,
} = require('../controllers/adminController');

const router = express.Router();
const auth = [authenticateToken, isSuperadmin];

// ── Stat counters ─────────────────────────────────────────────────────────────
router.get('/total-students',     ...auth, getTotalStudents);
router.get('/total-companies',    ...auth, getTotalCompanies);
router.get('/total-job-postings', ...auth, getTotalJobPostings);
router.get('/total-applications', ...auth, getTotalApplications);

// ── Activities & registrations ────────────────────────────────────────────────
router.get('/recent-activities',      ...auth, getRecentActivities);
router.get('/pending-registrations',  ...auth, getPendingRegistrations);

// ── Approval actions ──────────────────────────────────────────────────────────
router.post('/approve-user/:id', ...auth, approveUserRaw);
router.post('/reject-user/:id',  ...auth, rejectUserRaw);

module.exports = router;
