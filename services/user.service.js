const UserModel = require('../models/user.schema');

const getProfile = async (profileId) => {
  return UserModel.findOne({ firebaseId: profileId }).populate({
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

const updateProfile = async (profileId, updatedProfile) => {
  return UserModel.updateOne(
    { firebaseId: profileId },
    {
      $set: updatedProfile,
    },
  );
};

const assignSegment = async (userId, segmentId) => {
  return UserModel.findOneAndUpdate(
    { firebaseId: userId },
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
  return UserModel.remove({ firebaseId: profileId });
};

const createProfile = async (user) => {
  // if (!user.userId || !user.firstName || !user.lastName || !user.email) {
  //   throw new Error('Arguments missing in createUser');
  // }
  const createdProfile = new UserModel(user);
  return createdProfile.save();
};

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

module.exports = {
  getProfile,
  getProfileByEmail,
  getAllProfiles,
  getAssignedSegments,
  getUserSubmissions,
  updateProfile,
  assignSegment,
  deleteProfile,
  createProfile,
};
