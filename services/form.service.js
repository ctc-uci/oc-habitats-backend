/* eslint-disable no-console */
const FormModel = require('../models/form.schema');

const getFormByType = async (formType) => {
  return FormModel.findOne({ formType });
};

const updateForm = async (formType, newField) => {
  return FormModel.updateMany(
    { FormType: formType },
    {
      $push: {
        additionalFields: newField,
      },
    },
  );
};

const updateFormFieldById = async (formType, fieldId, fieldBody) => {
  console.log(formType, fieldId, fieldBody);
};

const deleteForm = async (formType) => {
  return FormModel.deleteOne({ formType });
};

const deleteFormFieldById = async (formType, fieldId) => {
  FormModel.findOneAndUpdate(
    { formType },
    { $pull: { additionalFields: fieldId } },
    (err, data) => {
      if (err) {
        console.log(err);
      }
      return data;
    },
  );
};

const createForm = async (formType, additionalFields) => {
  const createdForm = new FormModel({
    formType,
    additionalFields,
  });
  return createdForm.save();
};

// const createForm = async (invite) => {
//   // work in progress

//   const createdInvite = new FormModel({
//     id: invite.id,
//     email: invite.email,
//     role: invite.role,
//     expireDate: invite.expireDate,
//   });
//   return createdInvite.save();
// };

module.exports = {
  getFormByType,
  updateForm,
  updateFormFieldById,
  deleteForm,
  deleteFormFieldById,
  createForm,
};
