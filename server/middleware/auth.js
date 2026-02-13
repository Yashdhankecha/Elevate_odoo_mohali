const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const TPO = require('../models/TPO');
const Company = require('../models/Company');
const SuperAdmin = require('../models/SuperAdmin');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    console.log('=== AUTHENTICATION MIDDLEWARE ===');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);

    // Get token from cookies first, then from Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log('Token from cookies:', req.cookies.token ? 'Present' : 'Missing');
    console.log('Token from Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('Final token:', token ? token.substring(0, 20) + '...' : 'None');

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded, user ID:', decoded.userId);

    // Find user by id in the appropriate collection
    console.log('Finding user in database...');
    let user = null;

    // Try to find user in each collection
    user = await Student.findById(decoded.userId).select('-password');
    if (!user) {
      user = await Company.findById(decoded.userId).select('-password');
      if (!user) {
        user = await TPO.findById(decoded.userId).select('-password');
        if (!user) {
          user = await SuperAdmin.findById(decoded.userId).select('-password');
          if (!user) {
            // Check User collection for legacy users
            user = await User.findById(decoded.userId).select('-password');
          }
        }
      }
    }

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }


    // Check if user status is active (block pending and rejected users)
    // Superadmin users are exempt from status checks
    let userStatus = 'pending';
    let isUserActive = false;

    if (user.constructor.modelName === 'Student') {
      isUserActive = user.isActive;
      userStatus = user.isActive ? 'active' : 'pending';
    } else if (user.constructor.modelName === 'Company') {
      isUserActive = user.status === 'active';
      userStatus = user.status;
    } else if (user.constructor.modelName === 'TPO') {
      userStatus = user.status;
      isUserActive = user.status === 'active';
    } else if (user.constructor.modelName === 'SuperAdmin') {
      userStatus = user.status;
      isUserActive = user.status === 'active';
    } else {
      // User collection
      userStatus = user.status;
      isUserActive = user.status === 'active';
    }

    console.log('Auth middleware status check:', {
      collection: user.constructor.modelName,
      role: user.role,
      userStatus: userStatus,
      isUserActive: isUserActive
    });

    if (user.role !== 'superadmin' && !isUserActive) {
      if (userStatus === 'pending') {
        return res.status(403).json({
          success: false,
          message: 'Your registration is pending approval. Please wait for admin approval.'
        });
      } else if (userStatus === 'rejected') {
        return res.status(403).json({
          success: false,
          message: 'Your registration has been rejected. Please contact support for more information.'
        });
      }
    }


    // Check if user is email verified (only for non-Google users and non-admin roles)
    if (!user.googleId && !user.isVerified && !['admin', 'superadmin'].includes(user.role)) {
      console.log('User not verified');
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before accessing this resource.'
      });
    }

    // Add role field to user object based on the collection
    if (user.constructor.modelName === 'Student') {
      user.role = 'student';
    } else if (user.constructor.modelName === 'Company') {
      user.role = 'company';
    } else if (user.constructor.modelName === 'TPO') {
      user.role = 'tpo';
    } else if (user.constructor.modelName === 'SuperAdmin') {
      user.role = 'superadmin';
    }
    // For User collection, role is already set

    // Add user to request object
    req.user = user;
    console.log('Authentication successful, proceeding...');
    next();
  } catch (error) {
    console.error('=== AUTHENTICATION ERROR ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error.'
      });
    }
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && ['admin', 'superadmin'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
};

// Middleware to check if user is superadmin
const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Super Admin role required.'
    });
  }
};

// Middleware to check if user is email verified
const isEmailVerified = (req, res, next) => {
  if (req.user && (req.user.isVerified || req.user.googleId || ['admin', 'superadmin'].includes(req.user.role))) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Please verify your email before accessing this resource.'
    });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  isSuperAdmin,
  isEmailVerified
};
