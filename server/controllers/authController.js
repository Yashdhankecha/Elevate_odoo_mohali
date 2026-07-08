const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Student    = require('../models/Student');
const Company    = require('../models/Company');
const TPO        = require('../models/TPO');
const SuperAdmin = require('../models/SuperAdmin');
const User       = require('../models/User');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/emailService');
const ApiError    = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ── Private helpers ──────────────────────────────────────────────────────────

const MODEL_MAP = { student: Student, company: Company, tpo: TPO, superadmin: SuperAdmin };

/** Find a user across all role collections by a query object */
const findUserAcrossCollections = async (query) => {
  const collections = [Student, Company, TPO, SuperAdmin, User];
  for (const Model of collections) {
    const user = await Model.findOne(query);
    if (user) return user;
  }
  return null;
};

const generateToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const setTokenCookie = (res, token) =>
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

const resolveRole = (user) => {
  const name = user.constructor.modelName;
  const map = { Student: 'student', Company: 'company', TPO: 'tpo', SuperAdmin: 'superadmin' };
  return map[name] || user.role || 'user';
};

const resolveActiveStatus = (user) => {
  switch (user.constructor.modelName) {
    case 'Student':   return { isActive: user.isActive,          status: user.isActive ? 'active' : 'pending' };
    case 'Company':   return { isActive: user.status === 'active', status: user.status };
    case 'TPO':       return { isActive: user.status === 'active', status: user.status };
    case 'SuperAdmin': return { isActive: user.status === 'active', status: user.status };
    default:          return { isActive: user.status === 'active', status: user.status };
  }
};

// ── Controllers ───────────────────────────────────────────────────────────────

/** GET /api/auth/colleges-with-tpos */
const getCollegesWithTpos = asyncHandler(async (req, res) => {
  const colleges = await TPO.find({ status: 'active' })
    .select('instituteName name email contactNumber');

  res.json(new ApiResponse(200, {
    colleges: colleges.map(t => ({
      instituteName: t.instituteName,
      tpoName: t.name,
      tpoEmail: t.email,
      tpoContact: t.contactNumber,
    })),
  }, 'Colleges fetched'));
});

/** GET /api/auth/search-tpos */
const searchTpos = asyncHandler(async (req, res) => {
  const { collegeName } = req.query;
  if (!collegeName || collegeName.trim().length < 2) {
    return res.json(new ApiResponse(200, { tpos: [] }, 'Query too short'));
  }

  const tpos = await TPO.find({
    status: 'active',
    instituteName: { $regex: collegeName.trim(), $options: 'i' },
  }).select('instituteName name email contactNumber');

  res.json(new ApiResponse(200, {
    tpos: tpos.map(t => ({
      instituteName: t.instituteName,
      tpoName: t.name,
      tpoEmail: t.email,
      tpoContact: t.contactNumber,
    })),
  }, 'Search complete'));
});

/** POST /api/auth/register */
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const { role, ...userData } = req.body;

  if (!role || !['student', 'company', 'tpo'].includes(role))
    throw new ApiError(400, 'Valid role is required: student, company, or tpo');

  // Duplicate email check — single parallel query across all collections
  const [s, c, t, sa, u] = await Promise.all([
    Student.findOne({ email: userData.email }),
    Company.findOne({ email: userData.email }),
    TPO.findOne({ email: userData.email }),
    SuperAdmin.findOne({ email: userData.email }),
    User.findOne({ email: userData.email }),
  ]);
  if (s || c || t || sa || u) throw new ApiError(400, 'Email already registered');

  if (role === 'student' && userData.rollNumber) {
    const exists = await Student.findOne({ rollNumber: userData.rollNumber });
    if (exists) throw new ApiError(400, 'Roll Number already registered');
  }

  if (role === 'student' && userData.collegeName) {
    const activeTPO = await TPO.findOne({
      status: 'active',
      instituteName: { $regex: `^${userData.collegeName.trim()}$`, $options: 'i' },
    });
    if (!activeTPO)
      throw new ApiError(400, 'No active TPO found for this college. Contact your administration.', [], 'NO_ACTIVE_TPO');
  }

  let user;
  if (role === 'student') {
    user = new Student({ ...userData, role: 'student', status: 'pending', isVerified: false });
  } else if (role === 'company') {
    user = new Company({ ...userData, role: 'company', status: 'pending', isVerified: false });
  } else {
    user = new TPO({ ...userData, role: 'tpo', status: 'pending', isVerified: false });
  }

  const otp = user.generateOTP();
  await user.save();

  const emailSent = await sendOTPEmail(userData.email, user.getDisplayName(), otp);
  if (!emailSent && process.env.NODE_ENV === 'production') {
    await MODEL_MAP[role]?.findByIdAndDelete(user._id);
    throw new ApiError(500, 'Failed to send verification email. Please try again.');
  }

  const message = role === 'tpo'
    ? 'Registration successful! Check your email for OTP. Your TPO account requires superadmin approval.'
    : 'Registration successful! Check your email for OTP. Your account will be activated after admin approval.';

  res.status(201).json(new ApiResponse(201, {
    userId: user._id,
    role: user.role,
    status: 'pending',
  }, message));
});

