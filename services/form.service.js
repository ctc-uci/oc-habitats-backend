/* eslint-disable no-console */
const mongoose = require('mongoose');
const FormModel = require('../models/form.schema');

const createForm = async (formType, additionalFields) => {
  const createdForm = new FormModel({
    formType,
    additionalFields,
  });
  return createdForm.save();
};

const createFieldInForm = async (formType, fieldBody) => {
  const { title, fieldType, tooltip } = fieldBody;
  const subtitle = fieldBody.subtitle ? fieldBody.subtitle : '';
  const updatedForm = await FormModel.updateOne(
    { formType },
    {
      $push: {
        additionalFields: {
          _id: mongoose.Types.ObjectId(),
          title,
          subtitle,
          fieldType,
          static: false,
          tooltip,
        },
      },
    },
  );

  return updatedForm;
};

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

const updateFormFieldById = async (type, fieldId, fieldBody) => {
  const { title, fieldType, tooltip } = fieldBody;

  FormModel.findOneAndUpdate(
    { formType: type, 'additionalFields._id': fieldId },
    {
      $set: {
        'additionalFields.$.title': title,
        'additionalFields.$.fieldType': fieldType,
        'additionalFields.$.tooltip': tooltip,
      },
    },
    (err, doc) => {
      if (err) {
        return new Error(err);
      }
      return doc;
    },
  );
};

const deleteForm = async (formType) => {
  return FormModel.deleteOne({ formType });
};

const deleteFormFieldById = async (formType, fieldId) => {
  const foundForm = await FormModel.findOne({ formType }).populate('additionalFields');

  foundForm.additionalFields.pull(fieldId);
  foundForm.save((err, newDoc) => {
    if (err) {
      throw new Error(err);
    } else {
      return newDoc;
    }
  });
};

module.exports = {
  getFormByType,
  updateForm,
  updateFormFieldById,
  deleteForm,
  deleteFormFieldById,
  createForm,
  createFieldInForm,
};
