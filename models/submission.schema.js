const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({
  value: Object,
});

const listedSpeciesSchema = new mongoose.Schema({
  species: { type: mongoose.Types.ObjectId, ref: 'Species' },
  totalAdults: Number,
  totalFledges: Number,
  totalChicks: Number,
  time: String,
  map: Number,
  habitatDescription: String,
  gps: [{ longitude: Number, latitude: Number }],
  crossStreet: String,
  bandTabs: [
    {
      bands: [
        {
          colors: [
            {
              type: String,
              enum: ['A', 'B', 'G', 'K', 'L', 'N', 'O', 'P', 'R', 'S', 'V', 'W', 'Y'],
            },
          ],
          alphanumeric: String,
          flag: Boolean,
          verticalPosition: { type: String, enum: ['ABOVE', 'BELOW'] },
        },
      ],
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
  total: Number,
  notes: String,
});

const submissionSchema = new mongoose.Schema({
  generalFieldValues: {
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
  },
  generalAdditionalFieldValues: [valueSchema],
  listedSpeciesEntries: [listedSpeciesSchema],
  additionalSpeciesEntries: [additionalSpeciesSchema],
  predatorFieldValues: [valueSchema],
  humanActivityFieldValues: [valueSchema],
  submitter: { type: mongoose.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['UNSUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'EDITS_REQUESTED'],
    default: 'UNSUBMITTED',
  },
  submittedAt: Date,
  lastEditedAt: Date,
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
