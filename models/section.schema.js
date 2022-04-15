const mongoose = require('mongoose');
// const segmentSchema = require('./segment.schema').schema;

const sectionSchema = new mongoose.Schema({
  _id: String, // corresponds to section Id
  name: { type: String, required: true, unique: true },
  map: String,
  segments: [{ type: String, ref: 'Segment' }],
});

module.exports = mongoose.model('Section', sectionSchema);
