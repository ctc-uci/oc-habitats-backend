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
  const { fieldTitle, fieldType, fieldTooltip } = fieldBody;
  FormModel.updateOne(
    {
      $and: [{ formType }, { 'additionalFields._id': fieldId }],
    },
    {
      $set: {
        'additionalFields.$.title': fieldTitle,
        'additionalFields.$.fieldType': fieldType,
        'additionalFields.$.tooltip': fieldTooltip,
      },
    },
    (err, field) => {
      if (err) {
        console.log(err);
        throw new Error(err);
      }
      return field;
    },
  );
};

const deleteForm = async (formType) => {
  return FormModel.deleteOne({ formType });
};

const deleteFormFieldById = async (formType, fieldId) => {
  console.log(`Processing request for form type ${formType} and title ${fieldId}`);
  const foundForm = await FormModel.findOne({ formType });
  console.log(foundForm);
  foundForm.additionalFields.pull({ _id: fieldId });
  foundForm.save((err, newDoc) => {
    if (err) {
      throw new Error('Error deleting field in document');
    } else {
      return newDoc;
    }
  });
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
