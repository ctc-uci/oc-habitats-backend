const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  formType: {
    type: String,
    enum: ['general', 'listed-species', 'human-activity'],
    required: true,
  },
  title: String,
  fieldType: {
    type: String,
    enum: ['NUMBER', 'TEXT', 'CUSTOM'],
    required: true,
  },
  static: {
    type: Boolean,
    required: true,
  },
  tooltip: String,
});

module.exports = mongoose.model('Field', fieldSchema);
