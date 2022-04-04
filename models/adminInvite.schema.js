const mongoose = require('mongoose');

const adminInviteSchema = new mongoose.Schema({
  id: String,
  email: String,
  firstName: String,
  lastName: String,
  role: String,
  expireDate: String,
});

module.exports = mongoose.model('AdminInvite', adminInviteSchema);
