import segmentSchema from './segment.schema';

const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  _id: String,
  name: {type: String, required: true, unique: true},
  geofence_area: {
    latitude: Number,
    longitude: Number,
  },
  segments: [segmentSchema],
});

module.exports = mongoose.model('Section', sectionSchema);
