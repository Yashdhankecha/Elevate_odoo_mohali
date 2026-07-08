const express = require('express');
const router  = express.Router();
const { getPublicStats } = require('../controllers/statsController');
const { cacheResponse } = require('../middleware/cacheMiddleware');

// ── Public (no auth) ──────────────────────────────────────────────────────────
router.get('/public', cacheResponse('stats', 600), getPublicStats); // Cache 10 min

module.exports = router;
