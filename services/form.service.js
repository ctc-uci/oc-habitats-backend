/* eslint-disable no-console */
const mongoose = require('mongoose');
const FormModel = require('../models/form.schema');

/*
ORDER:
CREATE (POST) SERVICES
READ (GET) SERVICES
UPDATE (PUT) SERVICES
DELETE (DELETE) SERVICES
*/

// create form
const createForm = async (formType, additionalFields) => {
  const createdForm = new FormModel({
    formType,
    additionalFields,
  });
  return createdForm.save();
};

// create field
const createFieldInForm = async (formType, fieldBody) => {
  const { title, fieldType, tooltip } = fieldBody;
  const updatedForm = await FormModel.updateOne(
    { formType },
    {
      $push: {
        additionalFields: {
          _id: mongoose.Types.ObjectId(),
          title,
          fieldType,
          static: false,
          tooltip,
        },
      },
    },
  );
  return updatedForm;
};

// read form
const getFormByType = async (formType) => {
  return FormModel.findOne({ formType });
};

// update form
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

// update field
const updateFormFieldById = async (type, fieldId, fieldBody) => {
  FormModel.findOneAndUpdate(
    { formType: type, 'additionalFields._id': fieldId },
    {
      $set: {
        'additionalFields.$.title': fieldBody.title,
        'additionalFields.$.fieldType': fieldBody.fieldType,
        'additionalFields.$.tooltip': fieldBody.tooltip,
      },
    },
    (err, field) => {
      if (err) {
        console.log(err);
        throw new Error(err);
      } else {
        return field;
      }
    },
  );
};

// delete form
const deleteForm = async (formType) => {
  return FormModel.deleteOne({ formType });
};

// delete field
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
  createFieldInForm,
};
