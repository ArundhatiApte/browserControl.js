"use strict";

const {
  createResponseWithSuccesResult,
  createResponseWithError,
  createResponseWithSyncErrorFromAsyncFn,

  setSuccesStatusInArrayBuffer,
  setErrorStatusInArrayBuffer,
  setSyncErrorFromAsyncFnStatusInArrayBuffer,
  setClientNotFoundMethodStatusInArrayBuffer
} = require("./messaging").invokingMessageParserAndResponseCreator;

const SenderOfResultOnInvokation = class {
  constructor(controlledSide, senderOfResponseByRWS) {
    this[_controlledSide] = controlledSide;
    this[_senderOfResponseByRWS] = senderOfResponseByRWS;
  }

  sendResult(value) {
    return this[_senderOfResponseByRWS].sendBinaryResponse(createResponseWithSuccesResult(
      this[_controlledSide][_sizeOfHeaderForResponse],
      value
    ));
  }

  sendError(message, stack) {
    return sendResponseWithError(this, createResponseWithError, message, stack);
  }

  sendSyncErrorFromAsyncFn(message, stack) {
    return sendResponseWithError(this, createResponseWithSyncErrorFromAsyncFn, message, stack);
  }

  sendSuccesStatus() {
    return sendResponseOnlyWithStatus(this, setSuccesStatusInArrayBuffer);
  }

  sendErrorStatus() {
    return sendResponseOnlyWithStatus(this, setErrorStatusInArrayBuffer);
  }

  sendSyncErrorFromAsyncFnStatus() {
    return sendResponseOnlyWithStatus(this, setSyncErrorFromAsyncFnStatusInArrayBuffer);
  }

  sendClientNotFoundMethodStatus() {
    return sendResponseOnlyWithStatus(this, setClientNotFoundMethodStatusInArrayBuffer);
  }
};

const _controlledSide = Symbol();
const _senderOfResponseByRWS = Symbol();

const proto = SenderOfResultOnInvokation.prototype;

const sendResponseWithError = function(
  senderOfResultOnInvokation,
  createResponseWithError,
  errorMessage,
  errorStack
) {
  return senderOfResultOnInvokation[_senderOfResponseByRWS].sendBinaryResponse(
    createResponseWithError(
      senderOfResultOnInvokation[_controlledSide][_sizeOfHeaderForResponse],
      errorMessage,
      errorStack
    )
  );
};

const sendResponseOnlyWithStatus = function(senderOfResultOnInvokation, setStatusInArrayBuffer) {
  const controlledSide = senderOfResultOnInvokation[_controlledSide];
  const arrayBuffer = controlledSide[_arrayBufferForResponseOnlyWithStatus];
  setStatusInArrayBuffer(arrayBuffer, controlledSide[_sizeOfHeaderForResponse]);
  senderOfResultOnInvokation[_senderOfResponseByRWS].sendBinaryResponse(arrayBuffer);
};

module.exports = SenderOfResultOnInvokation;

const {
  _connection,
  _sizeOfHeaderForResponse,
  _arrayBufferForResponseOnlyWithStatus
} = require("./../ControlledSide")._namesOfProtectedProperties;
