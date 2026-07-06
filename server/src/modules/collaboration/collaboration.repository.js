const CollaborationWorkspace = require('./collaboration.model');

class CollaborationRepository {
  async create(data) {
    return CollaborationWorkspace.create(data);
  }

  async findById(id) {
    return CollaborationWorkspace.findById(id);
  }

  async findActiveById(id) {
    return CollaborationWorkspace.findOne({ _id: id, isDeleted: false });
  }

  async findAll(options = {}) {
    const { page = 1, limit = 10, createdBy, status, search } = options;
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };
    if (createdBy) filter.createdBy = createdBy;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [workspaces, total] = await Promise.all([
      CollaborationWorkspace.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email role'),
      CollaborationWorkspace.countDocuments(filter),
    ]);

    return { workspaces, total };
  }

  async findByIdAndMember(id, userId) {
    return CollaborationWorkspace.findOne({
      _id: id,
      members: userId,
      isDeleted: false,
    });
  }

  async update(id, updateData) {
    return CollaborationWorkspace.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async softDelete(id, deletedBy) {
    return CollaborationWorkspace.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async addMember(id, userId, role, invitedBy) {
    return CollaborationWorkspace.findByIdAndUpdate(
      id,
      {
        $addToSet: { members: userId },
        $push: {
          memberDetails: {
            userId,
            role,
            invitedBy: invitedBy || null,
            joinedAt: new Date(),
          },
        },
      },
      { new: true }
    );
  }

  async removeMember(id, userId) {
    return CollaborationWorkspace.findByIdAndUpdate(
      id,
      {
        $pull: { members: userId, memberDetails: { userId } },
      },
      { new: true }
    );
  }

  async addNote(workspaceId, noteData) {
    return CollaborationWorkspace.findByIdAndUpdate(
      workspaceId,
      {
        $push: {
          sharedNotes: {
            ...noteData,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );
  }

  async addFile(workspaceId, fileData) {
    return CollaborationWorkspace.findByIdAndUpdate(
      workspaceId,
      {
        $push: {
          sharedFiles: {
            ...fileData,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );
  }

  async addTask(workspaceId, taskData) {
    return CollaborationWorkspace.findByIdAndUpdate(
      workspaceId,
      {
        $push: {
          taskAssignments: {
            ...taskData,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );
  }

  async updateTask(workspaceId, taskIndex, updateData) {
    const workspace = await CollaborationWorkspace.findById(workspaceId);
    if (!workspace || !workspace.taskAssignments[taskIndex]) return null;

    workspace.taskAssignments[taskIndex] = {
      ...workspace.taskAssignments[taskIndex].toObject(),
      ...updateData,
    };

    await workspace.save();
    return workspace;
  }

  async addActivityLog(workspaceId, activityData) {
    return CollaborationWorkspace.findByIdAndUpdate(
      workspaceId,
      {
        $push: {
          activityLog: {
            ...activityData,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );
  }
}

module.exports = new CollaborationRepository();
