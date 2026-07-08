const jwt        = require('jsonwebtoken');
const Student    = require('../models/Student');
const Company    = require('../models/Company');
const TPO        = require('../models/TPO');
const SuperAdmin = require('../models/SuperAdmin');
const User       = require('../models/User');

// ── Helper: find user across all collections in parallel ─────────────────────
const findUserById = async (id) => {
  // Run all collection lookups concurrently — return the first one that resolves
  const queries = [
    Student.findById(id).select('-password'),
    Company.findById(id).select('-password'),
    TPO.findById(id).select('-password'),
    SuperAdmin.findById(id).select('-password'),
    User.findById(id).select('-password'),
  ];

  const results = await Promise.all(queries.map(q => q.catch(() => null)));
  return results.find(Boolean) || null;
};

// ── Helper: derive active status by collection ────────────────────────────────
const isActiveUser = (user) => {
  const model = user.constructor.modelName;
  if (model === 'Student')    return user.isActive === true;
  if (model === 'SuperAdmin') return true; // superadmins always active
  return user.status === 'active';
};

const getUserStatus = (user) => {
  const model = user.constructor.modelName;
  if (model === 'Student') return user.isActive ? 'active' : 'pending';
  return user.status || 'pending';
};

// ── authenticateToken ─────────────────────────────────────────────────────────

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token. User not found.' });
    }

    // ── Status gate ───────────────────────────────────────────────────────────
    if (user.role !== 'superadmin' && !isActiveUser(user)) {
      const status = getUserStatus(user);
      if (status === 'pending') {
        return res.status(403).json({ success: false, message: 'Your registration is pending approval.' });
      }
      if (status === 'rejected') {
        return res.status(403).json({ success: false, message: 'Your registration has been rejected. Contact support.' });
      }
    }

    // ── Email verification gate ───────────────────────────────────────────────
    if (!user.googleId && !user.isVerified && !['admin', 'superadmin'].includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Please verify your email before accessing this resource.' });
    }

    // ── Ensure role field is set (for specific-collection models) ─────────────
    const roleMap = { Student: 'student', Company: 'company', TPO: 'tpo', SuperAdmin: 'superadmin' };
    if (!user.role && roleMap[user.constructor.modelName]) {
      user.role = roleMap[user.constructor.modelName];
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
    }
    next(error); // Pass unknown errors to the global error handler
  }
};

// ── Role guards (legacy — new code should use middleware/roleGuard.js) ─────────

const isAdmin = (req, res, next) => {
  if (req.user && ['admin', 'superadmin'].includes(req.user.role)) return next();
  res.status(403).json({ success: false, message: 'Access denied. Admin role required.' });
};

const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') return next();
  res.status(403).json({ success: false, message: 'Access denied. Superadmin role required.' });
};

const isEmailVerified = (req, res, next) => {
  if (req.user && (req.user.isVerified || req.user.googleId || ['admin', 'superadmin'].includes(req.user.role))) return next();
  res.status(403).json({ success: false, message: 'Please verify your email before accessing this resource.' });
};

module.exports = { authenticateToken, isAdmin, isSuperAdmin, isEmailVerified };
