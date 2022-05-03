const mongoose = require('mongoose');

const UserModel = require('../models/user.schema');
const Segment = require('../models/segment.schema');
const Submissions = require('../models/submission.schema');

const getProfile = async (profileId) => {
  return UserModel.findOne({ _id: profileId }).populate('segments');
};

const getProfileByEmail = async (profileEmail) => {
  return UserModel.findOne({ email: profileEmail });
};

const getAllProfiles = async () => {
  return UserModel.find({}).populate('segments');
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

const setSegmentAssignments = async (userId, segmentIds) => {
  const results = { user: null, segments: null };

  // Perform queries in transaction so changes are not made if
  // an error occurs
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // Check that all segments exist and there are no duplicates
      const validSegments = await Segment.count({ _id: { $in: segmentIds } });
      if (validSegments !== segmentIds.length) throw new Error('Invalid segmentIds');

      // Remove userId from all currently assigned segments
      await Segment.updateMany(
        { volunteers: userId },
        {
          $pull: {
            volunteers: userId,
          },
        },
      );

      // Add userId to all segments in segmentIds
      await Segment.updateMany(
        { _id: { $in: segmentIds } },
        {
          $addToSet: {
            volunteers: userId,
          },
        },
      );

      // Overwrite UserModel.segments with new value
      results.user = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            segments: segmentIds,
          },
        },
        { new: true },
      );
    });
  } finally {
    session.endSession();
  }

  // Fetch updated segments, as updateMany does not return modified documents
  results.segments = await Segment.find({ _id: { $in: segmentIds } });

  return results;
};

const deleteProfile = async (profileId) => {
  return UserModel.remove({ _id: profileId });
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
  return UserModel.findOne({ _id: firebaseId }, { _id: 0, segments: 1 }).populate('segments');
};

// get a user's submitted logs
const getUserSubmissions = async (firebaseId) => {
  return Submissions.find({ submitter: firebaseId }).populate('segment');
};

module.exports = {
  getProfile,
  getProfileByEmail,
  getAllProfiles,
  getAllReducedProfiles,
  getAssignedSegments,
  getUserSubmissions,
  updateProfile,
  setSegmentAssignments,
  deleteProfile,
  createProfile,
};
