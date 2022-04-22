const FormModel = require('../models/form.schema');

const getFormByType = async (formType) => {
  const form = FormModel.findOne({});
  switch (formType) {
    case 'general':
      return form.data.generalAdditionalFields;
      break;
    case 'listedSpecies':
      return form.data.listedSpeciesAdditionalFields;
      break;
    case 'predator':
      return form.data.predatorAdditionalFields;
      break;
    case 'humanActivity':
      return form.data.humanActivityAdditionalFields;
      break;
    default:
      break;
  }
};

const updateForm = async (formType, formFields) => {
  switch (formType) {
    case 'general':
      FormModel.updateOne({}, {
        generalAdditionalFields: formFields,
      }
      );
      break;
    case 'listedSpecies':
      FormModel.updateOne({}, {
        listedSpeciesAdditionalFields: formFields,
      }
      );
      break;
    case 'predator':
      FormModel.updateOne({}, {
        predatorAdditionalFields: formFields,
      }
      );
      break;
    case 'humanActivity':
      FormModel.updateOne({}, {
        humanActivityAdditionalFields: formFields,
      }
      );
      break;

  }
};

const deleteForm = async (formType) => {
  switch (formType) {
    case 'general':
      FormModel.updateOne({}, { $set: {
        generalAdditionalFields: [],
      }});
    case 'listedSpecies':
      FormModel.updateOne({}, { $set: {
        glistedSpeciesAdditionalFields: [],
      }});
    case 'predator':
      FormModel.updateOne({}, { $set: {
        predatorAdditionalFields: [],
      }});
  }
};

const createForm = async (invite) => {
  // work in progress

  const createdInvite = new AdminInviteModel({
    id: invite.id,
    email: invite.email,
    role: invite.role,
    expireDate: invite.expireDate,
  });
  return createdInvite.save();
};

module.exports = {
  getFormByType,
  updateForm,
  deleteForm,
  createForm,
};
