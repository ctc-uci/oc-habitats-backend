const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _id: String,
    firebaseId: String,
    firstName: String,
    lastName: String,
    email: String,
    role: String,
    isActive: { type: Boolean, default: true },
    isTrainee: { type: Boolean, default: false },
    registered: Boolean,
    profileImage: {
      data: Buffer,
      contentType: String,
    },
    segments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Segment',
      },
    ],
  },
  { toJSON: { virtuals: true } },
);

module.exports = mongoose.model('User', userSchema);
