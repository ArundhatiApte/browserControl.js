"use strict";

const concat2ArrayBuffers = require("./../../../../../../../tests/utils/concat2ArrayBuffers");

const createBytesFromUint8s = require("./createBytesFromUint8s");

const createMessageWithHeader = function(uint8sForHeader, byteMessage) {
  const header = createBytesFromUint8s(uint8sForHeader);
  return concat2ArrayBuffers(header, byteMessage);
};

module.exports = createMessageWithHeader;
