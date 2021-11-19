import adultSchema from "./Adult.schema";
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formSchema = new Schema({
  _id: {type: Schema.Types.ObjectId},
  surveyLocation: {type: String, required:true},
  names: {type: [String], required: true, default: undefined},
  date: {type: Date, required:true},
  startTime:  {type: Date, required:true},
  endTime:  {type: Date, required:true},
  temperature: {type: Number, required:true},
  cloudCover: {type: Number, enum: [0, 1, 2, 3], required:true},
  precipitation: {type: String, enum: ['None', 'Fog', 'Drizzle', 'Rain'], required:true},
  windSpeed: {type: Number, required:true},
  windDirecton: {type: String, required:true},
  tide: {type: Number, required: true},
  habitatType: {type: String, required: true},
  habitatWidth: {type: String, required: true},
  mapIncluded: {type: Boolean, required: true},
  completed: {type:Boolean, required: true},
  snplAdults: {type: Number, required:true},
  snplFledges: {type: Number, required:true},
  snplChicks: {type: Number, required:true},
  clteAdults: {type: Number, required:true},
  clteFledges: {type: Number, required:true},
  clteChicks: {type: Number, required:true},
  adults:{type: [adult]},
  humanSitting: {type: Number, required:true},
  humanMoving: {type: Number, required:true},
  sports: {type: Number, required:true},
  crows: {type: Number, required:true},
  ravens: {type: Number, required:true},
  raptors: {type: Number, required:true},
  dogLeash: {type: Number, required:true},
  dogNoLeash: {type: Number, required:true},
  vehicles: {type: Number, required:true},
  equipAtv: {type: Number, required:true},
  bikes: {type: Number, required:true},
  surfers: {type: Number, required:true},
  other: {type: Number, required:true},
  outreachNotes: {type: String},
  notes: {type: String},
  speciesTotal: {type: Map, of: Number},
  species: {type: [String]},
  footnotes: {type: Map, of: String},
  sections: {type: [Sections]}
}, {
  timestamps: true
});

const Form = mongoose.model("Form", formSchema);
module.exports = Form;
