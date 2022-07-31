"use strict";

const utf8Decoder = new TextDecoder("utf8");
const utf8Encoder = new TextEncoder("utf8");

const arrayBufferToStringInUTF8 = function(arrayBuffer, startIndex) {
  return utf8Decoder.decode(new Uint8Array(arrayBuffer, startIndex));
};

const insertStringInUTF8ToArrayBuffer = function(arrayBuffer, startIndex, string) {
  return utf8Encoder.encodeInto(string, new Uint8Array(arrayBuffer, startIndex));
};

module.exports = {
  arrayBufferToStringInUTF8,
  insertStringInUTF8ToArrayBuffer
};
