const ValidationError = require('../../utils/errors/ValidationError');
const {
  NOTIFICATION_TYPES,
  PRIORITY,
  CHANNEL,
  STATUS,
  VALIDATION,
} = require('./notification.constants');

const validateCreateNotification = (req, res, next) => {
  const errors = [];
  const {
    recipientId,
    senderId,
    title,
    message,
    type,
    category,
    priority,
    channel,
    relatedEntityType,
    relatedEntityId,
    scheduledFor,
    expiresAt,
    metadata,
  } = req.body;

  if (recipientId !== undefined) {
    if (typeof recipientId !== 'string' || recipientId.trim() === '') {
      errors.push({ field: 'recipientId', message: 'Recipient ID is required' });
    }
  }

  if (senderId !== undefined && senderId !== null) {
    if (typeof senderId !== 'string' || senderId.trim() === '') {
      errors.push({ field: 'senderId', message: 'Sender ID must be a valid string' });
    }
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      errors.push({ field: 'title', message: 'Title is required' });
    } else if (title.trim().length > VALIDATION.TITLE_MAX_LENGTH) {
      errors.push({
        field: 'title',
        message: `Title cannot exceed ${VALIDATION.TITLE_MAX_LENGTH} characters`,
      });
    }
  }

  if (message !== undefined) {
    if (typeof message !== 'string' || message.trim() === '') {
      errors.push({ field: 'message', message: 'Message is required' });
    } else if (message.trim().length > VALIDATION.MESSAGE_MAX_LENGTH) {
      errors.push({
        field: 'message',
        message: `Message cannot exceed ${VALIDATION.MESSAGE_MAX_LENGTH} characters`,
      });
    }
  }

  if (type !== undefined) {
    if (!Object.values(NOTIFICATION_TYPES).includes(type)) {
      errors.push({ field: 'type', message: 'Invalid notification type' });
    }
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim() === '') {
      errors.push({ field: 'category', message: 'Category must be a non-empty string' });
    }
  }

  if (priority !== undefined) {
    if (!Object.values(PRIORITY).includes(priority)) {
      errors.push({ field: 'priority', message: 'Invalid priority level' });
    }
  }

  if (channel !== undefined) {
    if (!Object.values(CHANNEL).includes(channel)) {
      errors.push({ field: 'channel', message: 'Invalid channel' });
    }
  }

  if (relatedEntityType !== undefined && relatedEntityType !== null) {
    if (typeof relatedEntityType !== 'string' || relatedEntityType.trim() === '') {
      errors.push({ field: 'relatedEntityType', message: 'Related entity type must be a valid string' });
    }
  }

  if (relatedEntityId !== undefined && relatedEntityId !== null) {
    if (typeof relatedEntityId !== 'string' || relatedEntityId.trim() === '') {
      errors.push({ field: 'relatedEntityId', message: 'Related entity ID must be a valid string' });
    }
  }

  if (scheduledFor !== undefined && scheduledFor !== null) {
    const date = new Date(scheduledFor);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'scheduledFor', message: 'Scheduled for must be a valid date' });
    }
  }

  if (expiresAt !== undefined && expiresAt !== null) {
    const date = new Date(expiresAt);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'expiresAt', message: 'Expires at must be a valid date' });
    }
  }

  if (metadata !== undefined && metadata !== null && typeof metadata !== 'object') {
    errors.push({ field: 'metadata', message: 'Metadata must be an object' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Notification creation validation failed', errors));
  }

  return next();
};

const validateGetNotifications = (req, res, next) => {
  const errors = [];
  const { page, limit, type, isRead } = req.query;

  if (page !== undefined) {
    const pageNum = Number(page);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100' });
    }
  }

  if (type !== undefined && type !== '') {
    if (!Object.values(NOTIFICATION_TYPES).includes(type)) {
      errors.push({ field: 'type', message: 'Invalid notification type filter' });
    }
  }

  if (isRead !== undefined && isRead !== '') {
    if (isRead !== 'true' && isRead !== 'false') {
      errors.push({ field: 'isRead', message: 'isRead must be true or false' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Notification query validation failed', errors));
  }

  return next();
};

const validateMarkAsRead = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(new ValidationError('Notification ID is required', [
      { field: 'id', message: 'Notification ID is required' },
    ]));
  }

  return next();
};

const validateMarkAllAsRead = (req, res, next) => {
  return next();
};

const validateDeleteNotification = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(new ValidationError('Notification ID is required', [
      { field: 'id', message: 'Notification ID is required' },
    ]));
  }

  return next();
};

const validateNotificationPreferences = (req, res, next) => {
  return next();
};

module.exports = {
  validateCreateNotification,
  validateGetNotifications,
  validateMarkAsRead,
  validateMarkAllAsRead,
  validateDeleteNotification,
  validateNotificationPreferences,
};
