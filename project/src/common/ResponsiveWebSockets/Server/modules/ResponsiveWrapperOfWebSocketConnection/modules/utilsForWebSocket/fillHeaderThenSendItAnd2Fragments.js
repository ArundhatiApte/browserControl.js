"use strict";

const sendHeaderAnd2Fragments = require("./sendHeaderAnd2Fragments");

const fillHeaderThenSendItAnd2Fragments = function(
  uWsWebSocket,
  arrayBufferAsHeader,
  fillHeader,
  idOfMessage,
  isMessageBinary,
  firstFragment,
  secondFragment
) {
  fillHeader(idOfMessage, arrayBufferAsHeader);
  sendHeaderAnd2Fragments(uWsWebSocket, arrayBufferAsHeader, isMessageBinary, firstFragment, secondFragment);
};

module.exports = fillHeaderThenSendItAnd2Fragments;
