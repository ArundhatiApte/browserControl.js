"use strict";

const expectEqual = require("assert").strictEqual;

const createMessageWithHeader = require("./utils/createMessageWithHeader");
const expectObjectIdAndMethodIdEqual = require("./utils/expectObjectIdAndMethodIdEqual");

const testCreatingAndParsingValidInvokingMessageWithoutArgs = function(serverMessanger, clientMessanger) {
  const objectId = 91;
  const methodId = 112;

  const sizeOfHeader = serverMessanger.sizeOfHeaderForInvokingMessage;
  const message = new ArrayBuffer(sizeOfHeader);
  serverMessanger.fillArrayBufferAsHeaderOfInvokingMessage(message, objectId, methodId);

  const headerForOther = [22, 33, 44, 55, 66];
  const sizeOfHeaderForOther = headerForOther.length;

  const messageWithHeader = createMessageWithHeader(headerForOther, message);
  const startIndex = sizeOfHeaderForOther;
  const parsed = clientMessanger.parseInvokingMessage(messageWithHeader, startIndex);

  expectEqual(clientMessanger.symbolsOfsInvokingMessage.args in parsed, false);
  expectObjectIdAndMethodIdEqual(objectId, methodId, parsed);
};

module.exports = testCreatingAndParsingValidInvokingMessageWithoutArgs;
