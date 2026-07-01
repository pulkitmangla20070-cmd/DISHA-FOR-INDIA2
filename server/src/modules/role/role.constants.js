const MESSAGES = {
  ROLE_CREATED: 'Role created successfully',
  ROLE_UPDATED: 'Role updated successfully',
  ROLE_FETCHED: 'Role retrieved successfully',
  ROLES_FETCHED: 'Roles retrieved successfully',
  ROLE_DELETED: 'Role deleted successfully',
  ROLE_NOT_FOUND: 'Role not found',
  ROLE_ALREADY_EXISTS: 'Role with this slug already exists',
};

const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  PROGRAM_MANAGER: 'program_manager',
  VOLUNTEER_COORDINATOR: 'volunteer_coordinator',
  ATTENDANCE_MANAGER: 'attendance_manager',
  REVIEWER: 'reviewer',
  VOLUNTEER: 'volunteer',
  GUEST: 'guest',
};

const ROLE_SLUG_MAP = {
  superadmin: SYSTEM_ROLES.SUPER_ADMIN,
  admin: SYSTEM_ROLES.ADMIN,
  coordinator: SYSTEM_ROLES.VOLUNTEER_COORDINATOR,
  volunteer: SYSTEM_ROLES.VOLUNTEER,
  guest: SYSTEM_ROLES.GUEST,
};

module.exports = {
  MESSAGES,
  SYSTEM_ROLES,
  ROLE_SLUG_MAP,
};