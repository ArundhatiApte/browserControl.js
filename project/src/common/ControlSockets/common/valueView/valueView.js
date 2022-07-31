"use strcit";

const isItNaN = require("./modules/isItNaN/isItNaN");

const {
  arrayBufferToStringInUTF8,
  insertStringInUTF8ToArrayBuffer
} = require("./modules/byteString");

const calcSizeOfUTF8StringInBytes = require("./modules/calcSizeOfUTF8StringInBytes/calcSizeOfUTF8StringInBytes");

const valueView = {
  bytiefy(sizeOfHeaderInBytes, value) {
    if (isItNaN(value)) {
      return createArrayBufferWithHeaderAndSetLastByte(sizeOfHeaderInBytes, uint8OfNaN);
    }
    if (value === undefined) {
      return createArrayBufferWithHeaderAndSetLastByte(sizeOfHeaderInBytes, uint8OfUndefined);
    }
    return bytiefyJSONableValue(sizeOfHeaderInBytes, value);
  },

  parse(arrayBuffer, startIndex) {
    if ((arrayBuffer.byteLength - 1) === startIndex) {
      const uint8 = new DataView(arrayBuffer).getUint8(startIndex);
      if (uint8 === uint8OfUndefined) {
        return undefined;
      }
      if (uint8 === uint8OfNaN) {
        return NaN;
      }
    }

    let out;
    try {
      out = arrayBufferToStringInUTF8(arrayBuffer, startIndex);
    } catch(error) {
      throw new Error("Message is broken.");
    }
    try {
      out = JSON_parse(out);
    } catch(error) {
      throw new Error("Message is broken.");
    }
    return out;
  }
};
Object.freeze(valueView);

const uint8OfNaN = 0;
const uint8OfUndefined = 2;

const createArrayBufferWithHeaderAndSetLastByte = function(sizeOfHeaderInBytes, uint8OfLastByte) {
  const out = new ArrayBuffer(sizeOfHeaderInBytes + 1);
  new Uint8Array(out)[sizeOfHeaderInBytes] = uint8OfLastByte;
  return out;
};

const bytiefyJSONableValue = function(sizeOfHeaderInBytes, value) {
  const jsoned = JSON_stringify(value);
  const sizeOfJSONed = calcSizeOfUTF8StringInBytes(jsoned);
  const out = new ArrayBuffer(sizeOfHeaderInBytes + sizeOfJSONed);
  insertStringInUTF8ToArrayBuffer(out, sizeOfHeaderInBytes, jsoned);
  return out;
};

const JSON_stringify = JSON.stringify;
const JSON_parse = JSON.parse;

module.exports = valueView;
