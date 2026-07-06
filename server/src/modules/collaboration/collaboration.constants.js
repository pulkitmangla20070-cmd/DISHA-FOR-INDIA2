const STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
};

const MEMBER_ROLE = {
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
};

const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const MESSAGES = {
  WORKSPACE_CREATED: 'Workspace created successfully',
  WORKSPACE_FETCHED: 'Workspace fetched successfully',
  WORKSPACES_FETCHED: 'Workspaces fetched successfully',
  WORKSPACE_UPDATED: 'Workspace updated successfully',
  WORKSPACE_DELETED: 'Workspace deleted successfully',
  WORKSPACE_JOINED: 'Joined workspace successfully',
  WORKSPACE_LEFT: 'Left workspace successfully',
  WORKSPACE_NOT_FOUND: 'Workspace not found',
  ALREADY_MEMBER: 'You are already a member of this workspace',
  NOT_MEMBER: 'You are not a member of this workspace',
  CANNOT_LEAVE: 'You cannot leave a workspace you created. Transfer ownership or delete the workspace instead.',
  NOTE_ADDED: 'Note added successfully',
  FILE_ADDED: 'File added successfully',
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  MEMBERS_FETCHED: 'Members fetched successfully',
  ACTIVITY_LOG_FETCHED: 'Activity log fetched successfully',
};

const DEFAULTS = {
  STATUS: STATUS.ACTIVE,
  MEMBER_ROLE: MEMBER_ROLE.MEMBER,
  TASK_STATUS: TASK_STATUS.PENDING,
  PAGE: 1,
  LIMIT: 10,
};

module.exports = {
  STATUS,
  MEMBER_ROLE,
  TASK_STATUS,
  MESSAGES,
  DEFAULTS,
};
