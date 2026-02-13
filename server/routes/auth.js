const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const TPO = require('../models/TPO');
const SuperAdmin = require('../models/SuperAdmin');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/emailService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper function to set JWT cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// Validation rules for different roles
const getValidationRules = (role) => {
  const baseRules = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      })
      .withMessage('Password confirmation does not match password')
  ];

  switch (role) {
    case 'student':
      return [
        ...baseRules,
        body('name')
          .isLength({ min: 2, max: 50 })
          .withMessage('Name must be between 2 and 50 characters'),
        body('rollNumber')
          .notEmpty()
          .withMessage('Roll Number is required'),
        body('branch')
          .notEmpty()
          .withMessage('Branch is required'),
        body('graduationYear')
          .isInt({ min: new Date().getFullYear(), max: new Date().getFullYear() + 10 })
          .withMessage('Graduation Year must be between current year and 10 years ahead'),
        body('collegeName')
          .notEmpty()
          .withMessage('College Name is required')
      ];

    case 'company':
      return [
        ...baseRules,
        body('companyName')
          .isLength({ min: 2, max: 100 })
          .withMessage('Company Name must be between 2 and 100 characters'),
        body('contactNumber')
          .matches(/^[+]?[\d\s\-\(\)]+$/)
          .withMessage('Please enter a valid contact number')
      ];

    case 'tpo':
      return [
        ...baseRules,
        body('name')
          .isLength({ min: 2, max: 50 })
          .withMessage('Name must be between 2 and 50 characters'),
        body('instituteName')
          .notEmpty()
          .withMessage('Institute Name is required'),
        body('contactNumber')
          .matches(/^[+]?[\d\s\-\(\)]+$/)
          .withMessage('Please enter a valid contact number')
      ];

    default:
      return baseRules;
  }
};

// @route   GET /api/auth/colleges-with-tpos
// @desc    Get list of colleges that have registered and active TPOs
// @access  Public
router.get('/colleges-with-tpos', async (req, res) => {
  try {
    const colleges = await TPO.find({
      status: 'active'
    }).select('instituteName name email contactNumber');

    const collegeList = colleges.map(tpo => ({
      instituteName: tpo.instituteName,
      tpoName: tpo.name,
      tpoEmail: tpo.email,
      tpoContact: tpo.contactNumber
    }));

    res.json({
      success: true,
      colleges: collegeList
    });
  } catch (error) {
    console.error('Error fetching colleges with TPOs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching colleges with TPOs'
    });
  }
});

