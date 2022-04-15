const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema(
  {
    segmentId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    streets: { type: String },
    mapLink: String,
    parking: String,
    deadline: { type: Date, default: null },
    volunteers: [String],
  },
  { toJSON: { virtuals: true } },
);

module.exports = mongoose.model('Segment', segmentSchema);
