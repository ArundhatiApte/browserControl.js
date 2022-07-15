"use strict";

const InteractiveOneEventEmitter = require("./InteractiveOneEventEmitter");

const InteractivePromisedOneEventEmitter = class extends InteractiveOneEventEmitter {
  _callListenerToGetResponse(interactiveOneEventEmitter, listener, args) {
    return listener.apply(interactiveOneEventEmitter, args);
  }
}

module.exports = InteractivePromisedOneEventEmitter;
