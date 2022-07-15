"use strict";

const OneEventEmitter = class {
  constructor() {
    this[_listeners] = new Set();
  }

  addListener(listener) {
    return this[_listeners].add(listener);
  }

  hasListener(listener) {
    return this[_listeners].has(listener);
  }

  removeListener(listener) {
    this[_listeners].delete(listener);
  }

  emit() {
    for (const listener of this[_listeners]) {
      listener.apply(this, arguments);
    }
  }

  getCountOfListeners() {
    return this[_listeners].size;
  }
};

const _listeners = Symbol();
const _onceListeners = Symbol();

module.exports = OneEventEmitter;
