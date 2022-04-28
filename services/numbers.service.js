const NumbersModel = require('../models/numbers.schema');

const getAllNumbers = async () => {
  return NumbersModel.find({});
};

const addNewNumber = async (number) => {
  if (!number.name || !number.number) {
    throw new Error('Arguments missing in species');
  }
  const newNumber = new NumbersModel({
    name: number.name,
    number: number.number,
    note: number.note,
  });
  return newNumber.save();
};

const deleteNumber = async (numberId) => {
  return NumbersModel.findByIdAndDelete(numberId);
};

const updateNumber = async (numberId, updatedNumber) => {
  return NumbersModel.updateOne(
    { id: numberId },
    {
      $set: updatedNumber,
    },
  );
};

module.exports = {
  getAllNumbers,
  addNewNumber,
  deleteNumber,
  updateNumber,
};
