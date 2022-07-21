const NotificationModel = require('../models/notification.schema');

const getAllUserNotifications = async (userId) => {
  return NotificationModel.find({ userId });
};

const createNotification = async (notification) => {
  if (!notification.message || !notification.userId) {
    throw new Error('Arguments missing in notification');
  }
  const createdNotification = new NotificationModel({
    message: notification.message,
    userId: notification.userId,
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
