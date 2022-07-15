"use strict";

const {
  _namesOfProtectedProperties: {
    _connection,
    _getNextIdOfRequest,
    _idOfRequestToPromise,
    _maxTimeMsToWaitResponse,
  }
} = require("./../../../../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");

const createTimeoutToReceiveResponse = require(
  "./../../../../../common/ResponsiveWebSocketConnection/utils/createTimeoutToReceiveResponse"
);
const createEntryAboutPromiseOfRequest = require(
  "./../../../../../common/ResponsiveWebSocketConnection/utils/entryAboutPromiseOfRequest"
).create;

const {
  fillHeaderAsRequest: fillArrayBufferAsHeaderOfBinaryRequest
} = require("./../../../../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/binaryMessager");

const { _bufferForHeaderOfRequestOrResponse } = require("./../../ResponsiveWrapperOfWebSocketConnection");
const sendHeaderAnd2Fragments = require("./../utilsForWebSocket/sendHeaderAnd2Fragments");

const sendFragmentsOfBinaryRequest = function(firstFragment, secondFragment) {
  return new Promise((resolve, reject) => {
    const idOfRequest = this[_getNextIdOfRequest]();
    const idOfRequestToPromise = this[_idOfRequestToPromise];
    const timeout = createTimeoutToReceiveResponse(
      idOfRequestToPromise,
      idOfRequest,
      reject,
      this[_maxTimeMsToWaitResponse]
    );

    const entryAboutPromise = createEntryAboutPromiseOfRequest(resolve, timeout);
    idOfRequestToPromise.set(idOfRequest, entryAboutPromise);

    fillArrayBufferAsHeaderOfBinaryRequest(idOfRequest, _bufferForHeaderOfRequestOrResponse);
    sendHeaderAnd2Fragments(
      this[_connection],
      _bufferForHeaderOfRequestOrResponse,
      true,
      firstFragment,
      secondFragment
    );
  });
};

module.exports = sendFragmentsOfBinaryRequest;
