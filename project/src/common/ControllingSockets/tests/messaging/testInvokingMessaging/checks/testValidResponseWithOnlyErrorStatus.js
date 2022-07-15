"use strict";

const expectEqual = require("assert").strictEqual;

const testValidResponseWithOnlyErrorStatus = function(serverMessanger, clientMessanger) {
  const { parseResponseOnInvokingMessage } = serverMessanger;
  const symbols_status = serverMessanger.symbolsOfResponseOnInvokingMessage.status;

  const checkParsingResponse = function(setErrorStatusInArrayBuffer, arrayBuffer, index, statusOnServer) {
    setErrorStatusInArrayBuffer(arrayBuffer, index);
    const parsed = parseResponseOnInvokingMessage(arrayBuffer, index);
    expectEqual(statusOnServer, parsed[symbols_status]);
  };

  const statusOnServer = serverMessanger.statusOfCall;
  const sizeOfHeader = 1;
  const arrayBufferForResponse = new ArrayBuffer(sizeOfHeader + clientMessanger.sizeOfHeaderForResponseStatus);

  const settingStatusInArrayBufferFnToStatusOnServer = [
    [clientMessanger.setMalformedRequestStatusInArrayBuffer, statusOnServer.malformedRequest],
    [clientMessanger.setErrorStatusInArrayBuffer, statusOnServer.error],
    [clientMessanger.setSyncErrorFromAsyncFnStatusInArrayBuffer, statusOnServer.syncErrorFromAsyncFn],
    [clientMessanger.setClientNotFoundMethodStatusInArrayBuffer, statusOnServer.clientNotFoundMethod]
  ];

  for (const [fn, status] of settingStatusInArrayBufferFnToStatusOnServer) {
    checkParsingResponse(fn, arrayBufferForResponse, sizeOfHeader, status);
  }
};

module.exports = testValidResponseWithOnlyErrorStatus;
