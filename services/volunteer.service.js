const UserModel = require('../models/user.schema');

// TO-DO: filter so that only necessary fields are returned ?

// get user's assigned segments
// returns [ {Segment}, {Segment} ]
const getAssignedSegments = async (firebaseId) => {
  return UserModel.aggregate([
    { $match: { firebaseId } },
    {
      $lookup: {
        from: 'segments',
        localField: 'segments',
        foreignField: '_id',
        as: 'user_segments',
      },
    },
    { $unwind: { path: '$user_segments' } },
    {
      $project: {
        _id: 0,
        user_segments: 1,
      },
    },
  ]);
};

// get unsubmitted monitor logs
// returns [ { drafts: [Submission, Submission, ...] } ]
const getUnsubmittedDrafts = async (firebaseId) => {
  return UserModel.aggregate([
    { $match: { firebaseId } },
    {
      $lookup: {
        from: 'submissions',
        localField: 'firebaseId',
        foreignField: 'submitter',
        as: 'drafts',
      },
    },
    {
      $project: {
        _id: 0,
        drafts: {
          $filter: {
            input: '$drafts',
            as: 'submissions_field',
            cond: { $eq: ['$$submissions_field.submitted', false] },
          },
        },
      },
    },
  ]);
};

// get recently submitted logs (6)
// returns [ {Submission}, {Submission} ]
const getRecentSubmissions = async (firebaseId) => {
  return UserModel.aggregate([
    { $match: { firebaseId } },
    {
      $lookup: {
        from: 'submissions',
        localField: 'firebaseId',
        foreignField: 'submitter',
        as: 'submissions',
      },
    },
    { $unwind: { path: '$submissions' } },
    { $sort: { 'submissions.submittedAt': -1 } },
    { $limit: 6 },
    {
      $project: {
        _id: 0,
        submissions: 1,
      },
    },
  ]);
};

module.exports = {
  getAssignedSegments,
  getRecentSubmissions,
  getUnsubmittedDrafts,
};
