"use strict";

const invokingMessagesHeaders = require("./../../../common/messagesHeaders").invoking.response;

const {
  bytiefy: valueView_bytiefy,
  parse: valueView_parse
} = require("./../../../../valueView/valueView");

const symbolsOfInvokingMessage_objectId = Symbol();
const symbolsOfInvokingMessage_methodId = Symbol();
const symbolsOfInvokingMessage_args = Symbol();

const createCreatingResponseWithErrorAndStackFn = (function() {
  const createResponseWithErrorAndStack = function(headerUint8, sizeOfPrefixBeforeHeader, errorMessage, errorStack) {
    const out = valueView_bytiefy(sizeOfPrefixBeforeHeader + 1, [errorMessage, errorStack]);
    new Uint8Array(out)[sizeOfPrefixBeforeHeader] = headerUint8;
    return out;
  };

  return function(headerUint8) {
    return createResponseWithErrorAndStack.bind(null, headerUint8);
  };
})();

const createSettingHeaderOfStatusInArrayBufferFn = (function() {
  const setHeaderOfStatusInArrayBuffer = function(headerUint8, arrayBuffer, index) {
    new Uint8Array(arrayBuffer)[index] = headerUint8;
  };

  return function(headerUint8) {
    return setHeaderOfStatusInArrayBuffer.bind(null, headerUint8);
  };
})();

const messenger = {
  symbolsOfsInvokingMessage: Object.freeze({
    objectId: symbolsOfInvokingMessage_objectId,
    methodId: symbolsOfInvokingMessage_methodId,
    args: symbolsOfInvokingMessage_args
  }),

  parseInvokingMessage(byteMessage, startIndex) { // startIndex всегда указан
    const lengthOfMessage = byteMessage.byteLength;
    if (lengthOfMessage < startIndex + 2) {
      throw new Error("Invoking message is too short.");
    }

    const uint8s = new Uint8Array(byteMessage);
    const lastIndexOfBytes = lengthOfMessage - 1;

    const indexOfStartOfArgs = startIndex + 2;
    const objectId = uint8s[startIndex];
    const methodId = uint8s[startIndex + 1];

    if (lastIndexOfBytes < indexOfStartOfArgs) {
      return {
        [symbolsOfInvokingMessage_objectId]: objectId,
        [symbolsOfInvokingMessage_methodId]: methodId
      };
    }
    const args = valueView_parse(byteMessage, indexOfStartOfArgs);
    return {
      [symbolsOfInvokingMessage_objectId]: objectId,
      [symbolsOfInvokingMessage_methodId]: methodId,
      [symbolsOfInvokingMessage_args]: args
    };
  },

  createResponseWithSuccesResult(sizeOfHeader, value) {
    const out = valueView_bytiefy(sizeOfHeader + 1, value);
    new Uint8Array(out)[sizeOfHeader] = invokingMessagesHeaders_succes;
    return out;
  },

  createResponseWithError: createCreatingResponseWithErrorAndStackFn(invokingMessagesHeaders.error),

  createResponseWithSyncErrorFromAsyncFn: createCreatingResponseWithErrorAndStackFn(
    invokingMessagesHeaders.syncErrorFromAsyncFn
  ),

  sizeOfHeaderForResponseStatus: 1,

  setMalformedRequestStatusInArrayBuffer: createSettingHeaderOfStatusInArrayBufferFn(
    invokingMessagesHeaders.malformedRequest
  ),

  setSuccesStatusInArrayBuffer: createSettingHeaderOfStatusInArrayBufferFn(invokingMessagesHeaders.succes),

  setErrorStatusInArrayBuffer: createSettingHeaderOfStatusInArrayBufferFn(invokingMessagesHeaders.error),

  setSyncErrorFromAsyncFnStatusInArrayBuffer: createSettingHeaderOfStatusInArrayBufferFn(
    invokingMessagesHeaders.syncErrorFromAsyncFn
  ),

  setClientNotFoundMethodStatusInArrayBuffer: createSettingHeaderOfStatusInArrayBufferFn(
    invokingMessagesHeaders.clientNotFoundMethod
  )
};

const invokingMessagesHeaders_succes = invokingMessagesHeaders.succes;

Object.freeze(messenger);

module.exports = messenger;
