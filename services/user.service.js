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
  return UserModel.remove({ firebaseId: profileId });
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
  assignSegment,
  deleteProfile,
  createProfile,
};
