"use strict";

const {
  _connection,
  _getNextIdOfRequest,
  _idOfRequestToPromise,
  _maxTimeMsToWaitResponse,
} = require("./../ResponsiveWebSocketConnection")._namesOfProtectedProperties;

const createTimeoutToReceiveResponse = require("./createTimeoutToReceiveResponse");
const createEntryAboutPromiseOfRequest = require("./entryAboutPromiseOfRequest").create;

const sendRequestByResponsiveConnection = function(
  responsiveConnection,
  message,
  maxTimeMsToWaitResponse,
  sendMessageOfRequest
) {
  return new Promise(function(resolve, reject) {
    if (!maxTimeMsToWaitResponse) {
      maxTimeMsToWaitResponse = responsiveConnection[_maxTimeMsToWaitResponse];
    }
    const idOfRequest = responsiveConnection[_getNextIdOfRequest]();
    const idOfRequestToPromise = responsiveConnection[_idOfRequestToPromise];
    const timeout = createTimeoutToReceiveResponse(
      idOfRequestToPromise,
      idOfRequest,
      reject,
      maxTimeMsToWaitResponse
    );
    const entryAboutPromise = createEntryAboutPromiseOfRequest(resolve, timeout);
    idOfRequestToPromise.set(idOfRequest, entryAboutPromise);
    sendMessageOfRequest(responsiveConnection, idOfRequest, message);
  });
};

module.exports = sendRequestByResponsiveConnection;
