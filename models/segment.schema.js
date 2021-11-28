const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  _id: String,
  name: {type: String, required: true, unique: true},
  description: String,
  geofence_area: String,
  deadline: Date,
  volunteers: [
    {
      id: mongoose.Schema.Types.ObjectId,
      name: String,
    },
  ],
});

module.exports = mongoose.model('Segment', segmentSchema);
