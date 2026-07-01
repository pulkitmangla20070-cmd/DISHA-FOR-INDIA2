const notificationRepository = require('./notification.repository');
const { generateNotificationId, notificationFormatter } = require('./notification.utils');
const { NOTIFICATION_TYPES, PRIORITY, CHANNEL, STATUS, MESSAGES, DEFAULTS } = require('./notification.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');

class NotificationService {
  /**
   * Create a new notification.
   * Business logic for Module 9.2.
   * @param {object} notificationData - Notification data.
   * @returns {Promise<object>} Created notification.
   */
  async createNotification(notificationData) {
    const notification = await notificationRepository.create({
      ...notificationData,
      notificationId: generateNotificationId(),
      status: STATUS.PENDING,
      priority: notificationData.priority || DEFAULTS.PRIORITY,
      channel: notificationData.channel || DEFAULTS.CHANNEL,
      isRead: DEFAULTS.IS_READ,
    });

    return {
      notification: notificationFormatter(notification),
      message: MESSAGES.NOTIFICATION_CREATED,
    };
  }

  /**
   * Get notifications for a user with pagination.
   * @param {string} userId - User ID.
   * @param {object} query - Query parameters.
   * @returns {Promise<object>} Notifications list.
   */
  async getNotifications(userId, query = {}) {
    const { type, isRead, page = DEFAULTS.PAGINATION.PAGE, limit = DEFAULTS.PAGINATION.LIMIT } = query;

    const filter = { recipient: userId, isDeleted: false };

    if (type) {
      filter.type = type;
    }

    if (isRead !== undefined && isRead !== '') {
      filter.isRead = isRead === 'true';
    }

    const { notifications, total } = await notificationRepository.findByUser(userId, {
      page: Number(page),
      limit: Number(limit),
      sortBy: query.sortBy || DEFAULTS.PAGINATION.SORT_BY,
      order: query.order || DEFAULTS.PAGINATION.ORDER,
    });

    return {
      notifications: notifications.map(notificationFormatter),
      total,
      message: MESSAGES.NOTIFICATIONS_FETCHED,
    };
  }

  /**
   * Get unread notifications for a user.
   * @param {string} userId - User ID.
   * @param {object} query - Query parameters.
   * @returns {Promise<object>} Unread notifications list.
   */
  async getUnreadNotifications(userId, query = {}) {
    const { page = DEFAULTS.PAGINATION.PAGE, limit = DEFAULTS.PAGINATION.LIMIT } = query;

    const { notifications, total } = await notificationRepository.findUnread(userId, {
      page: Number(page),
      limit: Number(limit),
      sortBy: query.sortBy || DEFAULTS.PAGINATION.SORT_BY,
      order: query.order || DEFAULTS.PAGINATION.ORDER,
    });

    return {
      notifications: notifications.map(notificationFormatter),
      total,
      message: MESSAGES.NOTIFICATIONS_FETCHED,
    };
  }

  /**
   * Mark a notification as read.
   * @param {string} userId - User ID.
   * @param {string} notificationId - Notification ID.
   * @returns {Promise<object>} Updated notification.
   */
  async markAsRead(userId, notificationId) {
    const notification = await notificationRepository.findById(notificationId);

    if (!notification || notification.recipient.toString() !== userId.toString()) {
      throw new NotFoundError(MESSAGES.NOTIFICATION_NOT_FOUND);
    }

    if (notification.isRead) {
      return {
        notification: notificationFormatter(notification),
        message: MESSAGES.NOTIFICATION_UPDATED,
      };
    }

    const updated = await notificationRepository.markAsRead(notificationId);

    return {
      notification: notificationFormatter(updated),
      message: MESSAGES.NOTIFICATION_UPDATED,
    };
  }

  /**
   * Mark all notifications as read for a user.
   * @param {string} userId - User ID.
   * @returns {Promise<object>} Result object.
   */
  async markAllAsRead(userId) {
    const result = await notificationRepository.markAllAsRead(userId);

    return {
      modifiedCount: result.modifiedCount,
      message: MESSAGES.ALL_NOTIFICATIONS_READ,
    };
  }

  /**
   * Soft delete a notification.
   * @param {string} userId - User ID.
   * @param {string} notificationId - Notification ID.
   * @returns {Promise<object>} Deleted notification confirmation.
   */
  async deleteNotification(userId, notificationId) {
    const notification = await notificationRepository.findById(notificationId);

    if (!notification || notification.recipient.toString() !== userId.toString()) {
      throw new NotFoundError(MESSAGES.NOTIFICATION_NOT_FOUND);
    }

    await notificationRepository.softDelete(notificationId, userId);

    return {
      message: MESSAGES.NOTIFICATION_DELETED,
    };
  }
}

module.exports = new NotificationService();
