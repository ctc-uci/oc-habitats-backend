const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  isEndangered: { type: Boolean, default: false },
  isAssigned: { type: Boolean, default: false },
});

module.exports = mongoose.model('Species', speciesSchema);
