const express = require('express');
const notificationPreferenceController = require('./notificationPreference.controller');
const {
  validateGetPreferences,
  validateUpdatePreferences,
} = require('./notificationPreference.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

// ─── Notification Preference Routes ────────────────────────────────
router.get('/preferences', authenticate, validateGetPreferences, notificationPreferenceController.getPreferences);

router.put('/preferences', authenticate, validateUpdatePreferences, notificationPreferenceController.updatePreferences);

module.exports = router;
