const Submission = require('../models/submission.schema');
const Form = require('../models/form.schema');

const getForm = async () => {
  return Form.findOne({ _id: 0 });
};

const updateForm = async (updatedForm) => {
  return Form.updateOne(
    { _id: 0 },
    {
      $set: updatedForm,
    },
  );
};

const updateSubmission = async (submissionId, updatedSubmission) => {
  return Submission.updateOne(
    { _id: submissionId },
    {
      $set: updatedSubmission,
    },
  );
};

const getSubmissions = async () => {
  return Submission.find();
};

const getSubmissionsByDates = async (startDate, endDate) => {
  return Submission.find({
    lastEditedAt: {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    },
    status: 'APPROVED',
  })
    .populate('submitter', 'firstName lastName -_id')
    .populate('segment', '-_id segmentId')
    .populate('sessionPartners', 'firstName lastName -_id')
    .populate('listedSpecies.species', 'name -_id')
    .populate('additionalSpecies.species', 'name -_id')
    .sort({ lastEditedAt: 'asc' });
};

const getSubmission = async (submissionId) => {
  return Submission.findOne({ _id: submissionId });
};

const deleteSubmission = async (submissionId) => {
  return Submission.remove({ _id: submissionId });
};

const createSubmission = async (submission) => {
  if (!submission.submitter || !submission.generalFieldValues || !submission.listedSpeciesEntries) {
    throw new Error('Arguments missing in submission');
  }
  const createdSubmission = new Submission({ ...submission, submittedAt: new Date() });
  return createdSubmission.save();
};

module.exports = {
  getForm,
  updateForm,
  updateSubmission,
  deleteSubmission,
  getSubmission,
  getSubmissions,
  getSubmissionsByDates,
  createSubmission,
};
