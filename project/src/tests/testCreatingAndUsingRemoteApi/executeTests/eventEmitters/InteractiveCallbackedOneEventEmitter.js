"use strict";

const InteractiveOneEventEmitter = require("./InteractiveOneEventEmitter");

const InteractiveCallbackedOneEventEmitter = class extends InteractiveOneEventEmitter {
  _callListenerToGetResponse(interactiveOneEventEmitter, listener, args) {
    return new Promise(function(resolve) {
      const newArgs = args.concat(resolve);
      listener.apply(interactiveOneEventEmitter, newArgs);
    });
  }
}

module.exports = InteractiveCallbackedOneEventEmitter;
