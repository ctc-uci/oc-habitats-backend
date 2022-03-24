/* eslint-disable no-console */
const express = require('express');
const adminInviteService = require('../services/adminInvite.service');

const router = express.Router();

const isAlphaNumeric = (value) => {
  if (!/^[0-9a-zA-Z]+$/.test(value)) {
    throw new Error('AdminInvite ID must be alphanumeric');
  }
};

// get invite
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const foundInvite = await adminInviteService.getInvite(id);
    if (!foundInvite) {
      res.status(400).json({ message: `Invite ${id} doesn't exist` });
    } else {
      res.status(200).send(foundInvite);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

// get invites
router.get('/', async (req, res) => {
  try {
    const allInvites = await adminInviteService.getAllInvites();
    res.status(200).send(allInvites);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// delete invite
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    isAlphaNumeric(id); // ID must be alphanumeric

    // NPO DB delete
    const deletedInvite = await adminInviteService.deleteInvite(id);
    if (deletedInvite.n === 0) {
      res.status(400).json({ message: `Invite ${id} not deleted` });
    } else {
      res.status(200).json({ message: `Invite ${id} was succesfully deleted` });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// update invite
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedInvite = await adminInviteService.updateInvite(id, req.body);
    if (updatedInvite.nModified === 0) {
      res.status(400).json({ message: `Invite ${id} not updated` });
    } else {
      res.status(200).send(updatedInvite);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// create invite
router.post('/', async (req, res) => {
  try {
    const invite = await adminInviteService.createInvite(req.body);
    res.status(200).send(invite);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
