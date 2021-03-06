/* eslint-disable no-console */
const express = require('express');
const formService = require('../services/form.service');
const { verifyToken } = require('./auth.router');

const router = express.Router();

// FILE STRUCTURE:
// create routes
// read routes
// update routes
// delete routes

// create form
router.post('/:type', verifyToken, async (req, res) => {
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

router.post('/create/field', verifyToken, async (req, res) => {
  const { formType, fieldBody } = req.body;
  try {
    await formService.createFieldInForm(formType, fieldBody);
    res.send(
      `successfully added ${fieldBody.title} field of type ${fieldBody.fieldType} with tooltip ${fieldBody.tooltip} to ${formType} form`,
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// create form
router.post('/:type', verifyToken, async (req, res) => {
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

// create field
router.post('/create/field', verifyToken, async (req, res) => {
  const { formType, fieldBody } = req.body;
  try {
    await formService.createFieldInForm(formType, fieldBody);
    res.send(
      `successfully added ${fieldBody.title} field of type ${fieldBody.fieldType} with tooltip ${fieldBody.tooltip} to ${formType} form`,
    );
  } catch (err) {
    res.json({ error: err.message });
  }
});

// read form
router.get('/:type', verifyToken, async (req, res) => {
  const { type } = req.params;
  try {
    const foundForm = await formService.getFormByType(type);
    if (!foundForm) {
      res.status(400).json({ message: `Form type ${type} doesn't exist` });
    } else {
      res.status(200).send(foundForm);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// update form field by id
router.put('/update/field', verifyToken, async (req, res) => {
  const { type, fieldId, fieldBody } = req.body;
  try {
    await formService.updateFormFieldById(type, fieldId, fieldBody);
    res.status(200).send(`field in ${type} form with id ${fieldId} successfully updated`);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// update form
router.put('/update/:type', verifyToken, async (req, res) => {
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

// delete form
router.delete('/:type', verifyToken, async (req, res) => {
  const { type } = req.params;
  try {
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

// delete form field by id
router.delete('/delete/field', verifyToken, async (req, res) => {
  const { formType, fieldId } = req.body;
  try {
    await formService.deleteFormFieldById(formType, fieldId);
    res.status(200).send(`Successfully deleted field in ${formType} form with id ${fieldId}`);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
