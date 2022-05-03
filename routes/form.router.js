/* eslint-disable no-console */
const express = require('express');
const formService = require('../services/form.service');

const router = express.Router();

// const isAlphaNumeric = (value) => {
//   if (!/^[0-9a-zA-Z]+$/.test(value)) {
//     throw new Error('AdminInvite ID must be alphanumeric');
//   }
// };

// get form by type
router.get('/:type', async (req, res) => {
  const { type } = req.params;
  try {
    const foundForm = await formService.getFormByType(type);
    if (!foundForm) {
      res.status(400).json({ message: `Form type ${type} doesn't exist` });
    } else {
      console.log('GET /adminInvite/:type hit, foundForm looks like:');
      console.log(foundForm);
      res.status(200).send(foundForm);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

// delete form
router.delete('/:type', async (req, res) => {
  const { type } = req.params;
  try {
    // delete form
    const deletedForm = await formService.deleteForm(type);
    if (deletedForm.n === 0) {
      res.status(400).json({ message: `Form with type ${type} not deleted` });
    } else {
      res.status(200).json({ message: `Form with type ${type} was succesfully deleted` });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// update form
router.put('/update/:type', async (req, res) => {
  const { type } = req.params;
  const { newField } = req.body;
  try {
    const updatedForm = await formService.updateForm(type, newField);
    if (updatedForm.nModified === 0) {
      res.status(400).json({ message: `Form type ${type} not updated` });
    } else {
      res.status(200).send(updatedForm);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// create form
router.post('/:type', async (req, res) => {
  const { type } = req.params;
  const { additionalFields } = req.body;
  try {
    const form = await formService.createForm(type, additionalFields);
    res.status(200).send(form);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
