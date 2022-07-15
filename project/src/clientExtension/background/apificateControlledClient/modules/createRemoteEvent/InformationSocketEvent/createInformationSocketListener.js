"use strict";

const sliceArray = Array.prototype.slice;

const create = function(controlledSide, eventId, listenerId) {
  return sendInformationeEventBySocket.bind(null, controlledSide, eventId, listenerId);
};

const sendInformationeEventBySocket = function(controlledSide, eventId, listenerId) {
  if (arguments.length === 3) {
    controlledSide.sendInformationEventMessage(
      eventId,
      listenerId
    );
  } else {
    controlledSide.sendInformationEventMessage(
      eventId,
      listenerId,
      sliceArray.call(arguments, 3)
    );
  }
};

module.exports = create;
