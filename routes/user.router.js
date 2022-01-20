const express = require('express');
const userService = require('../services/user.service');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const foundProfile = await userService.getProfile(id);
    if (!foundProfile) {
      res.status(400).json({ message: `Profile ${id} doesn't exist` });
    }
    res.status(200).send(foundProfile);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

router.get('/', async (req, res) => {
  try {
    const allProfiles = await userService.getAllProfiles();
    res.status(200).send(allProfiles);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProfile = await userService.deleteProfile(id);
    if (deletedProfile.n === 0) {
      return res.status(400).json({ message: `Profile: ${id} not deleted` });
    }
    res.status(200).send({ message: `Profile ${id} was succesfully deleted` });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

module.exports = router;
