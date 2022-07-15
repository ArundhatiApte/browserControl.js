"use strict";

const createByteArray = require("./../../utils/createArrayBufferFromUint8s");
const areByteArraysEqual = require("./../areArrayBuffersEqualByIndex/areArrayBuffersEqualByIndex");

const createFnToCheckSendingFragmentsOfRequest = require("./_createFnToCheckSendingFragmentsOfRequest");

const fragmentsOfRequest = [
  createByteArray([1, 1, 1, 1]),
  createByteArray([2, 2, 2, 2, 2])
];

const fullRequest = createByteArray([
  1, 1, 1, 1,
  2, 2, 2, 2, 2
]);

const sendResponseByClient = (client, senderOfResponse) => (
  senderOfResponse.sendBinaryResponse(new ArrayBuffer(client.sizeOfHeaderForBinaryResponse + 1))
);

const checkSendingFragmentsOfBinaryRequestByServer = createFnToCheckSendingFragmentsOfRequest(
  fragmentsOfRequest,
  "send2FragmentsOfBinaryRequest",
  fullRequest,
  areByteArraysEqual,
  "setBinaryRequestListener",
  sendResponseByClient
);

module.exports = checkSendingFragmentsOfBinaryRequestByServer;
