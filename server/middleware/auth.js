const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    
    // Find user by id
    console.log('Finding user in database...');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }


    // Check if user status is active (block pending and rejected users)
    // Superadmin users are exempt from status checks
    if (user.role !== 'superadmin' && user.status !== 'active') {
      if (user.status === 'pending') {
        return res.status(403).json({
          success: false,
          message: 'Your registration is pending approval. Please wait for admin approval.'
        });
      } else if (user.status === 'rejected') {
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
