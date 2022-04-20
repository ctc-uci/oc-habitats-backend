const express = require('express');
const monitorLogService = require('../services/monitorLog.service');
const { verifyToken } = require('./auth.router');

const router = express.Router();

// submission routes

// get submission
router.get('/submission/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const foundSubmission = await monitorLogService.getSubmission(id);
    if (!foundSubmission) {
      res.status(400).json({ message: `Submission ${id} doesn't exist` });
    } else {
      res.status(200).send(foundSubmission);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

// get submissions
router.get('/submissions', async (_, res) => {
  try {
    const allSubmissions = await monitorLogService.getSubmissions();
    res.status(200).send(allSubmissions);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// delete submission
router.delete('/submission/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSubmission = await monitorLogService.deleteSubmission(id);
    if (deletedSubmission.n === 0) {
      res.status(400).json({ message: `Submission ${id} not deleted` });
    } else {
      res.status(200).json({ message: `Submission ${id} was succesfully deleted` });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// update submission
router.post('/submission/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedSubmission = await monitorLogService.updateSubmission(id, req.body);
    if (updatedSubmission.nModified === 0) {
      res.status(400).json({ message: `Submission ${id} not updated` });
    } else {
      res.status(200).send(updatedSubmission);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// create submission
router.post('/submission', verifyToken, async (req, res) => {
  try {
    console.log(JSON.stringify(req.body, null, 4));
    const submission = await monitorLogService.createSubmission(req.body, req.firebaseId);
    res.status(200).send(submission);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// form routes

// get form
router.get('/form', async (_, res) => {
  try {
    const foundForm = await monitorLogService.getForm();
    if (!foundForm) {
      res.status(400).json({ message: `Error getting form` });
    } else {
      res.status(200).send(foundForm);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

// update form
router.post('/form', async (req, res) => {
  try {
    const updatedForm = await monitorLogService.updateForm(req.body);
    if (updatedForm.nModified === 0) {
      res.status(400).json({ message: `Form not updated` });
    } else {
      res.status(200).send(updatedForm);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
