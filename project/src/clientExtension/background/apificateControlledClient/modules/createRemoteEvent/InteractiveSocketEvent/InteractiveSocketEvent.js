"use strict";

const SocketEvent = require("./../SocketEvent");
const {
  _namesOfProtectedProperties: {
    _controlledClient,
    _eventApi,
    _eventId,
    _listenerIdToListener
  },
  _getNextIdOfListener
} = SocketEvent;

const InteractiveSocketEvent = class extends SocketEvent {

  setNewListener(isInteractive, ...eventFilters) {
    const listenerId = _getNextIdOfListener();

    const listener = isInteractive ?
      this._createInteractiveListener(this[_controlledClient], this[_eventId], listenerId) :
      this._createInformationListener(this[_controlledClient], this[_eventId], listenerId);

    if (eventFilters.length === 0) {
      this[_eventApi].addListener(listener);
    } else {
      this[_eventApi].addListener(listener, ...eventFilters);
    }
    this[_listenerIdToListener].set(listenerId, listener);
    return listenerId;
  }
};

module.exports = InteractiveSocketEvent;
