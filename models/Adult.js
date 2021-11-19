const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adultSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    type: {type: String, required:true},
    num: {type: Number, required:true},
    numFledges: {type: Number, default: 0 },
    numChicks: {type: Number, default: 0 },
    time: {type: Date, required:true },
    mapNumber: {type: Number, default: null},
    gps: {type:String, required:true}, //unsure if it's required
    crossLocations: {type: [String], required:true},
    habitatDescription: {type: [String], required:true},
    bands: {type:Boolean, required:true},
    sex: {type: String, required:true},
    nest: {type: String, required:true},
    behaviors: {type: [String], required:true}

});

const adult = mongoose.model("Adult", adultSchema);
module.exports = adult;
