"use strcit";

let maxNumber = 255;

const SequenceGeneratorOfNumbers = class {
  constructor() {
    this[_value] = 0;
  }

  getNextNumber() {
    const nextNumber = this[_value] += 1;
    if (nextNumber > maxNumber) {
      throw new Error("Значение превысило лимит (" + maxNumber + ").");
    }
    return nextNumber;
  }
};

const _value = "_v";

SequenceGeneratorOfNumbers.setMaxNumber = function(max) {
  maxNumber = max;
};

module.exports = SequenceGeneratorOfNumbers;
