"use strict";

const expectEqual = require("assert").strictEqual;

const ControllingSide = require("./../../../../ControllingSide/ControllingSide");

const {
  status: symbolsOfResponseOnInvokingMessage_status,
  data: symbolsOfResponseOnInvokingMessage_data
} = ControllingSide.symbolsOfResponseOnInvokingMessage;

const checkSuccesCallOfMethodWithoutArgs = async function(controllingSide, controlledSide) {
  const objectId = 11,
        methodId = 8;
  let isArgsSended;

  controlledSide.setInvokingMessageListener(function(objectId, methodId, args, senderOfResponse) {
    isArgsSended = Array.isArray(args);
    senderOfResponse.sendSuccesStatus();
  });

  const resultOfCall = await controllingSide.sendInvokingMessage(objectId, methodId);

  expectEqual(resultOfCall[symbolsOfResponseOnInvokingMessage_status], ControllingSide.statusOfCall.succes);
  expectEqual(symbolsOfResponseOnInvokingMessage_data in resultOfCall, false);
  expectEqual(isArgsSended, false);
};

module.exports = checkSuccesCallOfMethodWithoutArgs;
