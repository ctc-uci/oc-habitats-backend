const express = require('express');
const userService = require('../services/user.service');
const admin = require('../firebase');

const router = express.Router();

const isAlphaNumeric = (value) => {
  if (!/^[0-9a-zA-Z]+$/.test(value)) {
    throw new Error('User ID must be alphanumeric');
  }
};

// get profile
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const foundProfile = await userService.getProfile(id);
    if (!foundProfile) {
      res.status(400).json({ message: `Profile ${id} doesn't exist` });
    } else {
      res.status(200).send(foundProfile);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

// get profiles
router.get('/', async (req, res) => {
  try {
    const allProfiles = await userService.getAllProfiles();
    res.status(200).send(allProfiles);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// delete profile
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    isAlphaNumeric(id); // ID must be alphanumeric
    // Firebase delete
    await admin.auth().deleteUser(id);

    // NPO DB delete
    const deletedProfile = await userService.deleteProfile(id);
    if (deletedProfile.n === 0) {
      res.status(400).json({ message: `Profile ${id} not deleted` });
    } else {
      res.status(200).json({ message: `Profile ${id} was succesfully deleted` });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// update profile
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProfile = await userService.updateProfile(id, req.body);
    if (updatedProfile.nModified === 0) {
      res.status(400).json({ message: `Profile ${id} not updated` });
    } else {
      res.status(200).send(updatedProfile);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// create profile
router.post('/', async (req, res) => {
  try {
    const profile = await userService.createProfile(req.body);
    res.status(200).send(profile);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
