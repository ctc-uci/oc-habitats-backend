const NotificationModel = require('../models/notification.schema');

const getAllUserNotifications = async (userId) => {
  return NotificationModel.find({ userId });
};

const createNotification = async (notification) => {
  if (!notification.title || !notification.message || !notification.userId || !notification.type) {
    throw new Error('Arguments missing in notification');
  }
  const createdNotification = new NotificationModel({
    title: notification.title,
    message: notification.message,
    userId: notification.userId,
    type: notification.type,
  });
  return createdNotification.save();
};

const deleteNotification = async (notificationId) => {
  return NotificationModel.deleteOne({ notificationId });
};

module.exports = {
  getAllUserNotifications,
  createNotification,
  deleteNotification,
};
