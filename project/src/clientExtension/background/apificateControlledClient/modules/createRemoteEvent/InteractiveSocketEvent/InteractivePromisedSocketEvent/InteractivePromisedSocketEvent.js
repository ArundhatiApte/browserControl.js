"use strict";

const createInformationEventListener = require("./../../InformationSocketEvent/createInformationSocketListener");
const InteractiveSocketEvent = require("./../InteractiveSocketEvent");
const createInteractivePromisedSocketListener = require("./createInteractivePromisedSocketListener");

const InteractivePromisedSocketEvent = class extends InteractiveSocketEvent {
  _createInteractiveListener = createInteractivePromisedSocketListener;
  _createInformationListener = createInformationEventListener;
};

module.exports = InteractivePromisedSocketEvent;
