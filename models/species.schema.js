const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ['NON_LISTED_PREDATOR', 'JUST_PREDATOR', 'LISTED', 'NON_LISTED'],
  },
});

module.exports = mongoose.model('Species', speciesSchema);
