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

// update profile picture
// TODO:
// Update Schema For Picture? Note: If we do this, this whole function is unnecessary
// Figure out what image type is.
router.put('/picture', async (req, res) => {
  // const { picture } = req.params;
  try {
    // Do something
  } catch (err) {
    // console.error(err);
    res.status(400).json({ error: err });
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await userService.updateProfile(id, req.body);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
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
