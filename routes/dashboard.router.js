const express = require('express');
const dashboardService = require('../services/dashboard.service');

const router = express.Router();

/* VOLUNTEER DASHBOARD ROUTES */

// get user's assigned segments
// returns [ {Segment}, {Segment} ]
router.get('/segments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const assignedSegments = await dashboardService.getAssignedSegments(id);
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
    const recentSubmissions = await dashboardService.getRecentSubmissions(id);
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
    const unsubmittedDrafts = await dashboardService.getUnsubmittedDrafts(id);
    res.status(200).send(unsubmittedDrafts);
  } catch (err) {
    console.error(err);
    res.send(400).json({ message: err.message });
  }
});

module.exports = router;
