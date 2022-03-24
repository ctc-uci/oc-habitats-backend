const UserModel = require('../models/user.schema');

const getProfile = async (profileId) => {
  return UserModel.findOne({ id: profileId });
};

const getProfileByEmail = async (profileEmail) => {
  return UserModel.findOne({ email: profileEmail });
};

const getAllProfiles = async () => {
  return UserModel.find({});
};

const updateProfile = async (profileId, updatedProfile) => {
  return UserModel.updateOne(
    { id: profileId },
    {
      $set: updatedProfile,
    },
  );
};

const deleteProfile = async (profileId) => {
  return UserModel.remove({ profileId });
};

const createProfile = async (user) => {
  // if (!user.userId || !user.firstName || !user.lastName || !user.email) {
  //   throw new Error('Arguments missing in createUser');
  // }
  const createdProfile = new UserModel(user);
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
