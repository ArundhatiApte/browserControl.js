"use strict";

const expectEqual = require("assert").strictEqual;

const {
  status: symbolsOfResponseOnInvokingMessage_status,
  errorMessage: symbolsOfResponseOnInvokingMessage_errorMessage,
  errorStack: symbolsOfResponseOnInvokingMessage_errorStack
} = require(
  "./../../../../../ControllingSide/modules/messaging/invokingMessageCreatorAndResponseParser"
).symbolsOfResponseOnInvokingMessage;

const checkResponseAboutError = function(parsed, status, errorMessage, errorStack) {
  expectEqual(parsed[symbolsOfResponseOnInvokingMessage_status], status);
  expectEqual(parsed[symbolsOfResponseOnInvokingMessage_errorMessage], errorMessage);
  expectEqual(parsed[symbolsOfResponseOnInvokingMessage_errorStack], errorStack);
};

module.exports = checkResponseAboutError;
