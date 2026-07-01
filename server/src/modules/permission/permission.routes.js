const express = require('express');
const permissionController = require('./permission.controller');
const { validateCreatePermission, validateListPermissions } = require('./permission.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { isAdmin } = require('../../middlewares/rbac.middleware');

const router = express.Router();

router.get('/', authenticate, validateListPermissions, permissionController.listPermissions);

router.post('/', authenticate, isAdmin, validateCreatePermission, permissionController.createPermission);

module.exports = router;