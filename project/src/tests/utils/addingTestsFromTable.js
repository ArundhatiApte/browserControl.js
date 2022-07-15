"use strict";

const addTestsFromTable = function(addTest, nameOfTestToCheckingFn) {
  for (const [nameOfTest, checkingFn] of nameOfTestToCheckingFn) {
    addTest(nameOfTest, checkingFn);
  }
};

const createAndAddTestsFromTable = function(createTest, addTest, nameOfTestToCheckingFn) {
  for (const [nameOfTest, checkingFn] of nameOfTestToCheckingFn) {
    addTest(nameOfTest, createTest(checkingFn));
  }
};

module.exports = {
  addTestsFromTable,
  createAndAddTestsFromTable
};
