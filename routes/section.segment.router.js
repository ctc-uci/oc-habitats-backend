const express = require('express');
const sectionSegmentService = require('../services/section.segment.service');
// const Segment = require('../models/segment.schema');

const router = express.Router();

// TODO: Create services in a new file
// Example
// testing
/*
router.post('/', async (req, res) => {
  try {
    const test = new Segment({ _id: 'testing', name: 'testing' });
    const mongoResponse = await test.save();
    // const mongoResponse = await sectionSegmentService.createSection(req.body);
    res.status(200).send(mongoResponse);
  } catch (err) {
    console.error(err);
    res.status(500).send(new Error('Operation failed'));
  }
});
*/

// Create section
router.post('/section', async (req, res) => {
  try {
    const mongoResponse = await sectionSegmentService.createSection(req.body);
    res.status(200).send(mongoResponse);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Create segments for section
router.post('/segment', async (req, res) => {
  try {
    // const mongoResponse = await sectionSegmentService.createSegment(req.body);
    // res.status(200).send(mongoResponse);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Edit section
router.put('/section/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.updateSection(req.body);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete section
router.delete('/section/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.deleteSection(id);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit segment
router.put('/segment/:id', async (req, res) => {
  try {
    // const mongoResponse = await sectionSegmentService.updateSegment(req.body);
    // res.status(200).send(mongoResponse);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete segment
router.delete('/segment/:id', async (req, res) => {
  try {
    // const mongoResponse = await sectionSegmentService.deleteSegment(req.body);
    // res.status(200).send(mongoResponse);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get segment
router.get('/segment/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.getSegment(id);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get section
router.get('/section/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.getSection(id);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