/** POST /api/auth/verify-otp */
const verifyOtp = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const { userId, otp } = req.body;
  const user = await findUserAcrossCollections({ _id: userId });
  if (!user) throw new ApiError(404, 'User not found');
  if (user.isVerified) throw new ApiError(400, 'Account is already verified');
  if (user.isOTPExpired()) throw new ApiError(400, 'OTP has expired. Please request a new one.');
  if (user.emailVerificationOTP.code !== otp) throw new ApiError(400, 'Invalid OTP');

  user.isVerified = true;
  user.emailVerificationOTP = undefined;
  await user.save();

  const role = resolveRole(user);
  const token = generateToken(user._id, role);
  setTokenCookie(res, token);

  res.json(new ApiResponse(200, {
    token,
    user: { id: user._id, email: user.email, role, isVerified: true, status: user.status },
  }, 'Email verified! Your account is pending admin approval.'));
});

/** POST /api/auth/resend-verification */
const resendVerification = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const user = await findUserAcrossCollections({ email: req.body.email });
  if (!user) throw new ApiError(404, 'User not found');
  if (user.isVerified) throw new ApiError(400, 'Account is already verified');

  const otp = user.generateOTP();
  await user.save();
  const emailSent = await sendOTPEmail(user.email, user.getDisplayName(), otp);

  if (!emailSent && process.env.NODE_ENV === 'production')
    throw new ApiError(500, 'Failed to send verification email. Please try again.');

  res.json(new ApiResponse(200, null, 'Verification email sent! Please check your inbox.'));
});

/** POST /api/auth/login */
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const { email, password } = req.body;

  // Find user — use email only, parallel search
  const [s, c, t, sa, u] = await Promise.all([
    Student.findOne({ email }),
    Company.findOne({ email }),
    TPO.findOne({ email }),
    SuperAdmin.findOne({ email }),
    User.findOne({ email }),
  ]);
  const user = s || c || t || sa || u;
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw new ApiError(401, 'Invalid email or password');

  const role = resolveRole(user);
  const { isActive, status: userStatus } = resolveActiveStatus(user);

  if (role !== 'superadmin' && !isActive) {
    if (userStatus === 'pending') {
      const msg = role === 'tpo'
        ? 'Your TPO account requires superadmin approval before activation.'
        : 'Your registration is pending approval. Please wait for admin approval.';
      throw new ApiError(403, msg);
    }
    if (userStatus === 'rejected')
      throw new ApiError(403, 'Your registration has been rejected. Please contact support.');
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id, role);
  setTokenCookie(res, token);

  let displayName = 'User';
  try { displayName = user.getDisplayName(); } catch { /* fallback */ }

  res.json(new ApiResponse(200, {
    token,
    user: {
      id: user._id,
      email: user.email,
      role,
      status: userStatus,
      isVerified: user.isVerified,
      displayName,
      profilePicture: user.profilePicture,
    },
  }, 'Login successful!'));
});

/** POST /api/auth/logout */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json(new ApiResponse(200, null, 'Logged out successfully'));
});

/** POST /api/auth/forgot-password */
const forgotPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const user = await findUserAcrossCollections({ email: req.body.email });
  // Always 200 — don't reveal whether email exists
  if (!user) return res.json(new ApiResponse(200, null, 'If that email exists, a reset link has been sent.'));

  const resetToken = user.generatePasswordResetToken();
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&userId=${user._id}`;
  await sendPasswordResetEmail(user.email, user.getDisplayName(), resetUrl);

  res.json(new ApiResponse(200, null, 'If that email exists, a reset link has been sent.'));
});

/** POST /api/auth/reset-password */
const resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const { userId, token, newPassword } = req.body;
  const user = await findUserAcrossCollections({ _id: userId });
  if (!user) throw new ApiError(404, 'User not found');

  if (!user.verifyPasswordResetToken(token))
    throw new ApiError(400, 'Invalid or expired reset token');

  user.password = newPassword;
  user.passwordResetToken = undefined;
  await user.save();

  res.json(new ApiResponse(200, null, 'Password reset successful! Please log in.'));
});

/** GET /api/auth/me */
const getMe = asyncHandler(async (req, res) => {
  const role = resolveRole(req.user);
  const { status } = resolveActiveStatus(req.user);
  let displayName = 'User';
  try { displayName = req.user.getDisplayName(); } catch { /* fallback */ }

  res.json(new ApiResponse(200, {
    user: {
      id: req.user._id,
      email: req.user.email,
      role,
      status,
      isVerified: req.user.isVerified,
      displayName,
      profilePicture: req.user.profilePicture,
    },
  }, 'Profile fetched'));
});

module.exports = {
  getCollegesWithTpos,
  searchTpos,
  register,
  verifyOtp,
  resendVerification,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
};
