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
  subtitle: {
    type: String,
    required: false,
  },
  fieldType: {
    type: String,
    enum: ['NUMBER', 'TEXT', 'CUSTOM'],
    required: false,
  },
  static: {
    type: Boolean,
    required: true,
  },
  tooltip: {
    type: String,
    required: false,
  },
});

const formSchema = new mongoose.Schema({
  formType: String,
  additionalFields: [fieldSchema],
});

module.exports = mongoose.model('Form', formSchema);
