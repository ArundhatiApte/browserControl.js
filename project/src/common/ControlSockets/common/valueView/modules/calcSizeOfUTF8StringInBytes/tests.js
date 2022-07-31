"use strict";

const expectEqual = require("assert").strictEqual;

const calcSizeOfUTF8StringInBytes = require("./calcSizeOfUTF8StringInBytes");

const test = function() {
  const strings = [
    "",
    "a",
    "as cii",
    "香",
    "aሴ ∹ ⅉ abcd ",
    "a攔a攕攖攘a string"
  ];

  const checkCalcingSizeOfUTF8StringInBytes = function(string) {
    const size = calcSizeOfUTF8StringInBytes(string);
    const expectedSize = calcSizeOfUTF8StringInBytesEtalon(string);
    expectEqual(expectedSize, size);
  };

  for (const string of strings) {
    checkCalcingSizeOfUTF8StringInBytes(string);
  }
};

const calcSizeOfUTF8StringInBytesEtalon = function(string) {
  return createArrayBufferWithUTF8FromString(string).byteLength;
};

const createArrayBufferWithUTF8FromString = TextEncoder.prototype.encode.bind(new TextEncoder("utf8"));

describe("подсчёт размера строки в UTF-8 в байтах", function() {
  it("т", test);
});
