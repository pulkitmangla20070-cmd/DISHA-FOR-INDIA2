const NOTIFICATION_TYPES = {
  APPLICATION: 'application',
  PROGRAM: 'program',
  ATTENDANCE: 'attendance',
  CERTIFICATE: 'certificate',
  REWARD: 'reward',
  LEADERBOARD: 'leaderboard',
  SYSTEM: 'system',
  ANNOUNCEMENT: 'announcement',
};

const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

const CHANNEL = {
  IN_APP: 'in-app',
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
};

const STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
  SCHEDULED: 'scheduled',
};

const MESSAGES = {
  NOTIFICATION_CREATED: 'Notification created successfully',
  NOTIFICATIONS_FETCHED: 'Notifications retrieved successfully',
  NOTIFICATION_FETCHED: 'Notification retrieved successfully',
  NOTIFICATION_UPDATED: 'Notification updated successfully',
  NOTIFICATION_DELETED: 'Notification deleted successfully',
  ALL_NOTIFICATIONS_READ: 'All notifications marked as read',
  NO_NOTIFICATIONS: 'No notifications found',
  NOTIFICATION_NOT_FOUND: 'Notification not found',
};

const DEFAULTS = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
    SORT_BY: 'createdAt',
    ORDER: 'desc',
  },
  PRIORITY: PRIORITY.MEDIUM,
  CHANNEL: CHANNEL.IN_APP,
  IS_READ: false,
};

const VALIDATION = {
  TITLE_MAX_LENGTH: 255,
  MESSAGE_MAX_LENGTH: 1000,
  METADATA_MAX_DEPTH: 3,
};

module.exports = {
  NOTIFICATION_TYPES,
  PRIORITY,
  CHANNEL,
  STATUS,
  MESSAGES,
  DEFAULTS,
  VALIDATION,
};
