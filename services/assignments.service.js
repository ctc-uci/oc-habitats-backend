const UserModel = require('../models/user.schema');

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

// get a user's submitted logs
// returns [ { submissions: [Submission, Submission, ...] } ]
const getUserSubmissions = async (firebaseId) => {
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
    { $sort: { 'submissions.submittedAt': -1 } },
    {
      $project: {
        _id: 0,
        submissions: 1,
      },
    },
  ]);
};

// // get unsubmitted monitor logs
// // returns [ { drafts: [Submission, Submission, ...] } ]
// const getUnsubmittedDrafts = async (firebaseId) => {
//   return UserModel.aggregate([
//     { $match: { firebaseId } },
//     {
//       $lookup: {
//         from: 'submissions',
//         localField: 'firebaseId',
//         foreignField: 'submitter',
//         as: 'drafts',
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         drafts: {
//           $filter: {
//             input: '$drafts',
//             as: 'submissions_field',
//             cond: { $eq: ['$$submissions_field.status', 'unsubmitted'] },
//           },
//         },
//       },
//     },
//   ]);
// };

module.exports = {
  getAssignedSegments,
  getUserSubmissions,
};
