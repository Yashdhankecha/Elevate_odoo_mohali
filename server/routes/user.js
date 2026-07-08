const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

const {
  getStudents, getStudent,
  getApplications, getStudentStats, getSkillProgress, getPracticeHistory,
  getAchievements, getExperience, getAlerts, getPerformanceAnalytics,
  updateStudentProfile, getProfile, updateProfile, changePassword, deleteAccount,
} = require('../controllers/userController');

const router = express.Router();

const auth = [authenticateToken];

// ── Health check ──────────────────────────────────────────────────────────────
router.get('/test', (req, res) => res.json({ message: 'User routes are working!' }));

// ── Students (TPO / Company view) ─────────────────────────────────────────────
router.get('/students',     ...auth, getStudents);
router.get('/students/:id', ...auth, getStudent);

// ── Student-specific data ─────────────────────────────────────────────────────
router.get('/applications',          ...auth, getApplications);
router.get('/student-stats',         ...auth, getStudentStats);
router.get('/skill-progress',        ...auth, getSkillProgress);
router.get('/practice-history',      ...auth, getPracticeHistory);
router.get('/achievements',          ...auth, getAchievements);
router.get('/experience',            ...auth, getExperience);
router.get('/alerts',                ...auth, getAlerts);
router.get('/performance-analytics', ...auth, getPerformanceAnalytics);

// ── Profile (all roles) ───────────────────────────────────────────────────────
router.get('/profile',  ...auth, getProfile);
router.put('/profile',  ...auth, updateProfile);

// ── Student profile update (legacy endpoint) ──────────────────────────────────
router.put('/student-profile', ...auth, [
  body('name').optional().isLength({ min: 2, max: 50 }),
  body('phoneNumber').optional(),
  body('skills').optional().isArray(),
  body('workMode').optional().isIn(['On-site', 'Remote', 'Hybrid', 'Any']),
], updateStudentProfile);

// ── Account management ────────────────────────────────────────────────────────
router.put('/change-password',  ...auth, changePassword);
router.delete('/delete-account',...auth, deleteAccount);

module.exports = router;
