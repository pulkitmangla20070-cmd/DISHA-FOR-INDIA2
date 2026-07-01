const roleRepository = require('./role.repository');
const Role = require('./role.model');
const permissionService = require('../permission/permission.service');
const { MESSAGES, SYSTEM_ROLES } = require('./role.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ConflictError = require('../../utils/errors/ConflictError');

const ROLE_PERMISSIONS = {
  [SYSTEM_ROLES.SUPER_ADMIN]: [],
  [SYSTEM_ROLES.ADMIN]: [
    'users:read',
    'users:update',
    'programs:create',
    'programs:read',
    'programs:update',
    'programs:delete',
    'programs:publish',
    'applications:read',
    'applications:approve',
    'attendance:read',
    'attendance:mark',
    'certificates:read',
    'certificates:generate',
    'rewards:read',
    'leaderboard:read',
    'notifications:read',
    'organizations:read',
  ],
  [SYSTEM_ROLES.PROGRAM_MANAGER]: [
    'programs:create',
    'programs:read',
    'programs:update',
    'programs:publish',
    'applications:read',
    'applications:approve',
  ],
  [SYSTEM_ROLES.VOLUNTEER_COORDINATOR]: [
    'programs:read',
    'applications:read',
    'attendance:mark',
    'attendance:read',
    'leaderboard:read',
  ],
  [SYSTEM_ROLES.ATTENDANCE_MANAGER]: ['attendance:mark', 'attendance:read', 'users:read'],
  [SYSTEM_ROLES.REVIEWER]: ['applications:read', 'users:read'],
  [SYSTEM_ROLES.VOLUNTEER]: ['applications:create', 'attendance:read', 'certificates:read', 'programs:read'],
  [SYSTEM_ROLES.GUEST]: ['programs:read'],
};

class RoleService {
  async createRole(userId, roleData) {
    const { name, slug, description, organization, permissions } = roleData;

    const existing = await roleRepository.existsBySlug(slug);
    if (existing) {
      throw new ConflictError(MESSAGES.ROLE_ALREADY_EXISTS);
    }

    const count = await Role.countDocuments({});
    const role = await roleRepository.create({
      roleId: `ROLE${String(count + 1).padStart(4, '0')}`,
      name,
      slug,
      description,
      organization: organization || null,
      permissions: permissions || [],
      isSystemRole: false,
      createdBy: userId,
      updatedBy: userId,
    });

    return { role };
  }

  async getRoles(queryParams) {
    const { roles, total, page, limit } = await roleRepository.findAll(queryParams);
    const totalPages = Math.ceil(total / limit);
    return {
      roles,
      pagination: { total, page, limit, totalPages },
    };
  }

  async getRole(id) {
    const role = await roleRepository.findById(id);
    if (!role) {
      throw new NotFoundError(MESSAGES.ROLE_NOT_FOUND);
    }
    return { role };
  }

  async updateRole(userId, roleId, updateData) {
    const role = await roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundError(MESSAGES.ROLE_NOT_FOUND);
    }

    const updated = await roleRepository.update(roleId, { ...updateData, updatedBy: userId });
    return { role: updated };
  }

  async deleteRole(userId, roleId) {
    const role = await roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundError(MESSAGES.ROLE_NOT_FOUND);
    }

    await roleRepository.softDelete(roleId, userId);
    return { role };
  }

  async seedDefaultRoles() {
    const count = await Role.countDocuments({ isSystemRole: true });
    if (count > 0) {
      return { message: 'Default roles already seeded' };
    }

    const allPermissions = await permissionService.findAll();
    const permissionMap = {};
    allPermissions.forEach((p) => (permissionMap[p.code] = p._id));

    const rolesToCreate = Object.entries(ROLE_PERMISSIONS).map(([slug, codes], idx) => ({
      roleId: `ROLE${String(idx + 1).padStart(4, '0')}`,
      name: slug.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      slug,
      description: `System role: ${slug}`,
      organization: null,
      permissions: codes.map((code) => permissionMap[code]).filter(Boolean),
      isSystemRole: true,
      createdBy: null,
      updatedBy: null,
    }));

    await Role.insertMany(rolesToCreate);
    return { message: `${rolesToCreate.length} default roles seeded` };
  }

  async getPermissionsForRole(roleSlug) {
    const role = await roleRepository.findBySlug(roleSlug);
    if (role) {
      return role.permissions || [];
    }
    return [];
  }
}

module.exports = new RoleService();