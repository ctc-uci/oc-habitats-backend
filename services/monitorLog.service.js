const Submission = require('../models/submission.schema');
const Form = require('../models/form.schema');

const getForm = async () => {
  return Form.findOne({ _id: 0 });
};

const updateForm = async (updatedForm) => {
  return Form.updateOne(
    { _id: 0 },
    {
      $set: updatedForm,
    },
  );
};

const updateSubmission = async (submissionId, updatedSubmission) => {
  return Submission.updateOne(
    { _id: submissionId },
    {
      $set: updatedSubmission,
    },
  );
};

const getSubmissions = async () => {
  return Submission.find();
};

const getSubmissionsByMonth = async (query) => {
  return Submission.aggregate([
    // Stage 1 - Get all submissions within date range
    {
      $match: query,
    },
    // Stage 2 - Group all submissions by status and push submission info, injured Terrestrial Count, and speeding vehicles count
    // into array separated by their status
    {
      $group: {
        _id: '$status',
        submissions: {
          $push: {
            submissionId: '$_id',
            date: '$date',
            segment: '$segment',
            submitter: '$submitter',
            injuredAdditional: '$additionalSpecies.injuredCount',
            speedingVehicles: { $sum: '$humanActivity.speedingVehicles' },
          },
        },
      },
    },
    // Stage 3 - Prepare segments for look up
    { $unwind: '$submissions' },
    // Stage 4 - Look up segment info
    {
      $lookup: {
        from: 'segments',
        localField: 'submissions.segment',
        foreignField: '_id',
        as: 'submissions.segment',
      },
    },
    // Stage 5 - Convert segment from array to segement
    { $unwind: '$submissions.segment' },
    // Stage 6  Look up volunteers inside segments
    {
      $lookup: {
        from: 'users',
        localField: 'submissions.segment.volunteers',
        foreignField: '_id',
        as: 'submissions.segment.volunteers',
      },
    },
    // Stage 8 - Group data by submission type via _id
    {
      $group: {
        _id: '$_id',
        submissions: {
          $push: '$submissions',
        },
      },
    },
    // // Stage 9 - Sort Objects containing array of submissions by their status
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
};

const getListedByMonth = async (query) => {
  return Submission.aggregate([
    // Stage 1 - Get all submissions within date range
    {
      $match: query,
    },
    // Stage 2 - Get segment info
    {
      $lookup: {
        from: 'segments',
        localField: 'segment',
        foreignField: '_id',
        as: 'segment',
      },
    },
    // Stage 3 - prepare segment for lookup
    { $unwind: '$segment' },
    // Stage 4 - prepare listedSpecies for lookup
    { $unwind: '$listedSpecies' },
    // Stage 5 - lookup each listed species info
    {
      $lookup: {
        from: 'species',
        localField: 'listedSpecies.species',
        foreignField: '_id',
        as: 'listedSpecies.species',
      },
    },
    // Stage 6 - turn each listed specie as an object
    {
      $unwind: '$listedSpecies.species',
    },
    // Stage 7 - prepare each listed specie entry for look up
    {
      $unwind: '$listedSpecies.entries',
    },
    // Stage 8 - Group listed species by name and get their injured count
    {
      $group: {
        _id: '$listedSpecies.species.name',
        info: {
          $push: {
            entries: '$listedSpecies.entries',
            segment: '$segment.segmentId',
          },
        },
        injured: { $sum: '$listedSpecies.injuredCount' },
      },
    },
    // Stage 9 - sort data by listed specie name
    {
      $sort: { _id: 1 },
    },
  ]);
};

const deleteSubmission = async (submissionId) => {
  return Submission.remove({ _id: submissionId });
};

const createSubmission = async (submission, user) => {
  const createdSubmission = new Submission({
    ...submission,
    segment: submission.segment || null,
    submitter: user,
    submittedAt: new Date(),
    lastEditedAt: new Date(),
  });
  return createdSubmission.save();
};

module.exports = {
  getForm,
  updateForm,
  updateSubmission,
  deleteSubmission,
  // getSubmission,
  getSubmissionsByMonth,
  getListedByMonth,
  getSubmissions,
  createSubmission,
};
