"use strict" ;

const {
  ok: expectTrue
} = require("assert");

const Tester = class {
  constructor(eventApi) {
    this[_eventApi] = eventApi;
    this[_listeners] = _emptyArray;
  }

  createTest() {
    return _checkAddingHavingRemovingListeners.bind(this);
  }

  createCleaningProcedure() {
    return _removeAllListeners.bind(this);
  }
};

const _eventApi = Symbol();
const _listeners = Symbol();

const _emptyArray = [];

const _checkAddingHavingRemovingListeners = async function() {
  const listener1 = function() {};
  const listener2 = function() {};

  const listeners = this[_listeners] = [listener1, listener2];
  const eventApi = this[_eventApi];

  await Promise.all(listeners.map((listener) => eventApi.addListener(listener)));

  for (const listener of listeners) {
    expectTrue(eventApi.hasListener(listener));
  }

  await Promise.all(listeners.map((listener) => eventApi.removeListener(listener)));

  for (const listener of listeners) {
    expectTrue(!(await eventApi.hasListener(listener)));
  }
};

const _removeAllListeners = function() {
  const eventApi = this[_eventApi];
  return Promise.all(this[_listeners].map((listener) => eventApi.removeListener(listener)));
};

module.exports = Tester;
