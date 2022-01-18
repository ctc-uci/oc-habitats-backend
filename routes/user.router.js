const express = require('express');

const router = express.Router();

// get user profile
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // TODO: Check if profile exists
    // const profileExists = await userService.findProfile(id)

    const profileExists = true;
    if (!profileExists) {
      res.status(400).json({ message: `Profile ${id} doesn't exist` });
    }

    // TODO: Get profile based on ID
    // res.status(200).send(profile)
  } catch (err) {
    // console.error(err);
    res.status(400).json({ error: err });
  }
});

// get all profiles
router.get("/", async (req, res) => {
  try {
    // const allProfiles = await userService.getAllProfiles();
    // res.status(200).send(allProfiles);
  } catch (err) {
    // console.error(err);
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

// update profile
router.post('/:id', async (req, res) => {
  // const { id } = req.params;
  try {
    // TODO: Update profile
    // let mongoResponse = await userService.updateProfile(id, req.body)
  } catch (err) {
    // console.error(err);
    res.status(400).json({ error: err });
  }
});

// delete profile
router.delete('/id', async (req, res) => {
  // const { id } = req.params;
  try {
    // TODO: Delete profile
    // let deleted = await userService.deleteProfile(id, req.body)
    // res.status(200).send({ message: "Profile ${id} was succesfully deleted"});
  } catch (err) {
    // console.error(err);
    res.status(400).json({ error: err });
  }
});
module.exports = router;
