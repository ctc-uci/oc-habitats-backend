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
  // if (!user.firstName || !user.lastName || !user.email || !user.password) {
  //   throw new Error('Arguments missing in user');
  // }
  // const createdProfile = new UserModel({
  //   _id: uuid(),
  //   firstName: user.firstName,
  //   lastName: user.lastName,
  //   email: user.email,
  //   password: user.password,
  //   isAdmin: user.isAdmin,
  //   isSuperAdmin: user.isSuperAdmin,
  //   isActive: user.isActive,
  //   isTrainee: user.isTrainee,
  //   profileImage: { data: null, contentType: null },
  //   segments: [],
  // });
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
