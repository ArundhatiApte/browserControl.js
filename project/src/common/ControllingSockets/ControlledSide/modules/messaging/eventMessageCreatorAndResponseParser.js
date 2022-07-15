"use strict";

const eventHeader = require("./../../../common/messagesHeaders").events.clientHeader;

const {
  parse: valueView_parse,
  bytiefy: valueView_bytiefy
} = require("./../../../../valueView/valueView");

const eventMessanger = {
  createEventMessage(sizeOfHeader, eventId, listenerId, args) {
    // listenerId 4 байта
    const out = args ? valueView_bytiefy(sizeOfHeader + 6, args) : new ArrayBuffer(sizeOfHeader + 6);
    const dataView = new DataView(out);

    dataView.setUint8(sizeOfHeader, eventHeader);
    dataView.setUint8(sizeOfHeader + 1, eventId);
    dataView.setUint32(sizeOfHeader + 2, listenerId);

    return out;
  },
  parseResponse(responseFromListener, startIndex) {
    try {
      return valueView_parse(responseFromListener, startIndex);
    } catch(error) {
      throw new Error("Broken response from event listener.");
    }
  }
};

module.exports = eventMessanger;
