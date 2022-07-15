"use strict";

const expectThrows = require("assert").throws;

const createBytesFromUint8s = require("./utils/createBytesFromUint8s");

const testBrokenMessages = function(serverMessanger, clientMessanger) {
  expectThrows(
    () => serverMessanger.parseResponseOnInvokingMessage(createBytesFromUint8s([1, 1]), 0)
  );

  expectThrows(
    () => clientMessanger.parseInvokingMessage(createBytesFromUint8s([1]), 0)
  );
};

module.exports = testBrokenMessages;
