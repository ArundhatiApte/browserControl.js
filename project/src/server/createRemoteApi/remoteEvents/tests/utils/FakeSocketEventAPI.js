"use strict";

const _generateListenerId = (function() {
  let listenerIdGen = 0;
  return function() {
    listenerIdGen += 1;
    return listenerIdGen;
  };
})();

const FakeSocketEventAPI = class {
  constructor() {
    this[_listenersIds] = [];
  }

  async setNewListener() {
    const listenerId = _generateListenerId();
    this[_listenersIds].push(listenerId);
    return listenerId;
  }

  async hasListenerById(listenerId) {
    return this[_listenersIds].indexOf(listenerId) !== -1;
  }

  async removeListenerById(listenerId) {
    const listenersIds = this[_listenersIds];
    const prevIdx = listenersIds.indexOf(listenerId);
    if (prevIdx === -1) {
      return;
    }
    listenersIds.splice(prevIdx, 1);
  }
};

const _listenersIds = Symbol();

module.exports = FakeSocketEventAPI;
