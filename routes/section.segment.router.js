const express = require('express');

const router = express.Router();
const sectionSegmentService = require('../services/section.segment.service');

// Create section
router.post('/section', async (req, res) => {
  try {
    const newSection = { ...req.body };
    delete newSection.segmentName;
    const mongoResponse = await sectionSegmentService.createSection(
      newSection,
      req.body.segmentName,
    );
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create segments for section
router.post('/segment', async (req, res) => {
  try {
    const mongoResponse = await sectionSegmentService.createSegment(req.body);
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
router.get('/segments', async (req, res) => {
  try {
    const mongoResponse = await sectionSegmentService.getSegments();
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all unassigned segments
router.get('/unassignedSegments', async (req, res) => {
  try {
    const mongoResponse = await sectionSegmentService.getUnassignedSegments();
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
    res.status(200).send(segments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
