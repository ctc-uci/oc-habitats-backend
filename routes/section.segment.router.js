const express = require('express');

const router = express.Router();
const sectionSegmentService = require('../services/section.segment.service');

// Create section
router.post('/section', async (req, res) => {
  try {
    const mongoResponse = await sectionSegmentService.createSection(req.body);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create segments for section
router.post('/segment', async (req, res) => {
  try {
    const newSegment = { ...req.body };
    delete newSegment.section;
    const mongoResponse = await sectionSegmentService.createSegment(newSegment, req.body.section);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update section
router.put('/section/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.updateSection(id, req.body);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update segment
router.put('/segment/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.updateSegment(id, req.body);
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

// Delete segment
router.delete('/segment/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.deleteSegment(id, req.body.sectionName);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get specific segment
router.get('/segment/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.getSegment(id);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all segments
router.get('/segments', async (_, res) => {
  try {
    const mongoResponse = await sectionSegmentService.getSegments();
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get specific section
router.get('/section/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.getSection(id);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get segments by section
router.get('/section/:id/segments', async (req, res) => {
  const { id } = req.params;
  try {
    const segments = await sectionSegmentService.getSegmentsBySection(id);
    res.status(200).send(segments[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
