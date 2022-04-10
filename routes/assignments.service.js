const express = require('express');
const dashboardService = require('../services/assignments.service');

const router = express.Router();

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

// get all of user's submitted monitor logs
// returns [ { userSubmissions: [Submission, Submission, ...] } ]
router.get('/submissions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userSubmissions = await dashboardService.getUserSubmissions(id);
    res.status(200).send(userSubmissions);
  } catch (err) {
    console.error(err);
    res.send(400).json({ message: err.message });
  }
});

// // get user's unsubmitted log drafts
// // returns [ { submissions: [Submission, Submission, ...] } ]
// router.get('/unsubmitted/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const unsubmittedDrafts = await dashboardService.getUnsubmittedDrafts(id);
//     res.status(200).send(unsubmittedDrafts);
//   } catch (err) {
//     console.error(err);
//     res.send(400).json({ message: err.message });
//   }
// });

module.exports = router;
