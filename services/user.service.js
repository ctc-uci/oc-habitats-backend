const { v4: uuid } = require('uuid');
const UserModel = require('../models/user.schema');

const getProfile = async (profileId) => {
  return UserModel.findOne({ _id: profileId });
};

const getAllProfiles = async () => {
  return UserModel.find({});
};

const updateProfile = async (profileId, updatedProfile) => {
  return UserModel.updateOne(
    { _id: profileId },
    {
      $set: updatedProfile,
    },
  );
};

const deleteProfile = async (profileId) => {
  return UserModel.deleteOne({ _id: profileId });
};

const createProfile = async (user) => {
  if (!user.firstName || !user.lastName || !user.email || !user.password) {
    throw new Error('Arguments missing in user');
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
    profileImage: { data: null, contentType: null },
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
