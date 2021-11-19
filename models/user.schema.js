const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  isAdmin: Boolean,
  isSuperAdmin: Boolean,
  isActive: Boolean,
  segments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Segments',
  }],
});

module.exports = mongoose.model('User', UserSchema);
