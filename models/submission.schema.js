const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({
  value: Object,
});

const listedSpeciesSchema = new mongoose.Schema({
  speciesId: String,
  numAdults: Number,
  numFledges: Number,
  numChicks: Number,
  timeObserved: String,
  map: Number,
  habitatDescription: String,
  gps: [{ longitude: Number, latitude: Number }],
  crossStreet: String,
  bandsSexBehavior: [
    {
      topLeftBand: [String],
      topRightBand: [String],
      bottonLeftBand: [String],
      bottomRightBand: [String],
      bandingCode: String,
      sex: String,
      nestAndEggs: [String],
      behaviors: [String],
    },
  ],
  additionalNotes: String,
});

const submissionSchema = new mongoose.Schema({
  generalFieldValues: {
    surveySegment: { type: String, ref: 'Segment' },
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
    habitatWidth: Number,
  },
  generalAdditionalFieldValues: [valueSchema],
  listedSpeciesEntries: [listedSpeciesSchema],
  additionalSpeciesEntries: [valueSchema],
  predatorAdditionalFieldValues: [valueSchema],
  humanActivityAdditionalFieldValues: [valueSchema],
  submitter: String,
  status: {
    type: String,
    enum: ['unsubmitted', 'underReview', 'approved', 'editsRequested'],
    default: 'unsubmitted',
  },
  submittedAt: Date,
  lastEditedAt: Date,
  isSubmittedByTrainee: { type: Boolean, default: false },
  sessionPartners: [String],
  requestedEdits: String,
});

module.exports = mongoose.model('Submission', submissionSchema);
