const express = require('express');
const volunteerService = require('../services/volunteer.service');

const router = express.Router();

// get user's assigned segments
router.get('/segments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const foundSegments = await volunteerService.getAssignedSegments(id);
    res.status(200).send(foundSegments);
  } catch (err) {
    console.error(err);
    res.send(400).json({ message: err.message });
  }
});

router.get('/recents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const foundRecents = await volunteerService.getRecentSubmissions(id);
    res.status(200).send(foundRecents);
  } catch (err) {
    console.error(err);
    res.send(400).json({ message: err.message });
  }
});

module.exports = router;
