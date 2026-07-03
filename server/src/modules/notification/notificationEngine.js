// server/src/modules/notification/notificationEngine.js
const EventEmitter = require('events');

class NotificationEngine extends EventEmitter {}

const notificationEngine = new NotificationEngine();

module.exports = notificationEngine;
