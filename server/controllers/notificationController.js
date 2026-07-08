const Notification = require('../models/Notification');
const ApiError     = require('../utils/ApiError');
const ApiResponse  = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ─── 1. Get Notifications ────────────────────────────────────────────────────

const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false, type = null } = req.query;
  const result = await Notification.getUserNotifications(req.user._id, {
    page: parseInt(page), limit: parseInt(limit),
    unreadOnly: unreadOnly === 'true',
    type: type || null,
  });
  res.json(new ApiResponse(200, result, 'Notifications fetched'));
});

// ─── 2. Mark Selected as Read ────────────────────────────────────────────────

const markRead = asyncHandler(async (req, res) => {
  const { notificationIds } = req.body;
  if (!Array.isArray(notificationIds) || !notificationIds.length)
    throw new ApiError(400, 'notificationIds array is required');
  const modifiedCount = await Notification.markAsRead(req.user._id, notificationIds);
  res.json(new ApiResponse(200, { modifiedCount }, `${modifiedCount} notification(s) marked as read`));
});

// ─── 3. Mark All as Read ─────────────────────────────────────────────────────

const markAllRead = asyncHandler(async (req, res) => {
  const modifiedCount = await Notification.markAllAsRead(req.user._id);
  res.json(new ApiResponse(200, { modifiedCount }, `${modifiedCount} notification(s) marked as read`));
});

// ─── 4. Delete Notification ───────────────────────────────────────────────────

const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.json(new ApiResponse(200, null, 'Notification deleted successfully'));
});

// ─── 5. Unread Count ─────────────────────────────────────────────────────────

const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
  res.json(new ApiResponse(200, { unreadCount }, 'Unread count fetched'));
});

module.exports = { getNotifications, markRead, markAllRead, deleteNotification, getUnreadCount };
