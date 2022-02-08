const { v4: uuid } = require('uuid');
const SpeciesModel = require('../models/species.schema');

const getAllSpecies = async () => {
  return SpeciesModel.find({});
};

const changeListing = async (speciesId) => {
  const changedListing = !SpeciesModel.findById(speciesId).isAssigned;
  return SpeciesModel.findByIdAndUpdate(speciesId, { isAssigned: changedListing });
};

const addNewSpecies = async (species) => {
  if (!species.name || !species.code) {
    throw new Error('Arguments missing in species');
  }
  const newSpecies = new SpeciesModel({
    _id: uuid(),
    name: species.name,
    code: species.code,
    isEndangered: species.isEndangered,
    isAssigned: species.isAssigned,
  });
  return newSpecies.save();
};

const deleteSpecies = async (speciesId) => {
  return SpeciesModel.findByIdAndDelete(speciesId);
};

module.exports = {
  getAllSpecies,
  changeListing,
  addNewSpecies,
  deleteSpecies,
};
