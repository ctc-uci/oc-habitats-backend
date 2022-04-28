const express = require('express');

const router = express.Router();
const numbersService = require('../services/numbers.service');

// get all numbers
router.get('/', async (req, res) => {
  try {
    const allNumbers = await numbersService.getAllNumbers();
    res.status(200).send(allNumbers);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// add new number
router.post('/', async (req, res) => {
  try {
    const number = await numbersService.addNewNumber(req.body);
    res.status(200).send(number);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// delete number
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNumber = await numbersService.deleteNumber(id);
    if (deletedNumber.n === 0) {
      res.status(400).json({ message: `Number ${id} not deleted` });
    } else {
      res.status(200).json({ message: `Number ${id} was succesfully deleted` });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// update number
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedNumber = await numbersService.updateNumber(id, req.body);
    if (updatedNumber.nModified === 0) {
      res.status(400).json({ message: `Number ${id} not updated` });
    } else {
      res.status(200).send(updatedNumber);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
