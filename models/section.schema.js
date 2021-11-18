const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    geofence_area: {
      latitude: Number,
      longitude: Number,
    },
    segments: [
      {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true, unique: true },
        geofence_area: {
          latitude: Number,
          longitude: Number,
        },
        deadline: Date,
        volunteers: [
          {
            id: ObjectId,
            name: String,
          },
        ],
      },
    ],
  },
  { _id: false } // Enable custom _id for sections
);

module.exports = mongoose.model("Section", sectionSchema);
