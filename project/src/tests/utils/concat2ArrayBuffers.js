"use strict";

const insertArrayBufferToAnotherUnsafe = require("./insertArrayBufferToAnotherUnsafe");

const concat2ArrayBuffers = function(a, b) {
  const aLength = a.byteLength;
  const out = new ArrayBuffer(aLength + b.byteLength);

  insertArrayBufferToAnotherUnsafe(out, 0, a);
  insertArrayBufferToAnotherUnsafe(out, aLength, b);
  return out;
};

module.exports = concat2ArrayBuffers;
