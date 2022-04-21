const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  _id: String,
  message: String,
  title: String,
  userId: {
    type: String,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['MONITOR_LOG_APPROVED', 'CHANGES_REQUESTED'],
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
