const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema(
  {
    segmentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    streets: { type: String },
    mapLink: String,
    parking: String,
    deadline: { type: Date, default: null },
    volunteers: [String],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// Virtual property to get data for users assigned to this segment
segmentSchema.virtual('volunteerData', {
  ref: 'User',
  localField: '_id',
  foreignField: 'segments',
});

module.exports = mongoose.model('Segment', segmentSchema);
