const AdminInviteModel = require('../models/adminInvite.schema');

const getInvite = async (inviteId) => {
  return AdminInviteModel.findOne({ id: inviteId });
};

const getAllInvites = async () => {
  return AdminInviteModel.find({});
};

const updateInvite = async (inviteId, updatedInvite) => {
  return AdminInviteModel.updateOne(
    { id: inviteId },
    {
      $set: updatedInvite,
    },
  );
};

const deleteInvite = async (inviteEmail) => {
  return AdminInviteModel.deleteOne({ email: inviteEmail });
};

const createInvite = async (invite) => {
  if (!invite.id || !invite.email || !invite.role || !invite.expireDate) {
    throw new Error('Arguments missing in invite');
  }
  const createdInvite = new AdminInviteModel({
    id: invite.id,
    email: invite.email,
    role: invite.role,
    expireDate: invite.expireDate,
  });
  return createdInvite.save();
};

module.exports = {
  getInvite,
  getAllInvites,
  updateInvite,
  deleteInvite,
  createInvite,
};
