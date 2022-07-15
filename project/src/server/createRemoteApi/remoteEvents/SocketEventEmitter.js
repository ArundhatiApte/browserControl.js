"use strict";

const SocketEventEmitter = class {
  constructor(socketEventApi) {
    this[_socketEventApi] = socketEventApi;
    this[_listenersData] = new Map(); // listener -> { id, filters }
  }

  async hasListener(listener) {
    return this[_listenersData].has(listener);
  }

  async removeListener(listener) {
    const callbacksToData = this[_listenersData],
          entry = callbacksToData.get(listener);
    if (!entry) {
      return;
    }
    await this[_socketEventApi].removeListenerById(entry[entry_id]);
    callbacksToData.delete(listener);
  }
};

const _socketEventApi = Symbol(),
      _listenersData = Symbol();

SocketEventEmitter._namesOfProtectedProperties = {
  _socketEventApi,
  _listenersData
};

const entry_id = Symbol();
const entry_filters = Symbol();

SocketEventEmitter._namesOfEntryProperties = {
  id: entry_id,
  filters: entry_filters
};

module.exports = SocketEventEmitter;
