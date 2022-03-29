/* eslint-disable no-console */
/* eslint-disable object-shorthand */
// Routes relating to accounts here

const express = require('express');
const userService = require('../services/user.service');

const userRouter = express.Router();
const admin = require('../firebase');

userRouter.use(express.json());

const isAlphaNumeric = (value) => {
  if (!/^[0-9a-zA-Z]+$/.test(value)) {
    throw new Error('User ID must be alphanumeric');
  }
};

// Get all users
userRouter.get('/:id', async (req, res) => {
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

// Get a specific user by ID
userRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Getting user with ID: ${id}`);
  try {
    const foundProfile = await userService.getProfile(id);
    console.log(foundProfile);
    if (!foundProfile) {
      res.status(400).send(`Profile ${id} doesn't exist`);
    } else {
      console.log(foundProfile);
      res.status(200).send(foundProfile);
    }
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
});

userRouter.delete('/:id', async (req, res) => {
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

// Delete a specific user by ID, both in Firebase and NPO DB
userRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    isAlphaNumeric(id); // ID must be alphanumeric

    // Firebase delete
    await admin.auth().deleteUser(id);
    // DB delete

    const deletedProfile = await userService.deleteProfile(id);
    if (deletedProfile.n === 0) {
      res.status(400).json({ message: `Profile ${id} not deleted` });
    } else {
      res.status(200).json({ message: `Profile ${id} was succesfully deleted` });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Add user to NPO database
userRouter.post('/create', async (req, res) => {
  const { email, userId, firstName, lastName, registered } = req.body;
  isAlphaNumeric(userId); // ID must be alphanumeric

  try {
    const profile = await userService.createProfile({
      userId,
      firstName,
      lastName,
      email,
      isAdmin: false,
      isSuperAdmin: false,
      isActive: true,
      isTrainee: true,
      profileImage: null,
      registered,
    });
    res.status(200).send(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// update profile
userRouter.post('/:id', async (req, res) => {
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

// Edit registered flag for a specific user
userRouter.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProfile = await userService.updateProfile(id, {
      $set: {
        registered: true,
      },
    });
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

module.exports = userRouter;
