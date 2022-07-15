"use strict";

const isDeepEqual = require("util").isDeepStrictEqual;
const SocketEventEmitter = require("./SocketEventEmitter");

const {
  _socketEventApi,
  _listenersData
} = SocketEventEmitter._namesOfProtectedProperties;

const {
  id: entry_id,
  filters: entry_filters
} = SocketEventEmitter._namesOfEntryProperties;

const RemoteInformationSocketEventEmitter = class extends SocketEventEmitter {
  constructor(socketEventApi) {
    super(socketEventApi);
  }

  async addListener(listener, ...filters) {
    const callbacksToListenersIds = this[_listenersData],
          prevEntry = callbacksToListenersIds.get(listener);

    if (!prevEntry) {
      return await _setListenerBySocket(this, listener, filters);
    } else {
      if (prevEntry[entry_filters] && isDeepEqual(filters, prevEntry[entry_filters])) {
        return;
      }
      await this[_socketEventApi].removeListenerById(prevEntry[entry_id]);
      return await _setListenerBySocket(this, listener, filters);
    }
  }

  emitForInformationListener(listenerId, args) {
    const listener = _findListenerById(this[_listenersData], listenerId);
    if (!listener) {
      return;
    }
    listener.apply(null, args);
  }
};

const _setListenerBySocket = async function(remoteInformationSocketEventEmitter, listener, filters) {
  const socketEvent = remoteInformationSocketEventEmitter[_socketEventApi];
  const callbacksToData = remoteInformationSocketEventEmitter[_listenersData];

  let listenerId;
  if (filters.length === 0) {
    listenerId = await socketEvent.setNewListener();
  } else {
    listenerId = await socketEvent.setNewListener.apply(socketEvent, filters);
  }
  const toSet = {[entry_id]: listenerId};
  if (filters) {
    toSet[entry_filters] = filters;
  }
  callbacksToData.set(listener, toSet);
  return listenerId;
};

const _findListenerById = function(listenersData, listenerId) {
  for (const [listener, info] of listenersData.entries()) {
    if (info[entry_id] === listenerId) {
      return listener;
    }
  }
  return null;
};

module.exports = RemoteInformationSocketEventEmitter;
