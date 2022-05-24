const mongoose = require('mongoose');

const humanActivitySchema = new mongoose.Schema({
  name: String,
  description: String,
});

module.exports = mongoose.model('HumanActivity', humanActivitySchema);
