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
            segment: '$segment',
            submitter: '$submitter',
            injuredAdditional: { $sum: '$additionalSpecies.injuredCount' },
            speedingVehicles: { $sum: '$humanActivity.speedingVehicles' },
          },
        },
      },
    },
    // Stage 3 - Look up segment info
    {
      $lookup: {
        from: 'segments',
        localField: 'submissions.segment',
        foreignField: '_id',
        as: 'segments',
      },
    },
    // Stage 4 - prepare segments for lookup
    { $unwind: '$segments' },
    // Stage 4  Look up volunteers inside segments
    {
      $lookup: {
        from: 'users',
        localField: 'segments.volunteers',
        foreignField: '_id',
        as: 'segments.volunteers',
      },
    },
    // Stage 5 - Reformat data + get injured terrestrial count for each entry + speedingVehicle Count
    {
      $project: {
        _id: 0,
        category: '$_id',
        id: '$segments._id',
        segmentId: '$segments.segmentId',
        assigned: '$segments.volunteers',
        injuredTerrestrial: { $sum: '$submissions.injuredAdditional' },
        speedingVehicles: { $sum: '$submissions.speedingVehicles' },
      },
    },
    // Stage 6 - Group data by category
    {
      $group: {
        _id: '$category',
        submissions: {
          $push: {
            id: '$id',
            segmentId: '$segmentId',
            assigned: '$assigned',
            injuredTerrestrial: '$injuredTerrestrial',
            speedingVehicles: '$speedingVehicles',
          },
        },
      },
    },
    // Stage 7 - get the first submission because contains total injured terrestial and speeding vehicle for that segment
    // (trying to flatten data)
    {
      $project: {
        _id: 1,
        submissions: 1,
        counts: { $first: '$submissions' },
      },
    },
    // Stage 8 - Flatten out count data
    {
      $project: {
        _id: 1,
        submissions: 1,
        injuredTerrestrial: '$counts.injuredTerrestrial',
        speedingVehicles: '$counts.speedingVehicles',
      },
    },
    // Stage 9 - remove redundant data
    { $unset: ['submissions.injuredTerrestrial', 'submissions.speedingVehicles'] },
    // Stage 10 - Sort Objects containing array of submissions by their status
    {
      $sort: {
        category: 1,
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
