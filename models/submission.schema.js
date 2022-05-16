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
  totalAdults: Number,
  totalFledges: Number,
  totalChicks: Number,
  time: String,
  map: Number,
  habitatDescription: String,
  gps: [{ longitude: String, latitude: String }],
  crossStreet: String,
  bandTabs: [
    {
      topLeft: bandTabSchema,
      topRight: bandTabSchema,
      bottomLeft: bandTabSchema,
      bottomRight: bandTabSchema,
      code: String,
    },
  ],
  sex: [Number],
  nesting: [String],
  behaviors: [String],
  additionalNotes: String,
});

const additionalSpeciesSchema = new mongoose.Schema({
  species: { type: mongoose.Types.ObjectId, ref: 'Species' },
  count: Number,
  notes: String,
});

const predatorSchema = new mongoose.Schema({
  species: { type: mongoose.Types.ObjectId, ref: 'Species' },
  count: Number,
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
  humanActivity: [Object],
  submitter: { type: String, ref: 'User' },
  submittedAt: Date,
  lastEditedAt: Date,
  status: {
    type: String,
    enum: ['UNSUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'EDITS_REQUESTED', 'RESUBMITTED'],
    default: 'UNSUBMITTED',
  },
  isSubmittedByTrainee: { type: Boolean, default: false },
  sessionPartners: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  requestedEdits: {
    type: {
      requests: String,
      requestDate: Date,
    },
    default: null,
  },
});

module.exports = mongoose.model('Submission', submissionSchema);
