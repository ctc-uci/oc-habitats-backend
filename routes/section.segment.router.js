const express = require('express');

const router = express.Router();
// Create section
router.post('/section', async (req, res) => {
  try {
    // do this?
  } catch (err) {
    // console.error(err);
    res.status(500).send(new Error('Operation failed'));
  }
});

// Create segments for section
router.post('/segment', async (req, res) => {
  try {
    // const mongoResponse = await lessonService.createLesson(req.body);
    // res.status(200).send(mongoResponse);
  } catch (err) {
    // console.error(err);
    res.status(500).send(new Error('Operation failed'));
  }
});

// Edit section
router.put('/section/:id', async (req, res) => {
  try {
    // const mongoResponse = await lessonService.createLesson(req.body);
    // res.status(200).send(mongoResponse);
  } catch (err) {
    // console.error(err);
    res.status(500).send(new Error('Operation failed'));
  }
});

// Delete section
router.delete('section/:id', async (req, res) => {
  try {
    // const mongoResponse = await lessonService.createLesson(req.body);
    // res.status(200).send(mongoResponse);
  } catch (err) {
    // console.error(err);
    res.status(500).send(new Error('Operation failed'));
  }
});

// Edit segment
router.put('/segment/:id', async (req, res) => {
  try {
    // const mongoResponse = await lessonService.createLesson(req.body);
    // res.status(200).send(mongoResponse);
  } catch (err) {
    // console.error(err);
    res.status(500).send(new Error('Operation failed'));
  }
});

// Delete segment
router.delete('/segment/:id', async (req, res) => {
  try {
    // const mongoResponse = await lessonService.createLesson(req.body);
    // res.status(200).send(mongoResponse);
  } catch (err) {
    // console.error(err);
    res.status(500).send(new Error('Operation failed'));
  }
});

// Get segment
router.get('/segment/:id', async (req, res) => {
  try {
    // const mongoResponse = await lessonService.createLesson(req.body);
    // res.status(200).send(mongoResponse);
  } catch (err) {
    // console.error(err);
    res.status(500).send(new Error('Operation failed'));
  }
});

// Get section
router.get('/section/:id', async (req, res) => {
  try {
    // const mongoResponse = await lessonService.createLesson(req.body);
    // res.status(200).send(mongoResponse);
  } catch (err) {
    // console.error(err);
    res.status(500).send(new Error('Operation failed'));
  }
});

module.exports = router;
