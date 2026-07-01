const express = require('express');
const organizationController = require('./organization.controller');
const {
  validateCreateOrganization,
  validateUpdateOrganization,
  validateOrganizationId,
  validateListOrganizations,
} = require('./organization.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

router.post('/', authenticate, authorize(ROLES.SUPER_ADMIN), validateCreateOrganization, organizationController.createOrganization);

router.get('/', authenticate, validateListOrganizations, organizationController.listOrganizations);

router.get('/:id', authenticate, validateOrganizationId, organizationController.getOrganization);

router.put('/:id', authenticate, validateOrganizationId, validateUpdateOrganization, organizationController.updateOrganization);

router.delete('/:id', authenticate, validateOrganizationId, organizationController.deleteOrganization);

module.exports = router;
