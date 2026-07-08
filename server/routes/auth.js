const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getCollegesWithTpos, searchTpos, register, verifyOtp,
  resendVerification, login, logout, forgotPassword, resetPassword, getMe,
} = require('../controllers/authController');

// ── Rate limiters ─────────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many password reset requests. Please try again after 1 hour.' },
});

// ── Validation rules ──────────────────────────────────────────────────────────
const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
];

const resetPasswordRules = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('token').notEmpty().withMessage('Token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const verifyOtpRules = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

const resendVerificationRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
];

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/colleges-with-tpos',    getCollegesWithTpos);
router.get('/search-tpos',           searchTpos);
router.post('/register',             register);
router.post('/verify-otp',           verifyOtpRules,           validate, verifyOtp);
router.post('/resend-verification',  resendVerificationRules,  validate, resendVerification);
router.post('/login',                loginLimiter, loginRules, validate, login);
router.post('/logout',               logout);
router.post('/forgot-password',      forgotPasswordLimiter, forgotPasswordRules, validate, forgotPassword);
router.post('/reset-password',       resetPasswordRules, validate, resetPassword);

// ── Protected ─────────────────────────────────────────────────────────────────
router.get('/me', authenticateToken, getMe);

module.exports = router;
