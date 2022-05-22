/* eslint-disable no-param-reassign */
const express = require('express');

const router = express.Router();
const monitorLogService = require('../services/monitorLog.service');
const sectionSegmentService = require('../services/section.segment.service');

const setRangeQuery = (startDate, endDate) => {
  return {
    submittedAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };
};

// get own user
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);
    const query = setRangeQuery(startDate, endDate);
    const submissionsResults = await monitorLogService.getSubmissionsByMonth(query);
    query.status = 'SUBMITTED';
    const listedResults = await monitorLogService.getListedByMonth(query);
    const unassignedResults = await sectionSegmentService.getUnassigned();
    const adjustedResults = [...listedResults];
    adjustedResults.forEach((result) => {
      const dict = {};
      result.info.forEach((submission) => {
        if (submission.segment in dict) {
          dict[submission.segment].totalAdults += submission.entries.totalAdults;
          dict[submission.segment].totalFledges += submission.entries.totalFledges;
          dict[submission.segment].totalChicks += submission.entries.totalChicks;
        } else {
          dict[submission.segment] = {
            totalAdults: submission.entries.totalAdults,
            totalFledges: submission.entries.totalFledges,
            totalChicks: submission.entries.totalChicks,
          };
        }
      });
      result.segments = dict;
      delete result.info;
    });

    const finalResult = {
      listedSpeciesInfo: adjustedResults,
      otherInfo: submissionsResults,
      unassignedSegments: unassignedResults,
    };
    res.status(200).send(finalResult);
  } catch (err) {
    // console.log(err);
    res.status(400).json({ error: err });
  }
});

module.exports = router;
