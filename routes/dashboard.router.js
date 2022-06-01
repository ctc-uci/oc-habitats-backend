/* eslint-disable no-param-reassign */
const express = require('express');

const router = express.Router();
const monitorLogService = require('../services/monitorLog.service');
const sectionSegmentService = require('../services/section.segment.service');

// Get query for current first day of the month + last day of the month
const getDateQuery = () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);
  return {
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };
};

router.get('/dashboard', async (req, res) => {
  try {
    const query = getDateQuery();
    // Get all the submissions for the month
    const submissionsResults = await monitorLogService.getSubmissionsByMonth(query);
    // query.status = 'APPROVED';
    // Get the listed species for submitted monitor logs
    const listedResults = await monitorLogService.getListedByMonth(query);
    // Get currently unassigned segments
    const unassignedResults = await sectionSegmentService.getUnassigned();

    // Process listed species into easier format for front end
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

    let completedSubmissions = null;
    const emergentIssueData = {
      injuredTerrestrial: { title: 'Injured Terrestrial Wildlife', count: 0, segments: [] },
      speedingVehicles: { title: 'Injured Speeding Vehicles', count: 0, segments: [] },
    };

    if (submissionsResults.length) {
      // Split completed submissions from uncompleted submissions. submissionResults sorted so can check first element

      // eslint-disable-next-line no-underscore-dangle
      if (submissionsResults[0]._id === 'APPROVED') {
        completedSubmissions = submissionsResults.shift();
      }

      // Get count + segments of injuredTerrestrial and speedingVehicle  for APPROVED submissions
      completedSubmissions.submissions.forEach((submission) => {
        if (submission.injuredAdditional > 0) {
          emergentIssueData.injuredTerrestrial.count += submission.injuredAdditional;
          emergentIssueData.injuredTerrestrial.segments.push({
            segmentId: submission.segment.segmentId,
            date: submission.date,
            monitorLogId: submission.submissionId,
          });
        }

        if (submission.speedingVehicles > 0) {
          emergentIssueData.speedingVehicles.count += submission.speedingVehicles;
          emergentIssueData.speedingVehicles.segments.push({
            segmentId: submission.segment.segmentId,
            date: submission.date,
            monitorLogId: submission.submissionId,
          });
        }
      });
    }

    // Get Count of unCompleted submissions
    let notCompletedCount = 0;
    submissionsResults.forEach((submissionType) => {
      notCompletedCount += submissionType.submissions.length;
    });

    // Place all results into obj
    // listedSpeciesInfo: includes Listed Species' Adult, Fledge, and Chick Count per segment + Listed Injured Count
    // completedSubmissions: includes all approved submissions, their segment + volunteer + submission info
    // uncompletedSubmissions: includes all non-approved submissions, their segment + volunteer + submission info
    // unassignedSegments: includes segments that are unassigned currently
    const finalResult = {
      listedSpeciesInfo: adjustedResults,
      completedSubmissions,
      uncompletedSubmissions: submissionsResults,
      emergentIssueData,
      notCompletedCount,
      unassignedSegments: unassignedResults,
    };
    res.status(200).send(finalResult);
  } catch (err) {
    // console.log(err);
    console.log('err', err);
    res.status(400).json({ error: err });
  }
});

module.exports = router;
