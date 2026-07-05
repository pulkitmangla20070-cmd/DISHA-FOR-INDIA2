const Announcement = require('./announcement.model');

class AnnouncementRepository {
  async create(announcementData) {
    return Announcement.create(announcementData);
  }

  async findById(id) {
    return Announcement.findById(id);
  }

  async findActiveAnnouncements(options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      type,
      priority,
      targetAudience,
      status,
      search,
    } = options;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const filter = { isDeleted: false };

    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (targetAudience) filter.targetAudience = targetAudience;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [announcements, total] = await Promise.all([
      Announcement.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email role'),
      Announcement.countDocuments(filter),
    ]);

    return { announcements, total };
  }

  async findByIdentifier(announcementId) {
    return Announcement.findOne({ announcementId, isDeleted: false });
  }

  async update(id, updateData) {
    return Announcement.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async softDelete(id, deletedBy) {
    return Announcement.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async restore(id) {
    return Announcement.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new AnnouncementRepository();
