const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  fieldType: {
    type: String,
    enum: ['NUMBER', 'TEXT', 'CUSTOM'],
    required: true,
  },
  static: {
    type: Boolean,
    required: true,
  },
  tooltip: {
    type: String,
    required: true,
  },
});

const formSchema = new mongoose.Schema({
  formType: String,
  additionalFields: [fieldSchema],
});

module.exports = mongoose.model('Form', formSchema);
