"use strcit";

const {
  TimeoutToReceiveResponseError
} = require("./../../ResponsiveWebSockets/Client/ResponsiveWebSocketClient");

const checkListener = require("./../common/checkListener");
const emptyFunction = require("./../common/emptyFunction");
const logDebugMessage = require("./../common/logDebugMessage");

const {
  invokingMessageParserAndResponseCreator: invokingMessager,
  eventMessageCreatorAndResponseParser: {
    createEventMessage: eventMessager_createEventMessage,
    parseResponse: eventMessager_parseResponse
  },
  typesOfResultsOfMethodCall,
  descriptorOfApiMessageCreator: {
    createMessageAboutApiDescription: descriptorOfApiMessager_createMessageAboutApiDescription
  }
} = require("./modules/messaging");

const {
  succes: typesOfResultsOfMethodCall_succes,
  error: typesOfResultsOfMethodCall_error,
  syncErrorFromAsyncFn: typesOfResultsOfMethodCall_syncErrorFromAsyncFn
} = typesOfResultsOfMethodCall;

const {
  symbolsOfsInvokingMessage: {
    objectId: symbolsOfInvokingMessage_objectId,
    methodId: symbolsOfInvokingMessage_methodId,
    args: symbolsOfInvokingMessage_args
  },
  parseInvokingMessage: invokingMessager_parseInvokingMessage,

  createResponseWithSuccesResult: invokingMessager_createResponseWithSuccesResult,
  setSuccesStatusInArrayBuffer: invokingMessager_setSuccesStatusInArrayBuffer,

  createResponseWithError: invokingMessager_createResponseWithError,
  createResponseWithSyncErrorFromAsyncFn: invokingMessager_createResponseWithSyncErrorFromAsyncFn,

  setSyncErrorFromAsyncFnStatusInArrayBuffer: invokingMessager_setSyncErrorFromAsyncFnStatusInArrayBuffer
} = invokingMessager;

const ControlledSide = class {
  constructor(responsiveWSConnection) {
    this[_connection] = responsiveWSConnection;
    this[_startIndexOfBodyInBinaryResponse] = responsiveWSConnection.startIndexOfBodyInBinaryResponse;

    this[_sizeOfHeaderForRequest] = responsiveWSConnection.sizeOfHeaderForBinaryRequest;
    const sizeOfHeaderForResponse = this[_sizeOfHeaderForResponse]
      = responsiveWSConnection.sizeOfHeaderForBinaryResponse;
    this[_sizeOfHeaderForUnrequestingMessage] = responsiveWSConnection.sizeOfHeaderForUnrequestingBinaryMessage;

    this[_arrayBufferForResponseOnlyWithStatus] = new ArrayBuffer(
      sizeOfHeaderForResponse + invokingMessager.sizeOfHeaderForResponseStatus
    );
    _setupOnInvokingMessageListener(this, responsiveWSConnection);

    this[_onInvokingMessage] = emptyFunction;

    // ускорение досупа к часто используемым методам
    this.sendInformationEventMessage = this.sendInformationEventMessage;
    this.sendInteractiveEventMessage = this.sendInteractiveEventMessage;
  }

  setInvokingMessageListener(listener) {
    checkListener(listener);
    this[_onInvokingMessage] = listener;
  }

  setMaxTimeMsToWaitResponse(ms) {
    return this[_connection].setMaxTimeMsToWaitResponse(ms);
  }

  sendInformationEventMessage(eventId, listenerId, args) {
    const message = eventMessager_createEventMessage(
      this[_sizeOfHeaderForUnrequestingMessage],
      eventId,
      listenerId,
      args
    );
    this[_connection].sendUnrequestingBinaryMessage(message);
  }

  async sendInteractiveEventMessage(eventId, listenerId, args) {
    const message = eventMessager_createEventMessage(
      this[_sizeOfHeaderForRequest],
      eventId,
      listenerId,
      args
    );
    const binaryResponse = await this[_connection].sendBinaryRequest(message);
    try {
      return eventMessager_parseResponse(binaryResponse, this[_startIndexOfBodyInBinaryResponse]);
    } catch(error) {
      throw new Error(
        "Malformed response on message about interactive event with id: " + eventId +
        " from listener with id: " + listenerId +
        ". Uint8s: " + new Uint8Array(binaryResponse, this[_startIndexOfBodyInBinaryResponse]).toString()
      );
    }
  }

  sendDescribingApiMessage(descriptionAboutApi) {
    const message = descriptorOfApiMessager_createMessageAboutApiDescription(
      this[_sizeOfHeaderForUnrequestingMessage],
      descriptionAboutApi
    );
    this[_connection].sendUnrequestingBinaryMessage(message);
  }
};

const _connection = Symbol();
const _onInvokingMessage = Symbol();

const _sizeOfHeaderForRequest = Symbol();
const _sizeOfHeaderForResponse = Symbol();
const _sizeOfHeaderForUnrequestingMessage = Symbol();

const _startIndexOfBodyInBinaryResponse = Symbol();
const _arrayBufferForResponseOnlyWithStatus = Symbol();

ControlledSide._namesOfProtectedProperties = {
  _connection,
  _sizeOfHeaderForResponse,
  _arrayBufferForResponseOnlyWithStatus
};

const _setupOnInvokingMessageListener = function(controlledSide, responsiveWSConnection) {
  return responsiveWSConnection.setBinaryRequestListener(_callOnInvokingMessageListener.bind(controlledSide));
};

const _callOnInvokingMessageListener = function(message, startIndex, senderOfResponse) {
  let infoAboutCall;
  try {
    infoAboutCall = invokingMessager_parseInvokingMessage(message, startIndex);
  } catch(error) {
    return _sendResponseWithMalformedRequestStatus(this, senderOfResponse);
  }
  const senderOfResult = new SenderOfResultOnInvokation(this, senderOfResponse);
  this[_onInvokingMessage](
    infoAboutCall[symbolsOfInvokingMessage_objectId],
    infoAboutCall[symbolsOfInvokingMessage_methodId],
    infoAboutCall[symbolsOfInvokingMessage_args],
    senderOfResult
  );
};

const _sendResponseWithMalformedRequestStatus = function(controlledSide, responseSender) {
  const arrayBuffer = controlledSide[_arrayBufferForResponseOnlyWithStatus];
  invokingMessager.setMalformedRequestStatusInArrayBuffer(arrayBuffer, controlledSide[_sizeOfHeaderForResponse]);
  responseSender.sendBinaryResponse(arrayBuffer);
};

ControlledSide.statusOfCall = typesOfResultsOfMethodCall;
ControlledSide.TimeoutToReceiveResponseError = TimeoutToReceiveResponseError;

module.exports = ControlledSide;

const SenderOfResultOnInvokation = require("./modules/SenderOfResultOnInvokation");
