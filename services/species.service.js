const SpeciesModel = require('../models/species.schema');

const getAllSpecies = async () => {
  return SpeciesModel.find({});
};

const changeListing = async (speciesId, newListing) => {
  return SpeciesModel.findByIdAndUpdate(speciesId, { isEndangered: newListing });
};

const addNewSpecies = async (species) => {
  if (!species.name || !species.code) {
    throw new Error('Arguments missing in species');
  }
  const newSpecies = new SpeciesModel({
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
