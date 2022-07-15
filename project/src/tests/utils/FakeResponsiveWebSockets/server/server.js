"use strict";

const _onConnection = Symbol();
const _onUpgrade = Symbol();

const _callToAvoidRecursion = require("./../common/callToAvoidRecursion");

const FakeResponsiveWebSocketServer = class {
  constructor() {}

  close() {}

  async listen(port) {}

  setConnectionListener(listenerOrNull) {
    this[_onConnection] = listenerOrNull;
  }

  setUpgradeListener(listenerOrNull) {
    this[_onUpgrade] = listenerOrNull;
  }

  async _performHandshake(httpRequest, fakeRequestingWebSocketClient) {
    if (this[_onUpgrade]) {
      return _callListnerOfUpgradeEvent(this, httpRequest, fakeRequestingWebSocketClient);
    }
    return _emitConnectionEvent(this, fakeRequestingWebSocketClient);
  }
};

const server = new FakeResponsiveWebSocketServer();
server._namesOfPrivateProperties = { _onConnection };

module.exports = server;

// ok, взаимозависимость
const FakeResponsiveConnectionToClient = require("./modules/FakeResponsiveConnectionToClient");
const ActionOnHandshake = require("./modules/ActionOnHandshake");
const emitConnectionEventAvoidingRecursion = require("./modules/emitConnectionEventAvoidingRecursion");

const _callListnerOfUpgradeEvent = function(server, httpRequest, client) {
  return new Promise(function(resolve) {
    const actionOnHandshake = new ActionOnHandshake(server, client, resolve);
    _callToAvoidRecursion(function() {
      return server[_onUpgrade](httpRequest, actionOnHandshake)
    });
  });
};

const _emitConnectionEvent = async function(server, client) {
  const connectionToClient = new FakeResponsiveConnectionToClient(client);
  emitConnectionEventAvoidingRecursion(server, connectionToClient);
  return {wasAccepted: true, serverConnection: connectionToClient};
};
