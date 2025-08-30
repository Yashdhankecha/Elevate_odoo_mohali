const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient information
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Notification content
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  message: {
    type: String,
    required: true,
    trim: true
  },
  
  // Notification type for categorization
  type: {
    type: String,
    enum: ['application', 'interview', 'job', 'system', 'achievement', 'reminder', 'approval', 'admin', 'general'],
    default: 'general'
  },
  
  // Priority level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Read status
  isRead: {
    type: Boolean,
    default: false
  },
  
  // Action link (optional)
  actionLink: {
    type: String,
    trim: true
  },
  
  // Action text (optional)
  actionText: {
    type: String,
    trim: true
  },
  
  // Related data (for context)
  relatedData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Expiration date (optional)
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for expired notifications

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  return notification;
};

// Static method to get notifications for a user
notificationSchema.statics.getUserNotifications = async function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
    type = null,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const query = { recipient: userId };
  
  if (unreadOnly) {
    query.isRead = false;
  }
  
  if (type) {
    query.type = type;
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const notifications = await this.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('recipient', 'email role');

  const total = await this.countDocuments(query);
  const unreadCount = await this.countDocuments({ recipient: userId, isRead: false });

  return {
    notifications,
    total,
    unreadCount,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = async function(userId, notificationIds) {
  const result = await this.updateMany(
    {
      _id: { $in: notificationIds },
      recipient: userId
    },
    {
      $set: { isRead: true }
    }
  );
  
  return result.modifiedCount;
};

// Static method to mark all notifications as read
notificationSchema.statics.markAllAsRead = async function(userId) {
  const result = await this.updateMany(
    {
      recipient: userId,
      isRead: false
    },
    {
      $set: { isRead: true }
    }
  );
  
  return result.modifiedCount;
};

// Static method to delete old notifications
notificationSchema.statics.cleanupOldNotifications = async function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const result = await this.deleteMany({
    createdAt: { $lt: cutoffDate },
    isRead: true
  });
  
  return result.deletedCount;
};

module.exports = mongoose.model('Notification', notificationSchema);
