// TODO:
// GET all submissions that are for the specific month
// FOR each submission in that month filter out
//            --- number of submissions that are considered completed - APPROVED
//            --- number of submissions that are considered not completed - UNSUBMITED, under review, edit requests
// Get number of unassigned segments
// Get number of monitor logs UNDER_REVIEW
// For each listed species, get count all the injured listed species
// Get count for all additional species
// Get count for all human activities
// Get count for all segments the number of adults, fledges, and chicks for each listed specie.

const express = require('express');

const router = express.Router();
const monitorLogService = require('../services/monitorLog.service');
// const segmentService = require('../services/section.segment.service');

// get own user
router.get('/me', async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const results = await monitorLogService.getSubmissionsByDates(startDate, endDate, null);
    console.log(results);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});
