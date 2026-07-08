const express  = require('express');
const multer   = require('multer');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

const {
  getDashboard,
  getJobs, applyForJob,
  getApplications, getApplication, updateApplication,
  getPracticeSessions, getSkills, createPracticeSession,
  getNotifications, markNotificationsRead,
  getAiCoach, createAiCoachSession,
  getInternshipOffers, applyForInternship, getInternshipApplications,
  getProfile, updateProfile, getApprovalStatus, uploadPicture,
} = require('../controllers/studentController');

const router = express.Router();

// ── Auth guard ────────────────────────────────────────────────────────────────
const ensureStudent = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  next();
};
const auth = [authenticateToken, ensureStudent];

// ── File upload middlewares ───────────────────────────────────────────────────
const memoryUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const resumeUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get('/dashboard', ...auth, getDashboard);

// ── Jobs ──────────────────────────────────────────────────────────────────────
router.get('/jobs',                  ...auth, getJobs);
router.post('/jobs/:jobId/apply',    ...auth, resumeUpload.single('resume'), applyForJob);

// ── Applications ──────────────────────────────────────────────────────────────
router.get('/applications',                      ...auth, getApplications);
router.get('/applications/:applicationId',       ...auth, getApplication);
router.put('/applications/:applicationId',       ...auth, updateApplication);

// ── Practice & Skills ─────────────────────────────────────────────────────────
router.get('/practice-sessions', ...auth, getPracticeSessions);
router.get('/skills',            ...auth, getSkills);
router.post('/practice-session', ...auth, [
  body('topic').notEmpty(),
  body('category').isIn(['data-structures', 'algorithms', 'system-design', 'database', 'web-development', 'machine-learning', 'soft-skills']),
  body('difficulty').isIn(['easy', 'medium', 'hard']),
  body('score').isNumeric(),
  body('totalQuestions').isNumeric(),
  body('correctAnswers').isNumeric(),
  body('timeSpent').isNumeric(),
], createPracticeSession);

// ── Notifications ─────────────────────────────────────────────────────────────
router.get('/notifications',            ...auth, getNotifications);
router.put('/notifications/mark-read',  ...auth, markNotificationsRead);

// ── AI Coach ──────────────────────────────────────────────────────────────────
router.get('/ai-coach',         ...auth, getAiCoach);
router.post('/ai-coach/session',...auth, createAiCoachSession);

// ── Internships ───────────────────────────────────────────────────────────────
router.get('/internship-offers',                           ...auth, getInternshipOffers);
router.post('/internship-offers/:internshipId/apply',      ...auth, applyForInternship);
router.get('/internship-applications',                     ...auth, getInternshipApplications);

// ── Profile ───────────────────────────────────────────────────────────────────
router.get('/profile',                  ...auth, getProfile);
router.put('/profile',                  ...auth, updateProfile);
router.get('/profile/approval-status',  ...auth, getApprovalStatus);
router.post('/upload-picture',          ...auth, memoryUpload.single('picture'), uploadPicture);

module.exports = router;
