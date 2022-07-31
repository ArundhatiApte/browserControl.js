"use strict";

const expectEqual = require("assert").strictEqual;

const {
  objectId: symbolsOfInvokingMessage_objectId,
  methodId: symbolsOfInvokingMessage_methodId
} = require(
  "./../../../../../ControlledSide/modules/messaging/invokingMessageParserAndResponseCreator"
).symbolsOfsInvokingMessage;

const expectObjectIdAndMethodIdEqual = function(objectId, methodId, parsed) {
  expectEqual(objectId, parsed[symbolsOfInvokingMessage_objectId]);
  expectEqual(methodId, parsed[symbolsOfInvokingMessage_methodId]);
};

module.exports = expectObjectIdAndMethodIdEqual;
