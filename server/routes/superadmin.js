const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { cacheResponse } = require('../middleware/cacheMiddleware');
const { isSuperadmin } = require('../middleware/roleGuard');
const {
  getOverview, getAdminApprovals, getCompanyApprovals, approveUser,
  getInstitutions, getSystemAnalytics, getRegisteredTPOs, getRegisteredCompanies,
  updateStatus, getManagementStats, getDashboardStats,
} = require('../controllers/superadminController');

const router = express.Router();
const auth = [authenticateToken, isSuperadmin];

// ── Dashboard overview ────────────────────────────────────────────────────────
router.get('/overview',          ...auth, cacheResponse('superadmin', 300), getOverview);           // 5 min
router.get('/dashboard-stats',   ...auth, cacheResponse('superadmin', 300), getDashboardStats);    // 5 min

// ── Approval management ───────────────────────────────────────────────────────
router.get('/admin-approvals',   ...auth, getAdminApprovals);
router.get('/company-approvals', ...auth, getCompanyApprovals);
router.post('/approve/:userId',  ...auth, approveUser);

// ── Institution management ────────────────────────────────────────────────────
router.get('/institutions',      ...auth, getInstitutions);

// ── Analytics & stats ─────────────────────────────────────────────────────────
router.get('/system-analytics',  ...auth, cacheResponse('superadmin', 300), getSystemAnalytics);   // 5 min
router.get('/management-stats',  ...auth, cacheResponse('superadmin', 300), getManagementStats);   // 5 min

// ── Registered users ──────────────────────────────────────────────────────────
router.get('/registered-tpos',       ...auth, cacheResponse('superadmin', 600), getRegisteredTPOs);       // 10 min
router.get('/registered-companies',  ...auth, cacheResponse('superadmin', 600), getRegisteredCompanies);  // 10 min

// ── Status update ─────────────────────────────────────────────────────────────
router.put('/update-status/:id',     ...auth, updateStatus);

module.exports = router;
