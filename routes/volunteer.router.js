const express = require('express');
const volunteerService = require('../services/volunteer.service');

const router = express.Router();

// get user's assigned segments
// returns [ {Segment}, {Segment} ]
router.get('/segments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const assignedSegments = await volunteerService.getAssignedSegments(id);
    res.status(200).send(assignedSegments);
  } catch (err) {
    console.error(err);
    res.send(400).json({ message: err.message });
  }
});

// get user's 6 recent monitor log submissions
// returns [ { drafts: [Submission, Submission, ...] } ]
router.get('/recents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const recentSubmissions = await volunteerService.getRecentSubmissions(id);
    res.status(200).send(recentSubmissions);
  } catch (err) {
    console.error(err);
    res.send(400).json({ message: err.message });
  }
});

// get user's unsubmitted log drafts
// returns [ {Submission}, {Submission} ]
router.get('/unsubmitted/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const unsubmittedDrafts = await volunteerService.getUnsubmittedDrafts(id);
    res.status(200).send(unsubmittedDrafts);
  } catch (err) {
    console.error(err);
    res.send(400).json({ message: err.message });
  }
});

module.exports = router;
