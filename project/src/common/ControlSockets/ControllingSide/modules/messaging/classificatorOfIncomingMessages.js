"use strict" ;

const createEnum = require("createEnum");

const messagesHeaders = require("./../../../common/messagesHeaders");

const classificatorOfIncomingMessages = {
  extractHeader(message, startIndex) { // startIndex всегда указан
    return new DataView(message).getUint8(startIndex);
  },
  headersOfIncomingMessages: {
    event: messagesHeaders.events.clientHeader,
    descriptionAboutApi: messagesHeaders.descriptionAboutApi.clientHeader
  }
};

module.exports = classificatorOfIncomingMessages;
