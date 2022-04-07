const express = require('express');
const fs = require('fs');
const userService = require('../services/user.service');
const upload = require('../middleware/upload');

const router = express.Router();

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
// eslint-disable-next-line no-unused-vars
router.put('/:id', upload.single('profileImage'), async (req, res) => {
  const { id } = req.params;
  const updatedUser = { ...req.body };
  if (req.file) {
    updatedUser.profileImage = {
      data: fs.readFileSync(`${req.file.path}`),
      contentType: `${req.file.mimetype}`,
    };
  }

  try {
    const updatedProfile = await userService.updateProfile(id, updatedUser);
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
      }
    });
    if (updatedProfile.matchedCount === 0) {
      res.status(400).json({ message: `Profile ${id} does not exists` });
    } else if (updatedProfile.modifiedCount === 0 && updatedProfile.matchedCount === 1) {
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
