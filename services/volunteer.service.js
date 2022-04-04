const UserModel = require('../models/user.schema');

// get user's assigned segments
const getAssignedSegments = async (firebaseId) => {
  return UserModel.aggregate([
    { $match: { firebaseId } },
    {
      $lookup: {
        from: 'segments',
        localField: 'segments',
        foreignField: '_id',
        as: 'user_segments',
      },
    },
    {
      $project: {
        _id: 0,
        user_segments: 1,
      },
    },
  ]);
};

module.exports = {
  getAssignedSegments,
};

// TO-DO: get unsubmitted monitor logs

// TO-DO: get recently submitted logs (6)
