"use strict";

const expectDeepEqual = require("assert").deepStrictEqual;

const concat2ArrayBuffers = require("./../../../../../../tests/utils/concat2ArrayBuffers");

const collectionOfArgs = require("./utils/collectionOfArgs");
const createBytesFromUint8s = require("./utils/createBytesFromUint8s");
const expectObjectIdAndMethodIdEqual = require("./utils/expectObjectIdAndMethodIdEqual")

const testCreatingAndParsingValidInvokingMessagesWithArgs = function(serverMessanger, clientMessanger) {
  const headerForRWS = createBytesFromUint8s([0, 12, 34]);
  const byteSizeOfHeaderForRWS = headerForRWS.byteLength;

  const objectId = 56;
  const methodId = 78;

  const sizeOfHeader = serverMessanger.sizeOfHeaderForInvokingMessage;
  const header = new ArrayBuffer(sizeOfHeader);

  const {
    fillArrayBufferAsHeaderOfInvokingMessage,
    createBodyFromArgs,
  } = serverMessanger;

  const {
    parseInvokingMessage,
    symbolsOfsInvokingMessage: {
      args: symbols_args
    }
  } = clientMessanger;

  for (const args of collectionOfArgs) {
    fillArrayBufferAsHeaderOfInvokingMessage(header, objectId, methodId);
    const bodyOfMessage = createBodyFromArgs(args);

    const message = concat2ArrayBuffers(header, bodyOfMessage);
    const messageWithHeader = concat2ArrayBuffers(headerForRWS, message);

    const startIndex = byteSizeOfHeaderForRWS;
    const parsed = parseInvokingMessage(messageWithHeader, startIndex);

    expectObjectIdAndMethodIdEqual(objectId, methodId, parsed);
    expectDeepEqual(args, parsed[symbols_args]);
  }
};

module.exports = testCreatingAndParsingValidInvokingMessagesWithArgs;
