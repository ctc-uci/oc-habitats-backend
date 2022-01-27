const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, required: true, unique: true },
  description: { type: String, default: null },
  geofence_area: { type: String, default: null },
  deadline: { type: Date, default: null },
  assigned: { type: Boolean, default: false },
  volunteers: [String],
});

module.exports = mongoose.model('Segment', segmentSchema);
