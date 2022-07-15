"use strict";

const sendHeaderAndFragments = function(uWsWebSocket, binaryHeader, isMessageBinary, firstFragment, secondFragment) {
  uWsWebSocket.sendFirstFragment(binaryHeader, isMessageBinary); // ok
  uWsWebSocket.sendFragment(firstFragment, isMessageBinary);
  uWsWebSocket.sendLastFragment(secondFragment, isMessageBinary);
};

module.exports = sendHeaderAndFragments;
