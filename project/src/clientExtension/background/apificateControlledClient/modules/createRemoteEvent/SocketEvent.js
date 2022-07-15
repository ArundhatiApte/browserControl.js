"use strict";

const getNextInteger = require("./modules/getNextInteger");

const SocketEvent = class {
  constructor(controlledClient, eventApi, eventId) {
    this[_controlledClient] = controlledClient;
    this[_eventApi] = eventApi;
    this[_eventId] = eventId;
    this[_listenerIdToListener] = new Map();
  }

  hasListenerById(listenerId) {
    return this[_listenerIdToListener].has(listenerId);
  }

  removeListenerById(listenerId) {
    const listener = this[_listenerIdToListener].get(listenerId);
    if (!listener) {
      return;
    }
    this[_eventApi].removeListener(listener);
    this[_listenerIdToListener].delete(listenerId);
  }
};


const _controlledClient = "_",
      _eventApi = "_e",
      _eventId = "_i",
      _listenerIdToListener = "_d";

SocketEvent._getNextIdOfListener = getNextInteger;

SocketEvent._namesOfProtectedProperties = {
  _controlledClient,
  _eventApi,
  _eventId,
  _listenerIdToListener
};

module.exports = SocketEvent;
