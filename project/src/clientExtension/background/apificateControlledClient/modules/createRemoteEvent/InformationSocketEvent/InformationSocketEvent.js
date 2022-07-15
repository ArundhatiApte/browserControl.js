"use strict";

const SocketEvent = require("./../SocketEvent");
const createInformationSocketListener = require("./createInformationSocketListener");

const {
  _namesOfProtectedProperties: {
    _controlledClient,
    _eventApi,
    _eventId,
    _listenerIdToListener
  },
  _getNextIdOfListener
} = SocketEvent;

const InformationSocketEvent = class extends SocketEvent {

  setNewListener(...eventFilters) {
    const listenerId = _getNextIdOfListener();

    const listener = createInformationSocketListener(
      this[_controlledClient],
      this[_eventId],
      listenerId
    );

    if (eventFilters.length === 0) {
      this[_eventApi].addListener(listener);
    } else {
      this[_eventApi].addListener(listener, ...eventFilters);
    }
    this[_listenerIdToListener].set(listenerId, listener);
    return listenerId;
  }
};

module.exports = InformationSocketEvent;
