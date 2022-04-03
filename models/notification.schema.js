const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  isNew: Boolean,
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
