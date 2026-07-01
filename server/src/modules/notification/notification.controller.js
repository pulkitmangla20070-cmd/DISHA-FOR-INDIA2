const notificationService = require('./notification.service');
const { MESSAGES } = require('./notification.constants');
const { successResponse } = require('../../utils/response');

class NotificationController {
  /**
   * Get notifications for the current user.
   */
  getNotifications = async (req, res, next) => {
    try {
      const { type, isRead, page, limit, sortBy, order } = req.query;
      const result = await notificationService.getNotifications(req.user.id, {
        type,
        isRead,
        page,
        limit,
        sortBy,
        order,
      });

      const { notifications, total } = result;
      const limitNum = Number(limit) || 10;
      const pageNum = Number(page) || 1;

      return successResponse(res, 200, MESSAGES.NOTIFICATIONS_FETCHED, {
        notifications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Get unread notifications for the current user.
   */
  getUnreadNotifications = async (req, res, next) => {
    try {
      const { page, limit, sortBy, order } = req.query;
      const result = await notificationService.getUnreadNotifications(req.user.id, {
        page,
        limit,
        sortBy,
        order,
      });

      const { notifications, total } = result;
      const limitNum = Number(limit) || 10;
      const pageNum = Number(page) || 1;

      return successResponse(res, 200, MESSAGES.NOTIFICATIONS_FETCHED, {
        notifications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Mark a notification as read.
   */
  markAsRead = async (req, res, next) => {
    try {
      const result = await notificationService.markAsRead(req.user.id, req.params.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Mark all notifications as read for the current user.
   */
  markAllAsRead = async (req, res, next) => {
    try {
      const result = await notificationService.markAllAsRead(req.user.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Soft delete a notification.
   */
  deleteNotification = async (req, res, next) => {
    try {
      const result = await notificationService.deleteNotification(req.user.id, req.params.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new NotificationController();
