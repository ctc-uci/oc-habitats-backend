const SpeciesModel = require('../models/species.schema');

const options = { new: true };

const getAllSpecies = async () => {
  return SpeciesModel.find({});
};

const changeListing = async (speciesId, newListing) => {
  return SpeciesModel.findByIdAndUpdate(speciesId, { isListed: newListing });
};

const addNewSpecies = async (species) => {
  if (!species.name || !species.code) {
    throw new Error('Arguments missing in species');
  }
  const newSpecies = new SpeciesModel({
    name: species.name,
    code: species.code,
    isListed: species.isListed,
    isPredator: species.isPredator,
  });
  return newSpecies.save();
};

const updateSpecies = async (speciesId, updatedSpecies) => {
  return SpeciesModel.findByIdAndUpdate(speciesId, updatedSpecies, options);
};

const deleteSpecies = async (speciesId) => {
  return SpeciesModel.findByIdAndDelete(speciesId);
};

module.exports = {
  getAllSpecies,
  changeListing,
  addNewSpecies,
  updateSpecies,
  deleteSpecies,
};
