"use strict";

const expectTrue = require("assert").ok;
const expectFalse = (c) => expectTrue(!c);

const TestingSettingCheckingRemovingListenersTester = class {
  constructor(remoteEvent) {
    this[_remoteEvent] = remoteEvent;
    this[_listenersIds] = null;
  }

  getTest() {
    return _checkAddHasRemoveListener.bind(this);
  }

  getTearDownProcedure() {
    return _removeAllListeners.bind(this);
  }
};

const _remoteEvent= Symbol();
const _listenersIds= Symbol();

const _checkAddHasRemoveListener = function() {
  const event = this[_remoteEvent],
        listener1Id = event.setNewListener(),
        listener2Id = event.setNewListener();

  this[_listenersIds] = [listener1Id, listener2Id];

  expectTrue(event.hasListenerById(listener1Id));
  expectTrue(event.hasListenerById(listener2Id));

  event.removeListenerById(listener1Id);
  expectFalse(event.hasListenerById(listener1Id));
  expectTrue(event.hasListenerById(listener2Id));

  event.removeListenerById(listener2Id);
  expectFalse(event.hasListenerById(listener2Id));
};

const _removeAllListeners = function(tester) {
  const listenersIds = this[_listenersIds];
  if (listenersIds) {
    const event = this[_remoteEvent];
    for (const listenerId of listenersIds) {
      event.removeListenerById(listenerId);
    }
  }
};

module.exports = TestingSettingCheckingRemovingListenersTester;
