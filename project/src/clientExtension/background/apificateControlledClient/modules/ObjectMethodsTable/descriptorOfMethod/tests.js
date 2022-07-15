"use strict";

const expectTrue = require("assert").ok;

const descriptorOfMethod = require("./descriptorOfMethod.js");

const test = function() {
  const combinations = [
    [0, 0], [0, 1], [1, 0], [1, 1]
  ];
  let descriptor;
  for (const [isReturning, isAsync] of combinations) {
    descriptor = descriptorOfMethod.create(isReturning, isAsync);
    checkDescriptor(descriptor, isReturning, isAsync);
  }
};

const checkDescriptor = function(descriptor, isReturning, isAsync) {
  expectTrue(isReturning == descriptorOfMethod.isReturning(descriptor));
  expectTrue(isAsync == descriptorOfMethod.isAsync(descriptor));
};

describe("тест создания описания метода и извлечения информации о нем", function() {
  it("т", test);
});
