const express = require('express');

const router = express.Router();
const sectionSegmentService = require('../services/section.segment.service');
const { verifyToken } = require('./auth.router');

// Create section
router.post('/section', verifyToken, async (req, res) => {
  try {
    const mongoResponse = await sectionSegmentService.createSection(req.body);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create segments for section
router.post('/segment', verifyToken, async (req, res) => {
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
router.put('/section/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.updateSection(id, req.body);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update segment; include section in body
router.put('/segment/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const updatedSegment = { ...req.body };
  delete updatedSegment.section;
  try {
    const mongoResponse = await sectionSegmentService.updateSegment(
      id,
      updatedSegment,
      req.body.section,
    );
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete section
router.delete('/section/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.deleteSection(id);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete segment
router.delete('/segment/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.deleteSegment(id, req.body.sectionId);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get specific segment
router.get('/segment/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.getSegment(id);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all segments
router.get('/segments', verifyToken, async (_, res) => {
  try {
    const mongoResponse = await sectionSegmentService.getSegments();
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all sections
router.get('/sections', verifyToken, async (_, res) => {
  try {
    const sections = await sectionSegmentService.getSections();
    res.status(200).send(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all sections, with volunteerData populated
router.get('/populatedSections', verifyToken, async (_, res) => {
  try {
    const sections = await sectionSegmentService.getSections(true);
    res.status(200).send(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get specific section
router.get('/section/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const mongoResponse = await sectionSegmentService.getSection(id);
    res.status(200).send(mongoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get unassigned segments
router.get('/segments/unassigned', async (_, res) => {
  try {
    const unassigned = await sectionSegmentService.getUnassigned();
    res.status(200).send(unassigned);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
