"use strict";

const messagesHeaders = require("./../../../common/messagesHeaders");

const {
  parse: valueView_parse,
  bytiefy: valueView_bytiefy
} = require("./../../../../valueView/valueView");

const symbolsOfEvent_eventId = Symbol();
const symbolsOfEvent_listenerId = Symbol();
const symbolsOfEvent_args = Symbol();

const messenger = {
  symbolsOfEvent: Object.freeze({
    eventId: symbolsOfEvent_eventId,
    listenerId: symbolsOfEvent_listenerId,
    args: symbolsOfEvent_args
  }),
  parseEventMessage(byteMessage, startIndex) { // startIndex указан всегда
    const lenghOfMessage = byteMessage.byteLength;
    if (lenghOfMessage < startIndex + 5)  {
      throw new Error("Message about event is too short.");
    }

    const dataView = new DataView(byteMessage);

    const eventId = dataView.getUint8(startIndex + 1);
    const listenerId = dataView.getUint32(startIndex + 2);

    const lastIndexInMessage = lenghOfMessage - 1;
    const indexOfArgsStart = startIndex + 6;

    if (lastIndexInMessage < indexOfArgsStart) {
      const out = {
        [symbolsOfEvent_eventId]: eventId,
        [symbolsOfEvent_listenerId]: listenerId
      };
      return out;
    }

    const args = valueView_parse(byteMessage, indexOfArgsStart);
    const out = {
      [symbolsOfEvent_eventId]: eventId,
      [symbolsOfEvent_listenerId]: listenerId,
      [symbolsOfEvent_args]: args
    };
    return out;
  },
  createEventListenerResponse: valueView_bytiefy.bind(null, 0)
};

module.exports = messenger;
