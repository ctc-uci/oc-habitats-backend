const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: String,
  title: String,
  userId: {
    type: String,
    ref: 'User',
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
