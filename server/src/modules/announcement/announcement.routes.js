const express = require('express');
const announcementController = require('./announcement.controller');
const {
  validateCreateAnnouncement,
  validateUpdateAnnouncement,
  validateGetAnnouncement,
  validateGetAnnouncements,
  validateStatusTransition,
} = require('./announcement.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { isAdmin } = require('../../middlewares/rbac.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', validateGetAnnouncements, announcementController.getAnnouncements);

router.get('/:id', validateGetAnnouncement, announcementController.getAnnouncement);

router.post('/', isAdmin, validateCreateAnnouncement, announcementController.createAnnouncement);

router.patch('/:id', isAdmin, validateUpdateAnnouncement, announcementController.updateAnnouncement);

router.delete('/:id', isAdmin, validateGetAnnouncement, announcementController.deleteAnnouncement);

router.patch('/:id/publish', isAdmin, validateStatusTransition, announcementController.publishAnnouncement);

router.patch('/:id/archive', isAdmin, validateStatusTransition, announcementController.archiveAnnouncement);

module.exports = router;
