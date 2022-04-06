const UserModel = require('../models/user.schema');

const getProfile = async (profileId) => {
  return UserModel.findOne({ profileId }).populate({ path: 'segments', model: 'Segment' });
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

const assignSegment = async (profileId, segmentId) => {
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
