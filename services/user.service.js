const UserModel = require('../models/user.schema');

const getProfile = async (profileId) => {
    return await UserModel.findOne({ profileId });
}

const getAllProfiles = async () => {
    return await UserModel.find({});
}

const updateProfile = async (profileId, updatedProfile) => {
    return await UserModel.updateOne(
        { profileId },
        {
            $set: updatedProfile,
        }
    );
}

const deleteProfile = async (profileId) => {
    return UserModel.remove({ profileId });
}

module.exports = {
    getProfile,
    getAllProfiles,
    updateProfile,
    deleteProfile
}
