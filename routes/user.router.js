/* eslint-disable no-console */
const express = require('express');
const fs = require('fs');
const userService = require('../services/user.service');
const upload = require('../middleware/upload');
const admin = require('../firebase');
const { verifyToken } = require('./auth.router');

const router = express.Router();

// sets segment assignments for a user to segmentIds array
router.put('/setSegmentAssignments', verifyToken, async (req, res) => {
  try {
    const { profileId, segmentIds } = req.body;
    const updatedProfile = await userService.setSegmentAssignments(profileId, segmentIds);
    if (updatedProfile.nModified === 0) {
      res.status(400).json({ message: `Segments not set` });
    } else {
      res.status(200).send(updatedProfile);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// get own user
router.get('/me', verifyToken, async (req, res) => {
  const { firebaseId } = req;
  try {
    const foundProfile = await userService.getProfile(firebaseId);
    if (!foundProfile) {
      res.status(400).json({ message: `Profile ${firebaseId} doesn't exist` });
    } else {
      res.status(200).send(foundProfile);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

// get own user
router.get('/me', verifyToken, async (req, res) => {
  const { firebaseId } = req;
  try {
    const foundProfile = await userService.getProfile(firebaseId);
    if (!foundProfile) {
      res.status(400).json({ message: `Profile ${firebaseId} doesn't exist` });
    } else {
      res.status(200).send(foundProfile);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

// get other users' name and email
router.get('/monitorPartners', verifyToken, async (req, res) => {
  const { firebaseId } = req;
  try {
    const profiles = await userService.getAllReducedProfiles();
    res.status(200).json(profiles.filter((profile) => profile._id !== firebaseId));
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

// get a user's submissions
router.get('/userSubmissions', verifyToken, async (req, res) => {
  const { firebaseId } = req;
  try {
    const submissions = await userService.getUserSubmissions(firebaseId);
    res.status(200).send(submissions);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

// get profile by id
router.get('/:id', verifyToken, async (req, res) => {
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

// get profile by email (used for forgot password)
router.get('/email/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const foundProfile = await userService.getProfileByEmail(email);
    if (!foundProfile) {
      res.status(400).json({ message: `Profile with email ${email} doesn't exist` });
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

// get user's assigned segments
router.get('/segments/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const assignedSegments = await userService.getAssignedSegments(id);
    res.status(200).send(assignedSegments);
  } catch (err) {
    console.error(err);
    res.send(400).json({ message: err.message });
  }
});

// delete profile
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
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
router.put('/update/:id', verifyToken, upload.single('profileImage'), async (req, res) => {
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
    // if file uploaded remove it after calling mongo
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        console.error(err);
      });
    }

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

router.post('/firebase', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().createUser({
      email,
      emailVerified: true,
      password,
    });
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
});

// create profile in DB
router.post('/', async (req, res) => {
  try {
    const requiredFields = ['firebaseId', 'firstName', 'lastName', 'email', 'role'];
    if (!requiredFields.every((field) => Object.prototype.hasOwnProperty.call(req.body, field))) {
      throw new Error('Missing required field');
    }
    req.body._id = req.body.firebaseId;
    delete req.body.firebaseId;
    const profile = await userService.createProfile(req.body);
    res.status(200).send(profile);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
