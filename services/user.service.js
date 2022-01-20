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

const deleteProfile = async (profileId) => {
  return UserModel.remove({ profileId });
};

module.exports = {
  getProfile,
  getAllProfiles,
  updateProfile,
  deleteProfile,
};
