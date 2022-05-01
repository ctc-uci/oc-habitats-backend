const mongoose = require('mongoose');

const bandTabSchema = new mongoose.Schema({
  colors: [
    {
      type: String,
      enum: ['A', 'B', 'G', 'K', 'L', 'N', 'O', 'P', 'R', 'S', 'V', 'W', 'Y'],
    },
  ],
  alphanumeric: String,
  flag: Boolean,
  verticalPosition: { type: String, enum: ['ABOVE', 'BELOW', ''] },
});

const listedSpeciesSchema = new mongoose.Schema({
  map: Number,
  totalAdults: Number,
  totalFledges: Number,
  totalChicks: Number,
  time: String,
  habitatDescription: String,
  gps: [{ longitude: Number, latitude: Number }],
  crossStreet: String,
  sex: [Number],
  nesting: [String],
  behaviors: [String],
  bandTabs: [
    {
      topLeft: bandTabSchema,
      topRight: bandTabSchema,
      bottomLeft: bandTabSchema,
      bottomRight: bandTabSchema,
      code: String,
    },
  ],
  accuracyConfidence: String,
  additionalNotes: String,
});

const predatorSchema = new mongoose.Schema({
  species: { type: mongoose.Types.ObjectId, ref: 'Species' },
  count: Number,
});

const additionalSpeciesSchema = new mongoose.Schema({
  species: { type: mongoose.Types.ObjectId, ref: 'Species' },
  count: Number,
  notes: String,
});

const submissionSchema = new mongoose.Schema({
  segment: { type: mongoose.Types.ObjectId, ref: 'Segment' },
  date: Date,
  startTime: String,
  endTime: String,
  temperature: Number,
  cloudCover: Number,
  precipitation: String,
  windSpeed: Number,
  windDirection: String,
  tides: Number,
  habitatType: String,
  habitatWidth: String,
  listedSpecies: [
    {
      species: { type: mongoose.Types.ObjectId, ref: 'Species' },
      entries: [listedSpeciesSchema],
      injuredCount: Number,
    },
  ],
  additionalSpecies: {
    entries: [additionalSpeciesSchema],
    injuredCount: Number,
    beachCast: Number,
  },
  generalAdditionalFieldValues: [Object],
  predators: [predatorSchema],
  predatorsOther: String,
  humanActivityFieldValues: [Object],
  submitter: { type: String, ref: 'User' },
  status: {
    type: String,
    enum: ['UNSUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'EDITS_REQUESTED'],
    default: 'UNSUBMITTED',
  },
  submittedAt: Date,
  lastEditedAt: Date,
  isSubmittedByTrainee: { type: Boolean, default: false },
  sessionPartners: [{ type: String, ref: 'User' }],
  requestedEdits: {
    type: { requests: String, requestDate: Date },
    default: null,
  },
});

module.exports = mongoose.model('Submission', submissionSchema);
