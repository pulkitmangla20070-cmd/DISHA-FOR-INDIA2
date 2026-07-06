const collaborationRepository = require('./collaboration.repository');
const { MEMBER_ROLE, TASK_STATUS, MESSAGES } = require('./collaboration.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');
const ConflictError = require('../../utils/errors/ConflictError');

class CollaborationService {
  async createWorkspace(data, userId) {
    const { name, description } = data;

    const workspace = await collaborationRepository.create({
      name,
      description,
      createdBy: userId,
      members: [userId],
      memberDetails: [
        {
          userId,
          role: MEMBER_ROLE.ADMIN,
          joinedAt: new Date(),
          invitedBy: null,
        },
      ],
    });

    return {
      workspace,
      message: MESSAGES.WORKSPACE_CREATED,
    };
  }

  async getWorkspaces(query = {}, userId) {
    const { page = 1, limit = 10, search, status } = query;

    const result = await collaborationRepository.findAll({
      page: Number(page),
      limit: Number(limit),
      createdBy: userId,
      status,
      search,
    });

    return {
      workspaces: result.workspaces,
      total: result.total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit)) || 1,
      },
      message: MESSAGES.WORKSPACES_FETCHED,
    };
  }

  async getWorkspace(workspaceId, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (!isMember) {
      throw new ValidationError(MESSAGES.NOT_MEMBER);
    }

    return {
      workspace,
      message: MESSAGES.WORKSPACE_FETCHED,
    };
  }

  async updateWorkspace(workspaceId, updateData, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isCreator = workspace.createdBy.toString() === userId.toString();
    if (!isCreator) {
      throw new ValidationError('Only workspace creator can update workspace');
    }

    const allowedFields = ['name', 'description'];
    const safeUpdate = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        safeUpdate[field] = updateData[field];
      }
    }

    const updated = await collaborationRepository.update(workspaceId, safeUpdate);

    return {
      workspace: updated,
      message: MESSAGES.WORKSPACE_UPDATED,
    };
  }

  async deleteWorkspace(workspaceId, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isCreator = workspace.createdBy.toString() === userId.toString();
    if (!isCreator) {
      throw new ValidationError('Only workspace creator can delete workspace');
    }

    await collaborationRepository.softDelete(workspaceId, userId);

    return {
      message: MESSAGES.WORKSPACE_DELETED,
    };
  }

  async joinWorkspace(workspaceId, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (isMember) {
      throw new ConflictError(MESSAGES.ALREADY_MEMBER);
    }

    await collaborationRepository.addMember(workspaceId, userId, MEMBER_ROLE.MEMBER, userId);

    return {
      message: MESSAGES.WORKSPACE_JOINED,
    };
  }

  async leaveWorkspace(workspaceId, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isCreator = workspace.createdBy.toString() === userId.toString();
    if (isCreator) {
      throw new ValidationError(MESSAGES.CANNOT_LEAVE);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (!isMember) {
      throw new ValidationError(MESSAGES.NOT_MEMBER);
    }

    await collaborationRepository.removeMember(workspaceId, userId);

    return {
      message: MESSAGES.WORKSPACE_LEFT,
    };
  }

  async getWorkspaceMembers(workspaceId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    return {
      members: workspace.memberDetails,
      message: MESSAGES.MEMBERS_FETCHED,
    };
  }

  async addNote(workspaceId, noteData, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (!isMember) {
      throw new ValidationError(MESSAGES.NOT_MEMBER);
    }

    const updatedWorkspace = await collaborationRepository.addNote(workspaceId, {
      ...noteData,
      createdBy: userId,
    });

    return {
      note: updatedWorkspace.sharedNotes[updatedWorkspace.sharedNotes.length - 1],
      message: MESSAGES.NOTE_ADDED,
    };
  }

  async addFile(workspaceId, fileData, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (!isMember) {
      throw new ValidationError(MESSAGES.NOT_MEMBER);
    }

    const updatedWorkspace = await collaborationRepository.addFile(workspaceId, {
      ...fileData,
      uploadedBy: userId,
    });

    return {
      file: updatedWorkspace.sharedFiles[updatedWorkspace.sharedFiles.length - 1],
      message: MESSAGES.FILE_ADDED,
    };
  }

  async assignTask(workspaceId, taskData, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (!isMember) {
      throw new ValidationError(MESSAGES.NOT_MEMBER);
    }

    const updatedWorkspace = await collaborationRepository.addTask(workspaceId, {
      ...taskData,
      assignedBy: userId,
    });

    return {
      task: updatedWorkspace.taskAssignments[updatedWorkspace.taskAssignments.length - 1],
      message: MESSAGES.TASK_CREATED,
    };
  }

  async updateTaskStatus(workspaceId, taskIndex, updateData, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (!isMember) {
      throw new ValidationError(MESSAGES.NOT_MEMBER);
    }

    const task = workspace.taskAssignments[taskIndex];
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const safeUpdate = {};
    for (const field of ['status', 'description', 'dueDate']) {
      if (updateData[field] !== undefined) {
        safeUpdate[field] = updateData[field];
      }
    }

    if (safeUpdate.status === TASK_STATUS.COMPLETED) {
      safeUpdate.completedAt = new Date();
    }

    const updated = await collaborationRepository.updateTask(workspaceId, taskIndex, safeUpdate);

    return {
      task: updated.taskAssignments[taskIndex],
      message: MESSAGES.TASK_UPDATED,
    };
  }

  async getWorkspaceActivityLog(workspaceId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    return {
      activityLog: workspace.activityLog,
      message: MESSAGES.ACTIVITY_LOG_FETCHED,
    };
  }
}

module.exports = new CollaborationService();
