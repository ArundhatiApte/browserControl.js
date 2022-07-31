"use strict";

const numberType = "number";

module.exports = function isItNaN(value) {
  return (value !== value) && (typeof value === numberType);
};
