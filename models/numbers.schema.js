const mongoose = require('mongoose');

const numbersSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  number: { type: String, required: true, unique: true },
  note: { type: String },
});

module.exports = mongoose.model('Numbers', numbersSchema);
