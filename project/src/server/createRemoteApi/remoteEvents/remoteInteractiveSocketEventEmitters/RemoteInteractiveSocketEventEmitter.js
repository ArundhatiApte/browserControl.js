"use scrict";

const isDeepEqual = require("util").isDeepStrictEqual;
const SocketEventEmitter = require("./../SocketEventEmitter");

const {
  _socketEventApi,
  _listenersData
} = SocketEventEmitter._namesOfProtectedProperties;

const {
  id: entry_id,
  filters: entry_filters
} = SocketEventEmitter._namesOfEntryProperties;

const entry_isInteractive = Symbol();

const RemoteInteractiveSocketEventEmitter = class extends SocketEventEmitter {
  constructor(socketEventApi) {
    super(socketEventApi);
  }

  async addListener(listener, isInteractive, ...filters) {
    const callbacksToListenersIds = this[_listenersData],
          prevEntry = callbacksToListenersIds.get(listener);

    if (!prevEntry) {
      return await _setListenerBySocket(this, listener, isInteractive, filters);
    } else {
      if (
        prevEntry[entry_filters] &&
        prevEntry[entry_isInteractive] === isInteractive &&
        isDeepEqual(filters, prevEntry[entry_filters])
      ) {
        return;
      }
      await this[_socketEventApi].removeListenerById(prevEntry[entry_id]);
      return await _setListenerBySocket(this, listener, isInteractive, filters);
    }
  }

  emitForInformationListener(listenerId, args) {
    const entry = _findListenerAndStatsById(this[_listenersData], listenerId);
    if (!entry) {
      throw new Error("There is no listener with id: " +  listenerId);
    }
    const [listener, stats] = entry;
    if (stats[entry_isInteractive]) {
      throw new ListenerIsInteractiveError("Listener is interactive.");
    }
    listener.apply(null, args);
  }

  emitForInteractiveListener(listenerId, args) {
    return new Promise((resolve, reject) => {
      const entry = _findListenerAndStatsById(this[_listenersData], listenerId);
      if (!entry) {
        throw new Error("There is no listener with id: " +  listenerId);
      }
      const [listener, stats] = entry;
      if (stats[entry_isInteractive]) {
        return this._callAsyncListenerToGetResponse(listener, args, resolve, reject);
      }
      reject(new ListenerIsNotInteractiveError(
        "Listener with id: " + listenerId + "is information, isn't interactive."
      ));
    });
  }
};

const _setListenerBySocket = async function(remoteInteractiveSocketEventEmitter, listener, isInteractive, filters) {
  const socketEvent = remoteInteractiveSocketEventEmitter[_socketEventApi];
  const callbacksToData = remoteInteractiveSocketEventEmitter[_listenersData];

  let listenerId;

  if (filters.length === 0) {
    listenerId = await socketEvent.setNewListener(isInteractive);
  } else {
    const args = [isInteractive].concat(filters);
    listenerId = await socketEvent.setNewListener.apply(socketEvent, args);
  }

  const toSet = {[entry_id]: listenerId};
  if (filters.length) {
    toSet[entry_filters] = filters;
  }
  if (isInteractive) {
    toSet[entry_isInteractive] = true;
  }
  callbacksToData.set(listener, toSet);
  return listenerId;
};

const _findListenerAndStatsById = function(listnersData, listenerId) {
  for (const entry of listnersData.entries()) {
    const info = entry[1];
    if (info[entry_id] === listenerId) {
      return entry;
    }
  }
  return null;
};

RemoteInteractiveSocketEventEmitter._createTimeoutToReceiveResponse = function(rejectPromise) {
  return setTimeout(_rejectPromiseWithTimeoutError, _maxTimeMsToWaitResponseFromListener, rejectPromise);
};

const _rejectPromiseWithTimeoutError = function(rejectPromise) {
  return rejectPromise(new TimeoutToReceiveResponseFromListenerError(
    "Timeout for response from event listener."
  ));
};

RemoteInteractiveSocketEventEmitter._createResponseAcceptor = function(resolvePromise, timeout) {
  return _clearTimeoutAndResolvePromise.bind(null, timeout, resolvePromise);
};

const _clearTimeoutAndResolvePromise = function(timeout, resolvePromise, response) {
  clearTimeout(timeout);
  resolvePromise(response);
};

const TimeoutToReceiveResponseFromListenerError = class extends Error {};
RemoteInteractiveSocketEventEmitter.TimeoutToReceiveResponseFromListenerError = TimeoutToReceiveResponseFromListenerError;

const ListenerIsNotInteractiveError = class extends Error {};
RemoteInteractiveSocketEventEmitter.ListenerIsNotInteractiveError = ListenerIsNotInteractiveError;

const ListenerIsInteractiveError = class extends Error {};
RemoteInteractiveSocketEventEmitter.ListenerIsInteractiveError = ListenerIsInteractiveError;

let _maxTimeMsToWaitResponseFromListener = 4000;

RemoteInteractiveSocketEventEmitter.setMaxTimeMsToWaitResponseFromListener = function(ms) {
  _maxTimeMsToWaitResponseFromListener = ms;
};

module.exports = RemoteInteractiveSocketEventEmitter;
