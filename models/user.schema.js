const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: String,
  firstName: String,
  lastName: String,
  email: String,
  isAdmin: Boolean,
  isSuperAdmin: Boolean,
  isActive: Boolean,
  isTrainee: Boolean,
  profileImage: {
    data: Buffer,
    contentType: String,
  },
  segments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Segments',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
