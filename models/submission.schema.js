const mongoose = require('mongoose');

const singleBandSchema = new mongoose.Schema({
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
      topLeft: singleBandSchema,
      topRight: singleBandSchema,
      bottomLeft: singleBandSchema,
      bottomRight: singleBandSchema,
      code: String,
      manualCode: String,
    },
  ],
  sex: [Number],
  nesting: [String],
  behaviors: [String],
  additionalNotes: String,
  additionalQuestions: {
    type: Map,
    of: String,
  },
});

// const additionalSpeciesSchema = new mongoose.Schema({
//   count: Number,
//   notes: String,
// });

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
  listedSpecies: {
    type: Map,
    of: {
      entries: [listedSpeciesSchema],
      injuredCount: Number,
    },
  },
  additionalSpecies: {
    entries: {
      type: Map,
      of: Object,
    },
    injuredCount: Number,
    beachCast: Number,
  },
  generalAdditionalFields: {
    type: Map,
    of: String,
  },
  predators: {
    type: Map,
    of: Number,
  },
  predatorsOther: String,
  humanActivity: {
    type: Map,
    of: Number,
  },
  humanActivityOutreach: String,
  humanActivityOtherNotes: String,
  submitter: { type: String, ref: 'User' },
  submittedAt: Date,
  lastEditedAt: Date,
  status: {
    type: String,
    enum: ['UNSUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'EDITS_REQUESTED', 'RESUBMITTED'],
    default: 'UNSUBMITTED',
  },
  isSubmittedByTrainee: { type: Boolean, default: false },
  sessionPartners: [{ type: String, ref: 'User' }],
  requestedEdits: {
    type: {
      requests: String,
      requestDate: Date,
    },
    default: null,
  },
});

module.exports = mongoose.model('Submission', submissionSchema);
