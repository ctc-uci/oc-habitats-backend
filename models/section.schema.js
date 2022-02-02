const mongoose = require('mongoose');
// const segmentSchema = require('./segment.schema').schema;

const sectionSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, required: true, unique: true },
  segments: [{ _id: false, name: { type: String, ref: 'Segment' } }],
});

module.exports = mongoose.model('Section', sectionSchema);
