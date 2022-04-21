/* eslint-disable no-console */
const express = require('express');
const userService = require('../services/user.service');
const admin = require('../firebase');
const { verifyToken } = require('./auth.router');

const router = express.Router();

// assign a segment to a user
router.post('/assignSegment', async (req, res) => {
  try {
    const { profileId, segmentId } = req.body;
    const updatedProfile = await userService.assingSegment(profileId, segmentId);
    if (updatedProfile.nModified === 0) {
      res.status(400).json({ message: `Segment not assigned` });
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

// get profile by id
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

// get profile by email
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
router.get('/segments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const assignedSegments = await userService.getAssignedSegments(id);
    res.status(200).send(assignedSegments);
  } catch (err) {
    console.error(err);
    res.send(400).json({ message: err.message });
  }
});

// get all of a user's monitor logs
router.get('/submissions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userSubmissions = await userService.getUserSubmissions(id);
    res.status(200).send(userSubmissions[0]);
  } catch (err) {
    console.error(err);
    res.send(400).json({ message: err.message });
  }
});

// delete profile
router.delete('/:id', async (req, res) => {
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
  }
});

// create profile in DB
router.post('/', async (req, res) => {
  try {
    const requiredFields = ['firebaseId', 'firstName', 'lastName', 'email', 'role'];
    if (
      !requiredFields.all((field) => {
        Object.prototype.hasOwnProperty.call(req.body, field);
      })
    ) {
      throw new Error('Missing required field');
    }

    const profile = await userService.createProfile(req.body);
    res.status(200).send(profile);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });

    const { email, password } = req.body;

    await admin.auth().createUser({
      email,
      emailVerified: true,
      password,
    });
  }
});

module.exports = router;
