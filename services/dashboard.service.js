const UserModel = require('../models/user.schema');

// TO-DO: filter so that only necessary fields are returned ?

/* VOLUNTEER DASHBOARD SERVICES */

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
            cond: { $eq: ['$$submissions_field.status', 'unsubmitted'] },
          },
        },
      },
    },
  ]);
};

// get recently submitted logs (6)
// returns [ { submissions: [Submission, Submission, ...] } ]
const getRecentSubmissions = async (firebaseId) => {
  return UserModel.aggregate([
    { $match: { firebaseId } },
    {
      $lookup: {
        from: 'submissions',
        localField: 'firebaseId',
        foreignField: 'submitter',
        as: 'recents',
      },
    },
    { $sort: { 'recents.submittedAt': -1 } },
    { $limit: 6 },
    {
      $project: {
        _id: 0,
        submissions: {
          $filter: {
            input: '$recents',
            as: 'recents_field',
            cond: { $not: { $eq: ['$$recents_field.status', 'unsubmitted'] } },
          },
        },
      },
    },
  ]);
};

module.exports = {
  getAssignedSegments,
  getRecentSubmissions,
  getUnsubmittedDrafts,
};
