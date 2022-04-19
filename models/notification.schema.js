const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  _id: String,
  message: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['MonitorLogApproved', 'ChangesRequested'],
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
