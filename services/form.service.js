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
  console.log(
    `type: ${type}, fieldId: ${fieldId}, title: ${title}, fieldType: ${fieldType}, tooltip: ${tooltip}`,
  );
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
        console.log(err);
      } else {
        console.log('NEW DOC: ---------------');
        console.log(doc);
      }
    },
  );
  // const field = form.additionalFields.id('6272ce79061f2899fb78d86c');
  // form.addtionalFields.indexOf(field) = {
  //   title: 'hi',
  //   fieldType: 'hi',
  //   static: true,
  //   tooltip: 'hi',
  // };
  // form.save((err, newForm) => {
  //   if (err) {
  //     throw new Error(err.message);
  //   }
  //   else {
  //     console.log(newForm);
  //     return newForm;
  //   }
  // });
  // field.title = 'hi';
  // field.fieldType = 'hi';
  // field.tooltip = 'hi';
  // field.save((err, savedField) => {
  //   if (err) {
  //     throw new Error(err);
  //   } else {
  //     console.log(savedField);
  //   }
  // });
  // FormModel.updateOne(
  //   { formType: 'general', 'additionalFields._id': '6272ce79061f2899fb78d86c' },
  //   {
  //     $set: {
  //       'additionalFields.$.title': 'hi',
  //       'additionalFields.$.fieldType': 'hi',
  //       'additionalFields.$.tooltip': 'hi',
  //     },
  //   },
  // );
  // FormModel.updateOne({ formType: 'general', 'additionalFields._id': '6272ce79061f2899fb78d86c'}, $set: {
  //   'additionalFields.$.title': 'hi',
  //   'additionalFields.$.fieldType': 'hi',
  //   'additionalFields.$.tooltip': 'hi',
  // });
  //   console.log(fieldId, fieldBody);
  //   // const { fieldTitle, fieldType, fieldTooltip } = fieldBody;
  // const form = await FormModel.findOne({ formType: 'general' });
  //   const fields = await form.additionalFields.;
  //   console.log('FIELD: ------------------');
  //   console.log(field);
};

const deleteForm = async (formType) => {
  return FormModel.deleteOne({ formType });
};

const deleteFormFieldById = async (formType, fieldId) => {
  console.log(`Processing request for form type ${formType} and id ${fieldId}`);
  const foundForm = await FormModel.findOne({ formType }).populate('additionalFields');
  console.log('foundForm --------------');
  console.log(foundForm);
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
