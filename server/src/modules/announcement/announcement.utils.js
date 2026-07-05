function generateAnnouncementId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ANN-${timestamp}-${randomPart}`;
}

function announcementFormatter(announcement) {
  if (!announcement) return null;

  const formatted = announcement.toJSON ? announcement.toJSON() : announcement.toObject ? announcement.toObject() : announcement;

  const result = {
    _id: formatted._id,
    announcementId: formatted.announcementId,
    title: formatted.title,
    message: formatted.message,
    type: formatted.type,
    priority: formatted.priority,
    targetAudience: formatted.targetAudience,
    specificUsers: formatted.specificUsers,
    scheduledAt: formatted.scheduledAt,
    publishedAt: formatted.publishedAt,
    expiresAt: formatted.expiresAt,
    createdBy: formatted.createdBy,
    updatedBy: formatted.updatedBy,
    attachments: formatted.attachments,
    status: formatted.status,
    isDeleted: formatted.isDeleted,
    deletedAt: formatted.deletedAt,
    deletedBy: formatted.deletedBy,
    metadata: formatted.metadata,
    createdAt: formatted.createdAt,
    updatedAt: formatted.updatedAt,
  };

  return result;
}

module.exports = {
  generateAnnouncementId,
  announcementFormatter,
};
