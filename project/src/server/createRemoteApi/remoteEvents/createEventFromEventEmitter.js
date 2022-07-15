"use strict";

const Event = class {
  constructor(oneEventEmitter) {
    this[_oneEventEmitter] = oneEventEmitter;
  }

  hasListener(listener) {
    return this[_oneEventEmitter].hasListener(listener);
  }

  removeListener(listener) {
    return this[_oneEventEmitter].removeListener(listener);
  }
};

const _oneEventEmitter = Symbol();

const InformationEvent = class extends Event {
  addListener(listener, ...eventFilters) {
    return this[_oneEventEmitter].addListener(listener, ...eventFilters);
  }
};

const InteractiveEvent = class extends Event {
  addListener(listener, isListenerInteractive, ...eventFilters) {
    return this[_oneEventEmitter].addListener(listener,  isListenerInteractive, ...eventFilters);
  }
};

const createEvent = function(oneEventEmitter, isInteractive) {
  if (!isInteractive) {
    return new InformationEvent(oneEventEmitter);
  } else {
    return new InteractiveEvent(oneEventEmitter);
  }
};

module.exports = createEvent;
