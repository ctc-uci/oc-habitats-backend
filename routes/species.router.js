const express = require('express');

const router = express.Router();
const speciesService = require('../services/species.service');

// get species
router.get('/', async (req, res) => {
  try {
    const allSpecies = await speciesService.getAllSpecies();
    res.status(200).send(allSpecies);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// change species to listed/not listed
router.put('/:id/:newListing', async (req, res) => {
  const { id, newListing } = req.params;
  try {
    const changeListing = await speciesService.changeListing(id, newListing);
    if (changeListing.nModified === 0) {
      res.status(400).json({ message: `Species listing ${id} not updated` });
    } else {
      res.status(200).send(changeListing);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// add new species
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const species = await speciesService.addNewSpecies(req.body);
    res.status(200).send(species);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await speciesService.updateSpecies(id, req.body);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete species
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSpecies = await speciesService.deleteSpecies(id);
    if (deletedSpecies.n === 0) {
      res.status(400).json({ message: `Species ${id} not deleted` });
    } else {
      res.status(200).json({ message: `Species ${id} was succesfully deleted` });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
