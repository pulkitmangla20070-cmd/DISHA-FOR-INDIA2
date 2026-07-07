const announcementRepository = require('./announcement.repository');
const User = require('../user/user.model');
const {
  generateAnnouncementId,
  announcementFormatter,
} = require('./announcement.utils');
const { TARGET_AUDIENCE, STATUS, MESSAGES, DEFAULTS } = require('./announcement.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');

class AnnouncementService {
  async createAnnouncement(announcementData, createdBy) {
    let targetAudienceValue = announcementData.targetAudience || DEFAULTS.TARGET_AUDIENCE;
    let typeValue = announcementData.type || DEFAULTS.TYPE;
    let priorityValue = announcementData.priority || DEFAULTS.PRIORITY;
    let statusValue = announcementData.status || DEFAULTS.STATUS;

    if (announcementData.scheduledAt && statusValue === STATUS.DRAFT) {
      statusValue = STATUS.SCHEDULED;
    }

    const specificUsers = targetAudienceValue === TARGET_AUDIENCE.SPECIFIC_USERS
      ? announcementData.specificUsers || []
      : [];

    const announcement = await announcementRepository.create({
      ...announcementData,
      announcementId: generateAnnouncementId(),
      type: typeValue,
      priority: priorityValue,
      targetAudience: targetAudienceValue,
      status: statusValue,
      specificUsers,
      createdBy,
      updatedBy: createdBy,
      publishedAt: statusValue === STATUS.PUBLISHED ? new Date() : null,
    });

    if (statusValue === STATUS.PUBLISHED) {
      const { announcementAutomation } = require('./announcement.automation');
      announcementAutomation._notifyAudience(announcement).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to notify audience for new announcement:', err.message);
      });
    }

    return {
      announcement: announcementFormatter(announcement),
      message: MESSAGES.ANNOUNCEMENT_CREATED,
    };
  }

  async getAnnouncements(query = {}, currentUserId) {
    const {
      page = 1,
      limit = 10,
      sortBy,
      order,
      type,
      priority,
      targetAudience,
      status,
      search,
    } = query;

    let effectiveTargetAudience = targetAudience;

    const user = await User.findById(currentUserId).select('role');

    if (!targetAudience) {
      if (user && user.role === 'admin') {
        effectiveTargetAudience = undefined;
      } else {
        effectiveTargetAudience = TARGET_AUDIENCE.ALL_USERS;
      }
    }

    const result = await announcementRepository.findActiveAnnouncements({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy || 'createdAt',
      order: order || 'desc',
      type,
      priority,
      targetAudience: effectiveTargetAudience,
      status,
      search,
    });

    const { announcements, total } = result;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    return {
      announcements: announcements.map(announcementFormatter),
      total,
      message: MESSAGES.ANNOUNCEMENTS_FETCHED,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async getAnnouncement(announcementId) {
    const announcement = await announcementRepository.findByIdentifier(announcementId);

    if (!announcement) {
      throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    }

    return {
      announcement: announcementFormatter(announcement),
      message: MESSAGES.ANNOUNCEMENT_FETCHED,
    };
  }

  async updateAnnouncement(announcementId, updateData) {
    const announcement = await announcementRepository.findById(announcementId);

    if (!announcement) {
      throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    }

    if (announcement.status === STATUS.ARCHIVED) {
      throw new ValidationError('Cannot update an archived announcement');
    }

    const updatePayload = { ...updateData };

    if (updatePayload.status === STATUS.PUBLISHED && !announcement.publishedAt) {
      updatePayload.publishedAt = new Date();
    }

    if (updatePayload.targetAudience === TARGET_AUDIENCE.SPECIFIC_USERS) {
      updatePayload.specificUsers = updateData.specificUsers || announcement.specificUsers;
    }

    const updated = await announcementRepository.update(announcementId, updatePayload);

    if (updatePayload.status === STATUS.PUBLISHED && announcement.status !== STATUS.PUBLISHED) {
      const { announcementAutomation } = require('./announcement.automation');
      announcementAutomation._notifyAudience(updated).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to notify audience for updated announcement:', err.message);
      });
    }

    return {
      announcement: announcementFormatter(updated),
      message: MESSAGES.ANNOUNCEMENT_UPDATED,
    };
  }

  async publishAnnouncement(announcementId) {
    const announcement = await announcementRepository.findById(announcementId);

    if (!announcement) {
      throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    }

    if (announcement.status === STATUS.PUBLISHED) {
      return {
        announcement: announcementFormatter(announcement),
        message: 'Announcement is already published',
      };
    }

    if (announcement.status === STATUS.ARCHIVED) {
      throw new ValidationError('Cannot publish an archived announcement');
    }

    const updated = await announcementRepository.update(announcementId, {
      status: STATUS.PUBLISHED,
      publishedAt: new Date(),
    });

    const { announcementAutomation } = require('./announcement.automation');
    announcementAutomation._notifyAudience(updated).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Failed to notify audience for published announcement:', err.message);
    });

    return {
      announcement: announcementFormatter(updated),
      message: MESSAGES.ANNOUNCEMENT_PUBLISHED,
    };
  }

  async archiveAnnouncement(announcementId) {
    const announcement = await announcementRepository.findById(announcementId);

    if (!announcement) {
      throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    }

    if (announcement.status === STATUS.ARCHIVED) {
      return {
        announcement: announcementFormatter(announcement),
        message: 'Announcement is already archived',
      };
    }

    const updated = await announcementRepository.update(announcementId, {
      status: STATUS.ARCHIVED,
    });

    return {
      announcement: announcementFormatter(updated),
      message: MESSAGES.ANNOUNCEMENT_ARCHIVED,
    };
  }

  async deleteAnnouncement(announcementId) {
    const announcement = await announcementRepository.findById(announcementId);

    if (!announcement) {
      throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    }

    if (announcement.isDeleted) {
      return {
        message: MESSAGES.ANNOUNCEMENT_DELETED,
      };
    }

    await announcementRepository.softDelete(announcementId);

    return {
      message: MESSAGES.ANNOUNCEMENT_DELETED,
    };
  }

  async searchAnnouncements(searchQuery, options = {}) {
    return announcementRepository.findActiveAnnouncements({
      ...options,
      search: searchQuery.trim(),
    });
  }
}

module.exports = new AnnouncementService();
