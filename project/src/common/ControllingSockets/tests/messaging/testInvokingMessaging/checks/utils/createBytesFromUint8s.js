"use strict";

const createBytesFromUint8s = function(uint8s) {
  return new Uint8Array(uint8s).buffer;
};

module.exports = createBytesFromUint8s;
