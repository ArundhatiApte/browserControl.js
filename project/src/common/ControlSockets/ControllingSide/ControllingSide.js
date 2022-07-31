"use strict";

const {
  TimeoutToReceiveResponseError
} = require("./../../ResponsiveWebSockets/common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");

const emptyFunction = require("./../common/emptyFunction");
const checkListener = require("./../common/checkListener");
const logDebugMessage = require("./../common/logDebugMessage");

const {
  classificatorOfIncomingMessages: {
    extractHeader: classificatorOfIncomingMessages_extractHeader,
    headersOfIncomingMessages: {
      event: headersOfIncomingMessages_event,
      descriptionAboutApi: headersOfIncomingMessages_descriptionAboutApi
    }
  },
  invokingMessageCreatorAndResponseParser: {
    sizeOfHeaderForInvokingMessage: invokingMessageCreatorAndResponseParser_sizeOfHeaderForInvokingMessage,
    fillArrayBufferAsHeaderOfInvokingMessage: invokingMessager_fillArrayBufferAsHeaderOfInvokingMessage,
    createBodyFromArgs: invokingMessager_createBodyFromArgs,
    parseResponseOnInvokingMessage: invokingMessager_parseResponseOnInvokingMessage,
    statusOfCall,
    symbolsOfResponseOnInvokingMessage
  },
  eventMessageParserAndResponseCreator,
  messengerWithDescriptionAboutApi: {
    parseMessageAboutApiDescription: apiMessager_parseMessageAboutApiDescription
  }
} = require("./modules/messaging/index");

const {
  parseEventMessage: eventMessager_parseEventMessage,
  createEventListenerResponse: eventMessager_createEventListenerResponse
} = eventMessageParserAndResponseCreator;

const ControllingSide = class {
  constructor(responsiveWebSocketConnection) {
    this[_connection] = responsiveWebSocketConnection;
    this[_startIndexOfBodyInBinaryResponse] = responsiveWebSocketConnection.startIndexOfBodyInBinaryResponse;
    this[_headerForMethodCall] = new ArrayBuffer(
      invokingMessageCreatorAndResponseParser_sizeOfHeaderForInvokingMessage
    );

    responsiveWebSocketConnection.setMaxTimeMsToWaitResponse(_defaultMaxTimeMsToWaitResponse);
    _setupListenersOnConnection(this, responsiveWebSocketConnection);

    this[_onInteractiveEventMessage] = emptyFunction;
    this[_onInformationEventMessage] = emptyFunction;
    this[_onDescribingApiMessage] = emptyFunction;

    // ускорение досупа к часто используемым методам
    this.sendInvokingMessage = this.sendInvokingMessage;
  }

  static statusOfCall = statusOfCall;
  static symbolsOfEvent = eventMessageParserAndResponseCreator.symbolsOfEvent;
  static symbolsOfResponseOnInvokingMessage = symbolsOfResponseOnInvokingMessage;
  static TimeoutToReceiveResponseError = TimeoutToReceiveResponseError;

  setInteractiveEventMessageListener(listener) {
    checkListener(listener);
    this[_onInteractiveEventMessage] = listener;
  }

  setInformationEventMessageListener(listener) {
    checkListener(listener);
    this[_onInformationEventMessage] = listener;
  }

  setDescribingApiMessageListener(listener) {
    checkListener(listener);
    this[_onDescribingApiMessage] = listener;
  }

  setMaxTimeMsToWaitResponse(ms) {
    return this[_connection].setMaxTimeMsToWaitResponse(ms);
  }

  async sendInvokingMessage(objectId, methodId, args) {
    if ((!args) || args.length === 0) {
      return _sendInvokingMessageWithoutArgs(this, objectId, methodId);
    }
    return _sendInvokingMessageWithArgs(this, objectId, methodId, args);
  }
};

const _connection = Symbol(),
      _headerForMethodCall = Symbol(),
      _onInteractiveEventMessage = Symbol(),
      _onInformationEventMessage = Symbol(),
      _onDescribingApiMessage = Symbol(),
      _startIndexOfBodyInBinaryResponse = Symbol();

