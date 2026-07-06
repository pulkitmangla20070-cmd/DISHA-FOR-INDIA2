const express = require('express');
const matchingController = require('./matching.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

router.get('/programs', authenticate, matchingController.getProgramRecommendations);

router.get(
  '/volunteers',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  matchingController.getVolunteerRecommendations
);

router.get('/recommendations', authenticate, matchingController.getDetailedRecommendation);

module.exports = router;
