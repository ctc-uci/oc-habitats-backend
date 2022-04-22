const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
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

const FORM_TYPES = {
  GENERAL_TYPE: 'general',
  LISTED_SPECIES_TYPE: 'listedSpecies',
  PREDATOR_TYPE: 'predator',
  HUMAN_ACTIVITY_TYPE: 'humanActivity',
};

const formSchema = new mongoose.Schema({
  id: Number,
  formType: {
    type: String,
    enum: [FORM_TYPES.GENERAL_TYPE, FORM_TYPES.LISTED_SPECIES_TYPE, FORM_TYPES.HUMAN_ACTIVITY_TYPE],
    required: true,
  },
  additionalFields: [fieldSchema],
});

module.exports = mongoose.model('Form', formSchema);
