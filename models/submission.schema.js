const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({
  value: Object,
});

const listedSpeciesSchema = new mongoose.Schema({
  map: Number,
  numAdults: Number,
  numFledges: Number,
  numChicks: Number,
  timeObserved: String,
  habitatDescription: String,
  gps: [{ longitude: Number, latitude: Number }],
  crossStreet: String,
  numMaleAdults: Number,
  numMaleFledges: Number,
  numMaleChicks: Number,
  numFemaleAdults: Number,
  numFemaleFledges: Number,
  numFemaleChicks: Number,
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
  accuracyConfidence: String,
  additionalNotes: String,
  injured: String,
  speciesId: String,
});

const predatorSchema = new mongoose.Schema({
  numCrows: { type: Number, default: 0 },
  numRavens: { type: Number, default: 0 },
  numRaptors: { type: Number, default: 0 },
  numHorse: { type: Number, default: 0 },
  numCoyote: { type: Number, default: 0 },
  numFox: { type: Number, default: 0 },
  numCat: { type: Number, default: 0 },
  otherPredators: { type: String, default: '' },
});

const nonListedSchema = new mongoose.Schema({
  species: [{ name: String, total: Number, additionalNotes: String }],
  injured: String,
  beachCast: String,
});

const humanActivitySchema = new mongoose.Schema({
  beachActivity: { type: String, default: '' },
  waterActivity: { type: String, default: '' },
  airborneActvity: { type: String, default: '' },
  speedingVehicles: { type: String, default: '' },
  nonSpeedingVehicles: { type: String, default: '' },
  offLeashAnimals: { type: String, default: '' },
  onLeashAnimals: { type: String, default: '' },
  outReach: { type: String, default: '' },
  otherNotes: { type: String, default: '' },
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
  generalAdditionalFieldValues: valueSchema,
  listedSpeciesEntries: [listedSpeciesSchema],
  nonListedSpeciesEntries: [nonListedSchema],
  predatorEntries: predatorSchema,
  humanActivityEntries: humanActivitySchema,
  additionalSpeciesEntries: [valueSchema],
  predatorAdditionalFieldValues: valueSchema,
  humanActivityAdditionalFieldValues: valueSchema,
  submitter: String,
  status: {
    type: String,
    enum: ['UNSUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'EDITS_REQUESTED'],
    default: 'UNSUBMITTED',
  },
  submittedAt: Date,
  lastEditedAt: Date,
  isSubmittedByTrainee: { type: Boolean, default: false },
  sessionPartners: [String],
  requestedEdits: {
    type: { requests: String, requestDate: Date },
    default: null,
  },
});

module.exports = mongoose.model('Submission', submissionSchema);
