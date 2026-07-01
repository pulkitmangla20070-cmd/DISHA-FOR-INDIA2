const Notification = require('./notification.model');

class NotificationRepository {
  /**
   * Create a new notification.
   * @param {object} notificationData - Notification data.
   * @returns {Promise<Notification>} The created notification.
   */
  async create(notificationData) {
    return Notification.create(notificationData);
  }

  /**
   * Find a notification by ID.
   * @param {string} id - Notification ID.
   * @returns {Promise<Notification|null>} The notification document.
   */
  async findById(id) {
    return Notification.findById(id);
  }

  /**
   * Find notifications for a specific user.
   * @param {string} userId - User ID.
   * @param {object} options - Pagination options.
   * @returns {Promise<object>} Notifications with pagination.
   */
  async findByUser(userId, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const [notifications, total] = await Promise.all([
      Notification.find({ recipient: userId, isDeleted: false })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ recipient: userId, isDeleted: false }),
    ]);

    return { notifications, total };
  }

  /**
   * Find unread notifications for a specific user.
   * @param {string} userId - User ID.
   * @param {object} options - Pagination options.
   * @returns {Promise<object>} Unread notifications with pagination.
   */
  async findUnread(userId, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const [notifications, total] = await Promise.all([
      Notification.find({ recipient: userId, isRead: false, isDeleted: false })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ recipient: userId, isRead: false, isDeleted: false }),
    ]);

    return { notifications, total };
  }

  /**
   * Update a notification by ID.
   * @param {string} id - Notification ID.
   * @param {object} updateData - Data to update.
   * @returns {Promise<Notification|null>} The updated notification.
   */
  async update(id, updateData) {
    return Notification.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Mark a notification as read.
   * @param {string} id - Notification ID.
   * @returns {Promise<Notification|null>} The updated notification.
   */
  async markAsRead(id) {
    return Notification.findByIdAndUpdate(
      id,
      { isRead: true, readAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  /**
   * Mark all notifications as read for a user.
   * @param {string} userId - User ID.
   * @returns {Promise<object>} Update result.
   */
  async markAllAsRead(userId) {
    return Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  /**
   * Soft delete a notification.
   * @param {string} id - Notification ID.
   * @param {string} deletedBy - User ID who deleted.
   * @returns {Promise<Notification|null>} The deleted notification.
   */
  async softDelete(id, deletedBy) {
    return Notification.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }
}

module.exports = new NotificationRepository();
