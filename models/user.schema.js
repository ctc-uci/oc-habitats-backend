const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: String,
  firstName: String,
  lastName: String,
  email: String,
  role: String,
  isActive: Boolean,
  isTrainee: Boolean,
  registered: Boolean,
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
