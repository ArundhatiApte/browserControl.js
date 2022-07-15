"use strict";

const FakeResponsiveWebSocketConnection = require("./../common/FakeResponsiveWebSocketConnection");
const fakeResponsiveWebSocketServer = require("./../server/server");

const { _receiver } = FakeResponsiveWebSocketConnection._namesOfPrivateProperties;

const FakeWebSocketClient = class extends FakeResponsiveWebSocketConnection{
  constructor() {
    super();
  }

  async connect(anythingUrl) {
    const httpRequest = null;
    const resultsOfHandshake = await fakeResponsiveWebSocketServer._performHandshake(httpRequest, this);
    if (resultsOfHandshake.wasAccepted) {
      this[_receiver] = resultsOfHandshake.serverConnection;
    } else {
      throw new Error("Сервер отказал в соединении.");
    }
  }

  _createSenderOfResponse = require("./createSenderOfResponse");

  get sizeOfHeaderForBinaryRequest() {
    return 0;
  }

  get sizeOfHeaderForBinaryResponse() {
    return 0;
  }

  get sizeOfHeaderForUnrequestingBinaryMessage() {
    return 0;
  }
};

module.exports = FakeWebSocketClient;
