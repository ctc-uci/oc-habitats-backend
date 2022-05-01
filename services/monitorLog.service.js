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

const getSubmissionsByDates = async (startDate, endDate, status) => {
  if (status) {
    return Submission.find({
      lastEditedAt: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
      status: 'APPROVED',
    }).sort({ lastEditedAt: 'asc' });

    // Not completed - UNSUBMITTED
    // Completed - APPROVED
  }

  return Submission.find({
    lastEditedAt: {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    },
  }).sort({ lastEditedAt: 'asc' });
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
  getSubmissionsByDates,
  getSubmissions,
  createSubmission,
};