const _defaultMaxTimeMsToWaitResponse = 8000;

ControllingSide._namesOfProtectedProperties = {
  _connection
};

const _setupListenersOnConnection = function(controllingSide, responsiveWSConnection) {
  responsiveWSConnection.setUnrequestingBinaryMessageListener(_emitInformationOrApiDescriptionMessageEvent.bind(
    controllingSide
  ));
  responsiveWSConnection.setBinaryRequestListener(_emitInteractiveEventMessage.bind(controllingSide));
};

const _emitInformationOrApiDescriptionMessageEvent = function(byteMessage, startIndex) {
  const header = classificatorOfIncomingMessages_extractHeader(byteMessage, startIndex);

  if (header === headersOfIncomingMessages_event) {
    return _emitOnInformationEventMessage(this, byteMessage, startIndex);
  }
  if (header === headersOfIncomingMessages_descriptionAboutApi) {
    return _emitOnApiDescriptionMessage(this, byteMessage, startIndex);
  }
  logDebugMessage("ControllingSide received unrequesting message with unrecognized header.");
};

const _emitOnInformationEventMessage = function(controllingSide, messageWithHeaders, startIndex) {
  const eventData = eventMessager_parseEventMessage(messageWithHeaders, startIndex);
  controllingSide[_onInformationEventMessage](eventData);
};

const _emitOnApiDescriptionMessage = function(controllingSide, messageWithHeaders, startIndex) {
  const descOfApi = apiMessager_parseMessageAboutApiDescription(messageWithHeaders, startIndex);
  controllingSide[_onDescribingApiMessage](descOfApi);
};

const _emitInteractiveEventMessage = function(byteMessage, startIndex, responseSender) {
  const header = classificatorOfIncomingMessages_extractHeader(byteMessage, startIndex);

  if (header === headersOfIncomingMessages_event) {
    _emitOnInteractiveEventMessage(this, byteMessage, startIndex, responseSender);
    return;
  }
  logDebugMessage("ControllingSide onBinaryRequest: message with unrecognized header.");
};

const _emitOnInteractiveEventMessage = function(controllingSide, messageWithHeaders, startIndex, responseSender) {
  const eventData = eventMessager_parseEventMessage(messageWithHeaders, startIndex),
        sendResponseFromListener = _createSendingResponseFromEventListenersFn(responseSender);

  controllingSide[_onInteractiveEventMessage](eventData, sendResponseFromListener);
};

const _createSendingResponseFromEventListenersFn = function(responseSender) {
  return _sendResponseFromEventListener.bind(null, responseSender);
};

const _sendResponseFromEventListener = function(responseSender, responseFromListener) {
  return responseSender.sendBinaryResponse(eventMessager_createEventListenerResponse(responseFromListener));
};

const _sendInvokingMessageWithoutArgs = async function(
  controllingSide,
  objectId,
  methodId
) {
  const message = controllingSide[_headerForMethodCall];
  invokingMessager_fillArrayBufferAsHeaderOfInvokingMessage(message, objectId, methodId);

  const binaryResponse = await controllingSide[_connection].sendBinaryRequest(message);
  return invokingMessager_parseResponseOnInvokingMessage(
    binaryResponse,
    controllingSide[_startIndexOfBodyInBinaryResponse]
  );
};

const _sendInvokingMessageWithArgs = async function(
  controllingSide,
  objectId,
  methodId,
  args
) {
  const headerOfRequest = controllingSide[_headerForMethodCall];
  invokingMessager_fillArrayBufferAsHeaderOfInvokingMessage(headerOfRequest, objectId, methodId);

  const binaryResponse = await controllingSide[_connection].send2FragmentsOfBinaryRequest(
    headerOfRequest,
    invokingMessager_createBodyFromArgs(args)
  );
  return invokingMessager_parseResponseOnInvokingMessage(
    binaryResponse,
    controllingSide[_startIndexOfBodyInBinaryResponse]
  );
};

module.exports = ControllingSide;
