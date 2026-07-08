const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getNotifications, markRead, markAllRead, deleteNotification, getUnreadCount } = require('../controllers/notificationController');

const router = express.Router();

const auth = [authenticateToken];

// Note: unread-count MUST be before /:id to avoid Express matching "unread-count" as an id
router.get('/unread-count',   ...auth, getUnreadCount);
router.get('/',               ...auth, getNotifications);
router.put('/mark-read',      ...auth, markRead);
router.put('/mark-all-read',  ...auth, markAllRead);
router.delete('/:id',         ...auth, deleteNotification);

module.exports = router;
