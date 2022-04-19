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

const getSubmission = async (submissionId) => {
  return Submission.findOne({ _id: submissionId });
};

const deleteSubmission = async (submissionId) => {
  return Submission.remove({ _id: submissionId });
};

const createSubmission = async (submission, user) => {
  if (!submission.generalFieldValues) {
    throw new Error('Arguments missing in submission');
  }
  const createdSubmission = new Submission({
    ...submission,
    submitter: user,
    submittedAt: new Date(),
    lastEditedAt: new Date(),
  });
  return createdSubmission.save();
};

module.exports = {
  getForm,
  updateForm,
  updateSubmission,
  deleteSubmission,
  getSubmission,
  getSubmissions,
  createSubmission,
};
