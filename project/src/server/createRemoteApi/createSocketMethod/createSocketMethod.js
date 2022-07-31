"use strict";

const statusOfCall = require("./../../ControllingServer/ControllingServer").statusOfCall;
const internalErrorMessages = require("./internalErrorMessages");

const {
  succes: statusOfCall_succes,
  error: statusOfCall_error,
  syncErrorFromAsyncFn: statusOfCall_syncErrorFromAsyncFn
} = statusOfCall;

const {
  TimeoutToReceiveResponseError,
  symbolsOfResponseOnInvokingMessage: {
    status: symbolsOfResponseOnInvokingMessage_status,
    result: symbolsOfResponseOnInvokingMessage_result,
    errorMessage: symbolsOfResponseOnInvokingMessage_errorMessage,
    errorStack: symbolsOfResponseOnInvokingMessage_errorStack
  }
} = require(
  "./../../../common/ControlSockets/ControllingSide/ControllingSide"
);

const createSocketMethod = function(controllingConnection, objId, methodId, isReturning) {
  return _callMethodViaSocket.bind(null, controllingConnection, objId, methodId, isReturning);
};

const _callMethodViaSocket = async function(
  controllingConnection,
  objectId,
  methodId,
  isReturning,
  ...args
) {
  let response;
  try {
    response = await controllingConnection.sendInvokingMessage(objectId, methodId, args);
  } catch(error) {
    if (error instanceof TimeoutToReceiveResponseError) {
      throw new Error(internalErrorMessages.responseTimeoutErrorMessage);
    }
    throw error;
  }
  const responseType = response[symbolsOfResponseOnInvokingMessage_status];

  if (responseType === statusOfCall_succes) {
    if (isReturning) {
      return response[symbolsOfResponseOnInvokingMessage_result];
    }
    return;
  }
  const error = _createErrorFromResponse(responseType, response, objectId, methodId);
  throw error;
};

const _createErrorFromResponse = function(responseType, response, objectId, methodId) {
  if (responseType === statusOfCall_error || responseType === statusOfCall_syncErrorFromAsyncFn) {
    const {
      [symbolsOfResponseOnInvokingMessage_errorMessage]: message,
      [symbolsOfResponseOnInvokingMessage_errorStack]: stack
    } = response;
    return new ErrorFromClient(message, stack);
  }

  let errorMessage;
  if (responseType === statusOfCall.clientNotFoundMethod) {
    errorMessage = internalErrorMessages.createClientNotFoundMethodErrorMessage(objectId, methodId);
  }
  else if (responseType === statusOfCall.brokenRequest) {
    errorMessage = internalErrorMessages.brokenRequestErrorMessage;
  }
  else {
    errorMessage = internalErrorMessages.unknownError;
  }

  return new Error(errorMessage);
};

const ErrorFromClient = class extends Error {
  constructor(messageFromClient, stackFromClient) {
    super(messageFromClient);
    this.sourceStack = stackFromClient;
  };
};

createSocketMethod.ErrorFromClient = ErrorFromClient;

module.exports = createSocketMethod;
