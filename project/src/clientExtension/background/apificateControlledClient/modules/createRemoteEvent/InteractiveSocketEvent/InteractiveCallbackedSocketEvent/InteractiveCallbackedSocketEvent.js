"use strict";

const InteractiveSocketEvent = require("./../InteractiveSocketEvent");

const {
  createInteractiveCallbackedSocketListener,
  createInformationEventListener
} = require("./creatingListeners");

const InteractiveCallbackedSocketEvent = class extends InteractiveSocketEvent {
  _createInteractiveListener = createInteractiveCallbackedSocketListener;
  _createInformationListener = createInformationEventListener;
};

module.exports = InteractiveCallbackedSocketEvent;
