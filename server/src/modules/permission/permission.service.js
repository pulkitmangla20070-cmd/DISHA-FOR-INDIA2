const permissionRepository = require('./permission.repository');
const Permission = require('./permission.model');
const { MESSAGES } = require('./permission.constants');
const ValidationError = require('../../utils/errors/ValidationError');
const ConflictError = require('../../utils/errors/ConflictError');

const DEFAULT_PERMISSIONS = [
  { module: 'users', action: 'create', code: 'users:create', category: 'crud' },
  { module: 'users', action: 'read', code: 'users:read', category: 'crud' },
  { module: 'users', action: 'update', code: 'users:update', category: 'crud' },
  { module: 'users', action: 'delete', code: 'users:delete', category: 'crud' },
  { module: 'programs', action: 'create', code: 'programs:create', category: 'crud' },
  { module: 'programs', action: 'read', code: 'programs:read', category: 'crud' },
  { module: 'programs', action: 'update', code: 'programs:update', category: 'crud' },
  { module: 'programs', action: 'delete', code: 'programs:delete', category: 'crud' },
  { module: 'programs', action: 'publish', code: 'programs:publish', category: 'management' },
  { module: 'programs', action: 'archive', code: 'programs:archive', category: 'management' },
  { module: 'applications', action: 'create', code: 'applications:create', category: 'crud' },
  { module: 'applications', action: 'read', code: 'applications:read', category: 'crud' },
  { module: 'applications', action: 'update', code: 'applications:update', category: 'crud' },
  { module: 'applications', action: 'delete', code: 'applications:delete', category: 'crud' },
  { module: 'applications', action: 'approve', code: 'applications:approve', category: 'management' },
  { module: 'attendance', action: 'mark', code: 'attendance:mark', category: 'crud' },
  { module: 'attendance', action: 'read', code: 'attendance:read', category: 'crud' },
  { module: 'certificates', action: 'create', code: 'certificates:create', category: 'crud' },
  { module: 'certificates', action: 'read', code: 'certificates:read', category: 'crud' },
  { module: 'certificates', action: 'generate', code: 'certificates:generate', category: 'management' },
  { module: 'rewards', action: 'create', code: 'rewards:create', category: 'crud' },
  { module: 'rewards', action: 'read', code: 'rewards:read', category: 'crud' },
  { module: 'rewards', action: 'update', code: 'rewards:update', category: 'crud' },
  { module: 'rewards', action: 'delete', code: 'rewards:delete', category: 'crud' },
  { module: 'leaderboard', action: 'read', code: 'leaderboard:read', category: 'read' },
  { module: 'leaderboard', action: 'refresh', code: 'leaderboard:refresh', category: 'management' },
  { module: 'notifications', action: 'create', code: 'notifications:create', category: 'crud' },
  { module: 'notifications', action: 'read', code: 'notifications:read', category: 'crud' },
  { module: 'notifications', action: 'update', code: 'notifications:update', category: 'crud' },
  { module: 'notifications', action: 'delete', code: 'notifications:delete', category: 'crud' },
  { module: 'organizations', action: 'create', code: 'organizations:create', category: 'admin' },
  { module: 'organizations', action: 'read', code: 'organizations:read', category: 'admin' },
  { module: 'organizations', action: 'update', code: 'organizations:update', category: 'admin' },
  { module: 'organizations', action: 'delete', code: 'organizations:delete', category: 'admin' },
  { module: 'roles', action: 'create', code: 'roles:create', category: 'admin' },
  { module: 'roles', action: 'read', code: 'roles:read', category: 'admin' },
  { module: 'roles', action: 'update', code: 'roles:update', category: 'admin' },
  { module: 'roles', action: 'delete', code: 'roles:delete', category: 'admin' },
  { module: 'permissions', action: 'read', code: 'permissions:read', category: 'admin' },
  { module: 'analytics', action: 'read', code: 'analytics:read', category: 'admin' },
  { module: 'media', action: 'upload', code: 'media:upload', category: 'management' },
  { module: 'settings', action: 'read', code: 'settings:read', category: 'admin' },
  { module: 'settings', action: 'update', code: 'settings:update', category: 'admin' },
];

class PermissionService {
  async createPermission(permissionData) {
    const { code, module, action, description, category } = permissionData;

    const existing = await permissionRepository.existsByCode(code);
    if (existing) {
      throw new ConflictError(MESSAGES.PERMISSION_ALREADY_EXISTS);
    }

    const count = await Permission.countDocuments({});
    const permission = await permissionRepository.create({
      permissionId: `PERM${String(count + 1).padStart(4, '0')}`,
      module,
      action,
      code,
      description,
      category,
      isSystemPermission: false,
    });

    return { permission };
  }

  async getPermissions(queryParams) {
    const { permissions, total, page, limit } =
      await permissionRepository.findAll(queryParams);
    const totalPages = Math.ceil(total / limit);
    return {
      permissions,
      pagination: { total, page, limit, totalPages },
    };
  }

  async findAll() {
    return Permission.find({});
  }

  async seedDefaultPermissions() {
    const count = await Permission.countDocuments({ isSystemPermission: true });
    if (count > 0) {
      return { message: 'Default permissions already seeded' };
    }

    const permissionsToCreate = DEFAULT_PERMISSIONS.map((p, idx) => ({
      ...p,
      permissionId: `PERM${String(idx + 1).padStart(4, '0')}`,
      isSystemPermission: true,
    }));

    await Permission.insertMany(permissionsToCreate);
    return { message: `${permissionsToCreate.length} default permissions seeded` };
  }

  async findByCode(code) {
    const permission = await permissionRepository.findByCode(code);
    if (!permission) {
      throw new ValidationError(MESSAGES.PERMISSION_NOT_FOUND);
    }
    return { permission };
  }
}

module.exports = new PermissionService();