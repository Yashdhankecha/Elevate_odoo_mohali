const express = require('express');
const multer  = require('multer');
const router  = express.Router();

const { authenticateToken: auth } = require('../middleware/auth');
const { cacheResponse } = require('../middleware/cacheMiddleware');
const {
  getTpoList,
  getJobs, getJob, createJob, saveJobDraft, submitJob, updateJob, toggleJobActive, deleteJob, getJobApplications,
  getInterviews, createInterview, updateInterview, deleteInterview, updateInterviewStatus,
  getDashboardStats, getDashboardAnalytics,
  getApplications, getApplication, updateApplicationStatus, advanceRound,
  getProfile, updateProfile,
  uploadLogo,
} = require('../controllers/companyController');

// Role guard — reusable inline middleware
const ensureCompany = (req, res, next) => {
  if (req.user?.role !== 'company')
    return res.status(403).json({ success: false, message: 'Company role required.' });
  next();
};

// Multer — memory storage (buffer passed to Cloudinary utility)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/'))
      return cb(new Error('Only image files are allowed'), false);
    cb(null, true);
  },
});

const protect = [auth, ensureCompany];

// ── TPO List ──────────────────────────────────────────────────────────────────
router.get('/tpo-list', ...protect, cacheResponse('company', 1800), getTpoList);  // 30 min

// ── Jobs ──────────────────────────────────────────────────────────────────────
router.get   ('/jobs',                    ...protect, getJobs);
router.post  ('/jobs',                    ...protect, createJob);
router.get   ('/jobs/:id',                ...protect, getJob);
router.put   ('/jobs/:id',                ...protect, updateJob);
router.delete('/jobs/:id',                ...protect, deleteJob);
router.patch ('/jobs/:id/draft',          ...protect, saveJobDraft);
router.post  ('/jobs/:id/submit',         ...protect, submitJob);
router.patch ('/jobs/:id/toggle-active',  ...protect, toggleJobActive);
router.get   ('/jobs/:id/applications',   ...protect, getJobApplications);
router.post  ('/jobs/:id/advance-round',  ...protect, advanceRound);

// ── Interviews ────────────────────────────────────────────────────────────────
router.get   ('/interviews',              ...protect, getInterviews);
router.post  ('/interviews',              ...protect, createInterview);
router.put   ('/interviews/:id',          ...protect, updateInterview);
router.delete('/interviews/:id',          ...protect, deleteInterview);
router.patch ('/interviews/:id/status',   ...protect, updateInterviewStatus);

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get('/dashboard/stats',     ...protect, cacheResponse('company-dash', 300,
  (req) => req.user._id.toString()
), getDashboardStats);   // 5 min, per-user
router.get('/dashboard/analytics', ...protect, cacheResponse('company-analytics', 300,
  (req) => req.user._id.toString()
), getDashboardAnalytics);  // 5 min, per-user
router.get('/analytics',           ...protect, cacheResponse('company-analytics', 300,
  (req) => req.user._id.toString()
), getDashboardAnalytics);  // alias, same cache

// ── Applications ──────────────────────────────────────────────────────────────
router.get  ('/applications',             ...protect, getApplications);
router.get  ('/applications/:id',         ...protect, getApplication);
router.patch('/applications/:id/status',  ...protect, updateApplicationStatus);

// ── Profile ───────────────────────────────────────────────────────────────────
router.get('/profile', ...protect, getProfile);
router.put('/profile', ...protect, updateProfile);

// ── Logo upload ───────────────────────────────────────────────────────────────
router.post('/upload-logo', ...protect, upload.single('logo'), uploadLogo);

module.exports = router;
