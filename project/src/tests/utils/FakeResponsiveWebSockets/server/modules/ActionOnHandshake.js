"use strict";

const FakeResponsiveConnectionToClient = require("./FakeResponsiveConnectionToClient");

const ActionOnHandshake = class {
  constructor(server, client, resolverOfPromise) {
    this[_server] = server;
    this[_client] = client;
    this[_resolverOfPromise] = resolverOfPromise;
  }

  acceptConnection(userDataOptional) {
    const connectionToClient = new FakeResponsiveConnectionToClient(this[_client], userDataOptional);
    emitConnectionEventAvoidingRecursion(this[_server], connectionToClient);
    this[_resolverOfPromise]({wasAccepted: true, serverConnection: connectionToClient});
  }

  rejectConnection() {
    return this[_resolverOfPromise]({wasAccepted: false});
  }
};

const _server = Symbol();
const _client = Symbol();
const _resolverOfPromise = Symbol();

module.exports = ActionOnHandshake;

// ok
const emitConnectionEventAvoidingRecursion = require("./emitConnectionEventAvoidingRecursion");
