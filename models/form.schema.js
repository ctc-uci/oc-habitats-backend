const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
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
  deleted: Boolean,
});

const formSchema = new mongoose.Schema({
  _id: Number,
  generalAdditionalFields: [fieldSchema],
  listedSpeciesAdditonalFields: [fieldSchema],
  predatorAdditionalFields: [fieldSchema],
});

module.exports = mongoose.model('Form', formSchema);
