const express = require('express');
const roleController = require('./role.controller');
const { validateCreateRole, validateRoleId } = require('./role.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { isAdmin } = require('../../middlewares/rbac.middleware');

const router = express.Router();

router.post('/', authenticate, isAdmin, validateCreateRole, roleController.createRole);
router.get('/', authenticate, isAdmin, roleController.listRoles);
router.get('/:id', authenticate, isAdmin, validateRoleId, roleController.getRole);
router.put('/:id', authenticate, isAdmin, validateRoleId, validateCreateRole, roleController.updateRole);
router.delete('/:id', authenticate, isAdmin, validateRoleId, roleController.deleteRole);

module.exports = router;