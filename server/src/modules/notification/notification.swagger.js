const { NOTIFICATION_TYPES, PRIORITY, CHANNEL, STATUS, MESSAGES, DEFAULTS } = require('./notification.constants');

/**
 * Swagger documentation for Notification module.
 */

const NotificationSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      example: '665f1b2c3d4e5f6789abcdef',
    },
    notificationId: {
      type: 'string',
      example: 'NTF-MXQ3K7-RANDOM',
    },
    recipient: {
      type: 'string',
      example: '665f1b2c3d4e5f6789abcdeg',
    },
    sender: {
      type: 'string',
      nullable: true,
      example: '665f1b2c3d4e5f6789abcdeh',
    },
    title: {
      type: 'string',
      example: 'New application received',
    },
    message: {
      type: 'string',
      example: 'Your application for Beach Cleanup Drive has been received.',
    },
    type: {
      type: 'string',
      enum: Object.values(NOTIFICATION_TYPES),
      example: 'application',
    },
    category: {
      type: 'string',
      example: 'general',
    },
    priority: {
      type: 'string',
      enum: Object.values(PRIORITY),
      example: 'medium',
    },
    channel: {
      type: 'string',
      enum: Object.values(CHANNEL),
      example: 'in-app',
    },
    relatedEntityType: {
      type: 'string',
      nullable: true,
      example: 'application',
    },
    relatedEntityId: {
      type: 'string',
      nullable: true,
      example: '665f1b2c3d4e5f6789abcdei',
    },
    isRead: {
      type: 'boolean',
      example: false,
    },
    readAt: {
      type: 'string',
      format: 'date-time',
      nullable: true,
      example: '2026-06-30T04:00:00.000Z',
    },
    scheduledFor: {
      type: 'string',
      format: 'date-time',
      nullable: true,
      example: '2026-07-01T04:00:00.000Z',
    },
    sentAt: {
      type: 'string',
      format: 'date-time',
      nullable: true,
      example: '2026-06-30T04:00:00.000Z',
    },
    expiresAt: {
      type: 'string',
      format: 'date-time',
      nullable: true,
      example: '2026-07-07T04:00:00.000Z',
    },
    metadata: {
      type: 'object',
      example: {},
    },
    status: {
      type: 'string',
      enum: Object.values(STATUS),
      example: 'pending',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      example: '2026-07-01T00:00:00.000Z',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      example: '2026-07-01T00:00:00.000Z',
    },
  },
};

const PaginatedNotificationsResponse = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: MESSAGES.NOTIFICATIONS_FETCHED },
    data: {
      type: 'object',
      properties: {
        notifications: {
          type: 'array',
          items: { $ref: '#/components/schemas/Notification' },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 25 },
            totalPages: { type: 'integer', example: 3 },
          },
        },
      },
    },
  },
};

module.exports = {
  NotificationSchema,
  PaginatedNotificationsResponse,
  NOTIFICATION_TYPES,
  PRIORITY,
  CHANNEL,
  STATUS,
  MESSAGES,
  DEFAULTS,
};
