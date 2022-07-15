"use strict";

const InformationSocketEvent = require("./InformationSocketEvent/InformationSocketEvent");
const InteractiveCallbackedSocketEvent = require(
  "./InteractiveSocketEvent/InteractiveCallbackedSocketEvent/InteractiveCallbackedSocketEvent"
);
const InteractivePromisedSocketEvent = require(
  "./InteractiveSocketEvent/InteractivePromisedSocketEvent/InteractivePromisedSocketEvent"
);

const createRemoteEvent = function(controlledClient, eventApi, eventId, isInteractive, isPromised) {
  const SocketEvent = (!isInteractive) ?
    InformationSocketEvent :
    ((isPromised) ? InteractivePromisedSocketEvent : InteractiveCallbackedSocketEvent);
  return new SocketEvent(controlledClient, eventApi, eventId);
};

module.exports = createRemoteEvent;
