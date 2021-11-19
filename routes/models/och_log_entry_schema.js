import mongoose from 'mongoose';

const {Schema} = mongoose;

const logEntry = new Schema({
  isMonitorLog: Boolean, // MonitorLog/CheckIn? Yes portion, but what is the BetterImpact thing?
    monitorLogId: String, // Log No. 04-15-21.OC9a.Stacey Chartier-Grable  -- generate from date,habitat code (survey Location/Segment), surveyor name
    title:  String, // Coastal Dune Habitat Survey Log
    surveyLocation: String, // OC9a
    surveyorName: String, // Stacey Chartier-Grable
    surveyDate: Date, // 4-15-21
    surveyStart: Date, // 8:15 am, get time   -> possible reduction but w/ consequences of time being different than date ie 2-day surveys
    surveyEnd: Date, // 11:15am ,get time 
    lastEdited: {type: Date, default:Date.now},
    
    temperature: Number,
    cloudCover: Number, // do they want int -> percentages? 0 = 0% , 1 = 33%, 2 = 66%, 3 = 100%
    precipitation: {
        type: String,
        enum:['None','Fog', 'Drizzle', 'Rain'],
        default: 'None'
    },
    wind: [{speed: Number, direction: String}],   // Speed and Direction: 6 / NW
    tides: Number,  // 0.1 feet

    overallHabitatType: String, // Sandy beach
  habitatWidth: String, // 300ft +
  mapIncluded: Boolean, // Yes/True
  surveyComplete: Boolean, // Yes/True
  additionalFields: Array, // ["Name;DataType", "Name2;DataType2"] Then for each string element in the array, add to schema
});
