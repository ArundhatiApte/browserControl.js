"use strict";

const InteractiveOneEventEmitter = class {
  constructor() {
    this[_listeners] = [];
  }

  addListener(listener) {
    this[_listeners].push(listener);
  }

  async emit(...args) {
    const listeners = this[_listeners];
    if (listeners.length === 0) {
      return null;
    }
    const callListenerToGetResponse = this._callListenerToGetResponse;
    return await Promise.all(listeners.map(
      (listener) => callListenerToGetResponse(this, listener, args)
    ));
  }
};

const _listeners = Symbol();

module.exports = InteractiveOneEventEmitter;
