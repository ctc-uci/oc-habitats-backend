const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  isAdmin: Boolean,
  isSuperAdmin: Boolean,
  isActive: Boolean,
  isTrainee: Boolean,
  segments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Segments',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
