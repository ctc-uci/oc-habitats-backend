const UserModel = require('../models/notification.schema');

const getNotification = async (notificationId) => {
  return UserModel.findOne({ notificationId });
};

const getAllNotifications = async () => {
  return UserModel.find({});
};

const updateNotification = async (notificationId, updatedNotification) => {
  return UserModel.updateOne(
    { notificationId },
    {
      $set: updatedNotification,
    },
  );
};

const createNotification = async (notification) => {
  if (!notification.message || !notification.userId || !notification.type || !notification.isNew) {
    throw new Error('Arguments missing in notification');
  }
  const createdNotification = new UserModel({
    message: notification.message,
    userId: notification.userId,
    type: notification.type,
    isNew: notification.isNew,
  });
  return createdNotification.save();
};

const deleteNotification = async (notificationId) => {
  return UserModel.remove({ notificationId });
};

module.exports = {
  getNotification,
  getAllNotifications,
  updateNotification,
  createNotification,
  deleteNotification,
};
