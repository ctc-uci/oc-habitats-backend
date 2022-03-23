const { v4: uuid } = require('uuid');
const UserModel = require('../models/user.schema');

const getProfile = async (profileId) => {
  return UserModel.findOne({ profileId });
};

const getAllProfiles = async () => {
  return UserModel.find({});
};

const updateProfile = async (profileId, updatedProfile) => {
  return UserModel.updateOne(
    { profileId },
    {
      $set: updatedProfile,
    },
  );
};

const assignSegment = async (profileId, segmentId) => {
  console.log(`profileId: ${profileId}`);
  console.log(`segmentId: ${segmentId}`);

  return UserModel.findOneAndUpdate(
    { _id: profileId },
    {
      $push: {
        segments: segmentId,
      },
    },
    {
      new: true,
    },
  );
};

const deleteProfile = async (profileId) => {
  return UserModel.remove({ profileId });
};

const createProfile = async (user) => {
  if (!user.firstName || !user.lastName || !user.email || !user.password) {
    throw new Error('Arguments missing in lesson');
  }
  const createdProfile = new UserModel({
    _id: uuid(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    isAdmin: user.isAdmin,
    isSuperAdmin: user.isSuperAdmin,
    isActive: user.isActive,
    isTrainee: user.isTrainee,
    profileImage: {},
    segments: [],
  });
  return createdProfile.save();
};

module.exports = {
  getProfile,
  getAllProfiles,
  updateProfile,
  assignSegment,
  deleteProfile,
  createProfile,
};
