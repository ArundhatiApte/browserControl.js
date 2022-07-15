"use strict";

const expectEqual = require("assert").strictEqual;

const isItNaN = require("./isItNaN");

const createCheckingDetectingNaNFn = function(value, isNan) {
  return checkDetectingNaN.bind(null, value, isNan);
};

const checkDetectingNaN = function(value, isNan) {
  return expectEqual(isNan, isItNaN(value));
};

describe("тест обнаружения NaN", function() {
  const combinations = [
    ["NaN", NaN, true],
    ["число", 42, false],
    ["не число, но не NaN", "abcd", false]
  ];

  for (const [nameOfTest, value, isNan] of combinations) {
    it(nameOfTest, createCheckingDetectingNaNFn(value, isNan));
  }
});
