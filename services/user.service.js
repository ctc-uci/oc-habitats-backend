const UserModel = require('../models/user.schema');
const Segment = require('../models/segment.schema');

const getProfile = async (profileId) => {
  return UserModel.findOne({ firebaseId: profileId }).populate('segments');
};

const getProfileByEmail = async (profileEmail) => {
  return UserModel.findOne({ email: profileEmail });
};

const getAllProfiles = async () => {
  return UserModel.find({}).populate('segments');
};

const getAllReducedProfiles = async () => {
  return UserModel.find({}, { firebaseId: 1, firstName: 1, lastName: 1, email: 1, _id: 0 });
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
  const results = { user: null, segment: null };
  results.user = await UserModel.findOneAndUpdate(
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

  results.segment = await Segment.findOneAndUpdate(
    { _id: segmentId },
    {
      $addToSet: {
        volunteers: userId,
      },
    },
    { new: true },
  );

  return results;
};

const deleteProfile = async (profileId) => {
  return UserModel.remove({ firebaseId: profileId });
};

const createProfile = async (user) => {
  const createdProfile = new UserModel({
    ...user,
    profileImage: { data: null, contentType: null },
  });
  return createdProfile.save();
};

// get user's assigned segments
const getAssignedSegments = async (firebaseId) => {
  return UserModel.findOne({ firebaseId }, { _id: 0, segments: 1 }).populate('segments');
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
  getAllReducedProfiles,
  getAssignedSegments,
  getUserSubmissions,
  updateProfile,
  assignSegment,
  deleteProfile,
  createProfile,
};
