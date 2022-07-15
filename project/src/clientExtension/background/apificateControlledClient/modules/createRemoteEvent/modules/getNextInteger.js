"use strict";

let integer = 0;

const getNextInteger = function() {
  return integer += 1;
};

module.exports = getNextInteger;
