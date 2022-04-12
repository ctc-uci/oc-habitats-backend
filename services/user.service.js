const UserModel = require('../models/user.schema');

const getProfile = async (profileId) => {
  return UserModel.findOne({ firebaseId: profileId });
};

const getProfileByEmail = async (profileEmail) => {
  return UserModel.findOne({ email: profileEmail });
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
  return UserModel.remove({ firebaseId: profileId });
};

const createProfile = async (user) => {
  const createdProfile = new UserModel({
    ...user,
    profileImage: { data: null, contentType: null },
  });
  return createdProfile.save();
};

module.exports = {
  getProfile,
  getProfileByEmail,
  getAllProfiles,
  updateProfile,
  deleteProfile,
  createProfile,
};
