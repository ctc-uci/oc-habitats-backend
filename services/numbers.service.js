const NumbersModel = require('../models/numbers.schema');

const getAllNumbers = async () => {
  return NumbersModel.find({});
};

const addNewNumber = async (number) => {
  NumbersModel.findOne({ name: number.name }, (err) => {
    if (err) throw new Error('The name for this number already exists');
  });

  NumbersModel.findOne({ number: number.number }, (err) => {
    if (err) throw new Error('This number already exists');
  });

  if (!number.name || !number.number) {
    throw new Error('Arguments missing for Number');
  } else {
    const newNumber = new NumbersModel({
      name: number.name,
      number: number.number,
      note: number.note,
    });
    return newNumber.save();
  }
};

const deleteNumber = async (numberId) => {
  return NumbersModel.findByIdAndDelete(numberId);
};

const updateNumber = async (numberId, updatedNumber) => {
  return NumbersModel.findByIdAndUpdate(numberId, updatedNumber);
};

module.exports = {
  getAllNumbers,
  addNewNumber,
  deleteNumber,
  updateNumber,
};