// @route   GET /api/auth/search-tpos
// @desc    Search TPOs by college name (for autocomplete)
// @access  Public
router.get('/search-tpos', async (req, res) => {
  try {
    const { collegeName } = req.query;

    if (!collegeName || collegeName.trim().length < 2) {
      return res.json({
        success: true,
        tpos: []
      });
    }

    const tpos = await TPO.find({
      status: 'active',
      'instituteName': {
        $regex: collegeName.trim(),
        $options: 'i'
      }
    }).select('instituteName name email contactNumber');

    const tpoList = tpos.map(tpo => ({
      instituteName: tpo.instituteName,
      tpoName: tpo.name,
      tpoEmail: tpo.email,
      tpoContact: tpo.contactNumber
    }));

    res.json({
      success: true,
      tpos: tpoList
    });
  } catch (error) {
    console.error('Error searching TPOs:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching TPOs'
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user with role-based fields
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { role, ...userData } = req.body;

    console.log('📝 Registration attempt:', { role, email: userData.email });

    // Validate role
    if (!role || !['student', 'company', 'tpo'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role is required (student, company, or tpo)'
      });
    }

    // Apply role-specific validation
    const validationRules = getValidationRules(role);
    await Promise.all(validationRules.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if user already exists in any collection
    let existingUser = await Student.findOne({ email: userData.email });
    if (!existingUser) {
      existingUser = await Company.findOne({ email: userData.email });
    }
    if (!existingUser) {
      existingUser = await TPO.findOne({ email: userData.email });
    }
    if (!existingUser) {
      existingUser = await SuperAdmin.findOne({ email: userData.email });
    }
    if (!existingUser) {
      existingUser = await User.findOne({ email: userData.email });
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check for unique constraints based on role
    if (role === 'student' && userData.rollNumber) {
      const existingStudent = await Student.findOne({
        rollNumber: userData.rollNumber
      });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Roll Number already registered'
        });
      }
    }

    // For student registration, validate that the college has an active TPO
    if (role === 'student' && userData.collegeName) {
      const activeTPO = await TPO.findOne({
        status: 'active',
        instituteName: {
          $regex: `^${userData.collegeName.trim()}$`,
          $options: 'i'
        }
      });

      if (!activeTPO) {
        return res.status(400).json({
          success: false,
          message: 'No active TPO found for this college. Please contact your college administration to register a TPO first.',
          code: 'NO_ACTIVE_TPO'
        });
      }
    }

    console.log('👤 Creating user with role:', role, 'email:', userData.email);

    // Create new user in appropriate collection based on role
    let user;
    switch (role) {
      case 'student':
        user = new Student({
          email: userData.email,
          password: userData.password,
          role: 'student',
          status: 'pending',
          isVerified: false,
          name: userData.name,
          rollNumber: userData.rollNumber,
          branch: userData.branch,
          graduationYear: userData.graduationYear,
          collegeName: userData.collegeName
        });
        break;

      case 'company':
        user = new Company({
          email: userData.email,
          password: userData.password,
          role: 'company',
          status: 'pending',
          isVerified: false,
          companyName: userData.companyName,
          contactNumber: userData.contactNumber
        });
        break;

      case 'tpo':
        user = new TPO({
          email: userData.email,
          password: userData.password,
          role: 'tpo',
          status: 'pending',
          isVerified: false,
          name: userData.name,
          instituteName: userData.instituteName,
          contactNumber: userData.contactNumber
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid role'
        });
    }

    // Generate OTP and send verification email
    const otp = user.generateOTP();
    console.log('🔐 Generated OTP for user:', user._id);

    // Save user first
    await user.save();
    console.log('✅ User saved successfully:', user._id);

    // Send OTP email
    console.log('📧 Attempting to send OTP email...');
    const emailSent = await sendOTPEmail(userData.email, user.getDisplayName(), otp);

    if (!emailSent) {
      console.log('❌ Email failed, but continuing in development mode');
      // In development mode, we continue even if email fails
      if (process.env.NODE_ENV === 'production') {
        // If email fails in production, delete the user
        // If email fails in production, delete the user
        if (role === 'student') await Student.findByIdAndDelete(user._id);
        else if (role === 'company') await Company.findByIdAndDelete(user._id);
        else if (role === 'tpo') await TPO.findByIdAndDelete(user._id);

        return res.status(500).json({
          success: false,
          message: 'Failed to send verification email. Please try again.'
        });
      }
    }

    console.log('🎉 Registration completed successfully for user:', user._id);

    // For TPOs, always require superadmin approval
    let message = 'Registration successful! Please check your email for verification code.';
    if (userData.role === 'tpo') {
      message += ' Your TPO account requires superadmin approval before activation.';
    } else {
      message += ' Your account will be activated after admin approval.';
    }

    res.status(201).json({
      success: true,
      message: message,
      userId: user._id,
      role: user.role,
      status: 'pending'
    });

  } catch (error) {
    console.error('❌ Registration error:', error);

    // Provide more specific error messages
    let errorMessage = 'Server error. Please try again.';

    if (error.name === 'ValidationError') {
      errorMessage = 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ');
    } else if (error.name === 'MongoError' && error.code === 11000) {
      errorMessage = 'Duplicate field value. Please check your input.';
    } else if (error.name === 'CastError') {
      errorMessage = 'Invalid data format. Please check your input.';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and activate account
// @access  Public
router.post('/verify-otp', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { userId, otp } = req.body;

    // Find user
    // Find user in all collections
    let user = await Student.findById(userId);
    if (!user) {
      user = await Company.findById(userId);
    }
    if (!user) {
      user = await TPO.findById(userId);
    }
    if (!user) {
      user = await SuperAdmin.findById(userId);
    }
    // Legacy fallback
    if (!user) {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Account is already verified'
      });
    }

    // Check if OTP is expired
    if (user.isOTPExpired()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    if (user.emailVerificationOTP.code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Activate account
    user.isVerified = true;
    user.emailVerificationOTP = undefined;
    await user.save();

    // Generate token for verified user
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    // Note: Status remains 'pending' until admin approval (except for superadmin)
    // Only email verification is completed here

    res.json({
      success: true,
      message: 'Email verified successfully! Your account is pending admin approval. You will be notified once approved.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
        displayName: user.getDisplayName()
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   POST /api/auth/resend-verification
// @desc    Resend verification OTP
// @access  Public
router.post('/resend-verification', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Find user
    // Find user in all collections
    let user = await Student.findOne({ email });
    if (!user) {
      user = await Company.findOne({ email });
    }
    if (!user) {
      user = await TPO.findOne({ email });
    }
    if (!user) {
      user = await SuperAdmin.findOne({ email });
    }
    if (!user) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Account is already verified'
      });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(user.email, user.getDisplayName(), otp);

    if (!emailSent) {
      console.log('❌ Email failed, but continuing in development mode');
      // In development mode, we continue even if email fails
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({
          success: false,
          message: 'Failed to send verification email. Please try again.'
        });
      }
    }

    res.json({
      success: true,
      message: 'Verification email sent successfully! Please check your inbox.'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    console.log('Login attempt for email:', email);

    // Find user in appropriate collection
    let user = null;

    // Try to find user in each collection (same order as auth middleware)
    user = await Student.findOne({ email });
    if (!user) {
      user = await Company.findOne({ email });
      if (!user) {
        user = await TPO.findOne({ email });
        if (!user) {
          user = await SuperAdmin.findOne({ email });
          if (!user) {
            // Check User collection for legacy users
            user = await User.findOne({ email });
          }
        }
      }
    }

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Add role field to user object based on the collection (same as auth middleware)
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

    console.log('User found:', {
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
      isVerified: user.isVerified,
      collection: user.constructor.modelName
    });

    // Check password
    console.log('Comparing password...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user status is active (block pending and rejected users)
    // Superadmin users are exempt from status checks
    let userStatus = 'pending';
    let isUserActive = false;

    if (user.constructor.modelName === 'Student') {
      // For students, check if they are active and verified
      isUserActive = user.isActive;
      // If student has verificationStatus (schema update), check that too
      if (user.verificationStatus && user.verificationStatus !== 'verified') {
        userStatus = user.verificationStatus;
        // If pending/rejected, marks as inactive for login purposes unless we want to allow login but restricted access
        // For now, let's stick to the existing behavior but ensure status is tracked
      } else {
        userStatus = user.isActive ? 'active' : 'pending';
      }
    } else if (user.constructor.modelName === 'Company') {
      // Company uses 'status' field ('pending', 'active', 'rejected')
      userStatus = user.status;
      isUserActive = user.status === 'active';
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

    console.log('User status check:', {
      collection: user.constructor.modelName,
      role: user.role,
      userStatus: userStatus,
      isUserActive: isUserActive
    });

    if (user.role !== 'superadmin' && !isUserActive) {
      if (userStatus === 'pending') {
        let approvalMessage = 'Your registration is pending approval. Please wait for admin approval before logging in.';
        if (user.role === 'tpo') {
          approvalMessage = 'Your TPO account requires superadmin approval before activation. Please wait for approval.';
        }
        return res.status(403).json({
          success: false,
          message: approvalMessage,
          requiresApproval: true,
          userId: user._id
        });
      } else if (userStatus === 'rejected') {
        return res.status(403).json({
          success: false,
          message: 'Your registration has been rejected. Please contact support for more information.',
          registrationRejected: true,
          userId: user._id
        });
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token and set cookie
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    // Get display name safely
    let displayName = 'User';
    try {
      displayName = user.getDisplayName();
      console.log('Display name generated:', displayName);
    } catch (error) {
      console.error('Error getting display name:', error);
    }

    console.log('Login successful for user:', email);

    // Use the already calculated userStatus from above

    console.log('Returning user data:', {
      collection: user.constructor.modelName,
      role: user.role,
      status: userStatus,
      isVerified: user.isVerified
    });

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: userStatus,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus || null,
        displayName: displayName,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Find user
    // Find user in all collections
    let user = await Student.findOne({ email });
    if (!user) {
      user = await Company.findOne({ email });
    }
    if (!user) {
      user = await TPO.findOne({ email });
    }
    if (!user) {
      user = await SuperAdmin.findOne({ email });
    }
    // Legacy support
    if (!user) {
      user = await User.findOne({ email });
    }

    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, user.getDisplayName(), resetToken);

    if (!emailSent) {
      // In development mode, we continue even if email fails
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({
          success: false,
          message: 'Failed to send password reset email. Please try again.'
        });
      }
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token, password } = req.body;

    // Find user with valid reset token
    // Find user with valid reset token in all collections
    let user = await Student.findOne({
      'passwordResetToken.token': token,
      'passwordResetToken.expiresAt': { $gt: new Date() }
    });

    if (!user) {
      user = await Company.findOne({
        'passwordResetToken.token': token,
        'passwordResetToken.expiresAt': { $gt: new Date() }
      });
    }

    if (!user) {
      user = await TPO.findOne({
        'passwordResetToken.token': token,
        'passwordResetToken.expiresAt': { $gt: new Date() }
      });
    }

    if (!user) {
      user = await SuperAdmin.findOne({
        'passwordResetToken.token': token,
        'passwordResetToken.expiresAt': { $gt: new Date() }
      });
    }

    if (!user) {
      user = await User.findOne({
        'passwordResetToken.token': token,
        'passwordResetToken.expiresAt': { $gt: new Date() }
      });
    }


    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, (req, res) => {
  // Get the correct status based on the collection
  let userStatus = 'pending';
  if (req.user.constructor.modelName === 'Student') {
    userStatus = req.user.isActive ? 'active' : 'pending';
  } else if (req.user.constructor.modelName === 'Company') {
    userStatus = req.user.isActive ? 'active' : 'pending';
  } else if (req.user.constructor.modelName === 'TPO') {
    userStatus = req.user.status;
  } else if (req.user.constructor.modelName === 'SuperAdmin') {
    userStatus = req.user.status;
  } else {
    // User collection
    userStatus = req.user.status;
  }

  res.json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      status: userStatus,
      isVerified: req.user.isVerified,
      verificationStatus: req.user.verificationStatus || null,
      displayName: req.user.getDisplayName(),
      profilePicture: req.user.profilePicture,
      roleData: req.user.getRoleData()
    }
  });
});

module.exports = router;
