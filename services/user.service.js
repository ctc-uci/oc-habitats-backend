const UserModel = require('../models/user.schema');

const getProfile = async (profileId) => {
  return UserModel.findOne({ _id: profileId }).populate({
    path: 'segments',
    model: 'Segment',
  });
};

const getProfileByEmail = async (profileEmail) => {
  return UserModel.findOne({ email: profileEmail });
};

const getAllProfiles = async () => {
  return UserModel.find({}).populate({ path: 'segments', model: 'Segment' });
};

const getAllReducedProfiles = async () => {
  return UserModel.find({}, { firstName: 1, lastName: 1, email: 1, _id: 1 });
};

const updateProfile = async (profileId, updatedProfile) => {
  return UserModel.updateOne(
    { _id: profileId },
    {
      $set: updatedProfile,
    },
  );
};

const assignSegment = async (userId, segmentId) => {
  return UserModel.findOneAndUpdate(
    { _id: userId },
    {
      $addToSet: {
        segments: segmentId,
      },
    },
    {
      new: true,
    },
  );
};

const deleteProfile = async (profileId) => {
  return UserModel.remove({ _id: profileId });
};

const createProfile = async (user) => {
  const createdProfile = new UserModel(user);
  return createdProfile.save();
};

// get user's assigned segments
// returns [ { user_segments: [{Segment}, {Segment}, ...] } ]
const getAssignedSegments = async (firebaseId) => {
  return UserModel.aggregate([
    { $match: { _id: firebaseId } },
    {
      $lookup: {
        from: 'segments',
        localField: 'segments',
        foreignField: '_id',
        as: 'user_segments',
      },
    },
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
    { $match: { _id: firebaseId } },
    {
      $lookup: {
        from: 'submissions',
        localField: '_id',
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

module.exports = {
  getProfile,
  getProfileByEmail,
  getAllProfiles,
  getAllReducedProfiles,
  getAssignedSegments,
  getUserSubmissions,
  updateProfile,
  assignSegment,
  deleteProfile,
  createProfile,
};
