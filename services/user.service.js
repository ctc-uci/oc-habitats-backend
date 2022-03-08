const UserModel = require('../models/user.schema');

const getProfile = async (profileId) => {
  return UserModel.findOne({ profileId });
};

const getAllProfiles = async () => {
  return UserModel.find({});
};

const updateProfile = async (profileId, updatedProfile) => {
  return UserModel.updateOne(
    { firebaseId: profileId },
    {
      $set: updatedProfile,
    },
  );
};

const deleteProfile = async (profileId) => {
  return UserModel.remove({ profileId });
};

const createProfile = async (user) => {
  if (!user.userId || !user.firstName || !user.lastName || !user.email) {
    throw new Error('Arguments missing in createUser');
  }
  const createdProfile = new UserModel({
    firebaseId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isTrainee: user.isTrainee,
    registered: user.registered,
    profileImage: {},
    segments: [],
  });
  return createdProfile.save();
};

module.exports = {
  getProfile,
  getAllProfiles,
  updateProfile,
  deleteProfile,
  createProfile,
};
