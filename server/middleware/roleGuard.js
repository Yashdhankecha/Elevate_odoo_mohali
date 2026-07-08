/**
 * middleware/roleGuard.js
 * Centralised role guards — replaces duplicated inline middleware across all route files.
 */

const ApiError = require('../utils/ApiError');

// ── Generic guard factory ─────────────────────────────────────────────────────
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(new ApiError(401, 'Authentication required'));
  if (!roles.includes(req.user.role))
    return next(new ApiError(403, `Access denied. Required role: ${roles.join(' or ')}`));
  next();
};

// ── Pre-built guards ──────────────────────────────────────────────────────────
const isSuperadmin = requireRole('superadmin');
const isTPO        = requireRole('tpo', 'superadmin');
const isCompany    = requireRole('company', 'superadmin');
const isStudent    = requireRole('student');
const isStaff      = requireRole('tpo', 'company', 'superadmin'); // any non-student role

module.exports = { requireRole, isSuperadmin, isTPO, isCompany, isStudent, isStaff };
