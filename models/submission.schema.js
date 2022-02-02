const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({
  value: Object,
});

const listedSpeciesSchema = new mongoose.Schema({
  speciesId: mongoose.Schema.Types.ObjectId, // doesn't exist
  numAdults: Number,
  numFledges: Number,
  numChicks: Number,
  timeObserved: String,
  map: Number,
  habitatDescription: String,
  gps: [{ longitude: Number, latitude: Number }],
  crossStreet: String, // ????
  bandsSexBehavior: [
    {
      // to do: bands
      bandingCode: String,
      sex: String,
      nestAndEggs: String,
      behaviors: String,
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
  submitter: String,
  sessionPartners: [String],
});

module.exports = mongoose.model('Submission', submissionSchema);
