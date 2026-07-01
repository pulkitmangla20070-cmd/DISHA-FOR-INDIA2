const express = require('express');
const notificationController = require('./notification.controller');
const {
  validateGetNotifications,
  validateMarkAsRead,
  validateMarkAllAsRead,
  validateDeleteNotification,
  validateNotificationPreferences,
} = require('./notification.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

// ─── Notification Routes ─────────────────────────────────────────
router.get('/', authenticate, validateGetNotifications, notificationController.getNotifications);

router.get('/unread', authenticate, validateGetNotifications, notificationController.getUnreadNotifications);

router.patch('/:id/read', authenticate, validateMarkAsRead, notificationController.markAsRead);

router.patch('/read-all', authenticate, validateMarkAllAsRead, notificationController.markAllAsRead);

router.delete('/:id', authenticate, validateDeleteNotification, notificationController.deleteNotification);

// ─── Skeleton routes for future modules ───────────────────────────
router.get('/preferences', authenticate, validateNotificationPreferences, (req, res) => {
  return res.status(200).json({ success: true, message: 'Notification preferences endpoint — skeleton', data: {} });
});

router.patch('/preferences', authenticate, validateNotificationPreferences, (req, res) => {
  return res.status(200).json({ success: true, message: 'Notification preferences update endpoint — skeleton', data: {} });
});

module.exports = router;
