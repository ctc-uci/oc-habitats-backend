const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  isListed: { type: Boolean, default: false },
  isPredator: { type: Boolean, default: false },
});

module.exports = mongoose.model('Species', speciesSchema);
