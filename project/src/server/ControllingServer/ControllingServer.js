"use strcit";

const ControllingConnection = require("./modules/ControllingConnection");
const ResponsiveWebSocketServer = require("./../../common/ResponsiveWebSockets/Server/ResponsiveWebSocketServer");

const ControllingServer = class {
  constructor(responsiveWebSocketServer) {
    responsiveWebSocketServer = this[_server] = responsiveWebSocketServer || new ResponsiveWebSocketServer();
    responsiveWebSocketServer.setConnectionListener(_emitOnConnectionEvent.bind(this));
  }

  setConnectionListener(listener) {
    this[_onConnectionCreated] = listener;
  }

  close() {
    return this[_server].close();
  }

  listen(port) {
    return this[_server].listen(port);
  }
};

const _server = Symbol();
const _onConnectionCreated = Symbol();

const _emitOnConnectionEvent = function(responsiveConnectionToClient) {
  if (this[_onConnectionCreated]) {
    const controlingConnection = new ControllingConnection(responsiveConnectionToClient);
    this[_onConnectionCreated](controlingConnection);
  }
};

ControllingServer.statusOfCall = ControllingConnection.statusOfCall;

module.exports = ControllingServer;
