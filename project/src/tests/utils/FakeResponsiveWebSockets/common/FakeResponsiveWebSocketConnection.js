"use strict";

const createEnum = require("createEnum");

const {
  TimeoutToReceiveResponseError
} = require(
  "./../../../../common/ResponsiveWebSockets/common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection"
);

const callToAvoidRecursion = require("./callToAvoidRecursion");

const _receiver = Symbol(),
      _onBinaryRequest = Symbol(),
      _onUnrequestingBinaryMessage = Symbol(),
      _onClose = Symbol(),
      _maxTimeMsToWaitResponse = Symbol();

const FakeResponsiveWebSocketConnection = class {
  constructor(receiver) {
    this[_receiver] = receiver;
    this[_maxTimeMsToWaitResponse] = 2000;

    // ускорение досупа к часто используемым методам
    this.sendBinaryRequest = this.sendBinaryRequest;
    this.sendUnrequestingBinaryMessage = this.sendUnrequestingBinaryMessage;
  }

  static TimeoutToReceiveResponseError = TimeoutToReceiveResponseError;

  setCloseListener(listener) {
    this[_onClose] = listener;
  }

  close(code, reason) {
    const event = {code, reason};
    this[_receiver]._emitClosingEvent(event);
    this._emitClosingEvent(event);
  }

  _emitClosingEvent(event) {
    return callToAvoidRecursion(() => {
      if (this[_onClose]) {
        this[_onClose](event);
      }
    });
  }

  setBinaryRequestListener(listener) {
    this[_onBinaryRequest] = listener;
  }

  setUnrequestingBinaryMessageListener(listener) {
    this[_onUnrequestingBinaryMessage] = listener;
  }

  setMaxTimeMsToWaitResponse(timeMs) {
    this[_maxTimeMsToWaitResponse] = timeMs;
  }

  get startIndexOfBodyInBinaryResponse() {
    return 0;
  }

  _receiveBinaryRequest(message) {
    return new Promise((resolve) => {
      if (this[_onBinaryRequest]) {
        const startIndex = 0,
              sendResponse = this._createSenderOfResponse(resolve);
        this[_onBinaryRequest](message, startIndex, sendResponse);
      }
    });
  }

  _receiveUnrequestingBinaryMessage(message) {
    if (this[_onUnrequestingBinaryMessage]) {
      const startIndex = 0;
      this[_onUnrequestingBinaryMessage](message, startIndex);
    }
  }

  sendBinaryRequest(bytes, maxTimeMsToWaitResponse) {
    return new Promise(async (resolve, reject) => {
      if (!maxTimeMsToWaitResponse) {
        maxTimeMsToWaitResponse = this[_maxTimeMsToWaitResponse];
      }
      const timeoutToReceiveResponse = _createTimeoutToReceiveResponse(reject, maxTimeMsToWaitResponse);
      const response = await this[_receiver]._receiveBinaryRequest(bytes);
      clearTimeout(timeoutToReceiveResponse);
      resolve(response);
    });
  }

  sendUnrequestingBinaryMessage(bytes) {
    return this[_receiver]._receiveUnrequestingBinaryMessage(bytes);
  }

  terminate() {}
};

const _createTimeoutToReceiveResponse = function(rejectPromise, maxTimeMsToWaitResponse) {
  return setTimeout(
    _rejectPromiseWithTimeoutToReceiveResponseException,
    maxTimeMsToWaitResponse,
    rejectPromise
  );
};

const _rejectPromiseWithTimeoutToReceiveResponseException = function(rejectPromise) {
  return rejectPromise(new TimeoutToReceiveResponseError("Timeout for receiving response."));
};

FakeResponsiveWebSocketConnection._namesOfPrivateProperties = {
  _receiver,
  _onBinaryRequest,
  _onUnrequestingBinaryMessage,
  _maxTimeMsToWaitResponse
};

module.exports = FakeResponsiveWebSocketConnection;
