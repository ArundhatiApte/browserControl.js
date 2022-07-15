"use strict";

const { _bufferForHeaderOfRequestOrResponse } = require("./../ResponsiveWrapperOfWebSocketConnection");

const {
  fillHeaderAsResponse: fillArrayBufferAsHeaderOfBinaryResponse
} = require("./../../../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/binaryMessager");

const fillHeaderThenSendItAnd2Fragments = require("./utilsForWebSocket/fillHeaderThenSendItAnd2Fragments");

const SenderOfResponse = class {
  constructor(webSocket, idOfMessage) {
    this[_connection] = webSocket;
    this[_idOfMessage] = idOfMessage;
  }

  sendBinaryResponse(message) {
    const connection = this[_connection];
    fillArrayBufferAsHeaderOfBinaryResponse(this[_idOfMessage], _bufferForHeaderOfRequestOrResponse);

    const messageIsBinary = true;
    connection.sendFirstFragment(_bufferForHeaderOfRequestOrResponse, messageIsBinary);
    connection.sendLastFragment(message, messageIsBinary);
  }

  send2FragmentsOfBinaryResponse(first, second) {
    return fillHeaderThenSendItAnd2Fragments(
      this[_connection],
      _bufferForHeaderOfRequestOrResponse,
      fillArrayBufferAsHeaderOfBinaryResponse,
      this[_idOfMessage],
      true,
      first,
      second
    );
  }
};

const _connection = Symbol(),
      _idOfMessage = Symbol();

module.exports = SenderOfResponse;
