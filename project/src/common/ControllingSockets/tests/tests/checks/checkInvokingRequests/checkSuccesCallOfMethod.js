"use strict";

const expectEqual = require("assert").strictEqual;

const ControllingSide = require("./../../../../ControllingSide/ControllingSide");
const ControlledSide = require("./../../../../ControlledSide/ControlledSide");

const {
  status: symbolsOfResponseOnInvokingMessage_status,
  result: symbolsOfResponseOnInvokingMessage_result
} = ControllingSide.symbolsOfResponseOnInvokingMessage;

const checkSuccesCallOfMethod = async function(controllingSide, controlledSide) {
  const objectId = 4,
        methodId = 8,
        args = [1, 2],
        result = 3;

  let isValidData;
  controlledSide.setInvokingMessageListener(function(iObjectId, iMethodId, args, senderOfResponse) {
    isValidData = (iObjectId === objectId && iMethodId === methodId);
    senderOfResponse.sendResult(args[0] + args[1]);
  });

  const serverSuccesStatusOfCall = ControllingSide.statusOfCall.succes;
  const resultOfCall = await controllingSide.sendInvokingMessage(objectId, methodId, args);

  expectEqual(isValidData, true);
  expectEqual(resultOfCall[symbolsOfResponseOnInvokingMessage_status], serverSuccesStatusOfCall);
  expectEqual(resultOfCall[symbolsOfResponseOnInvokingMessage_result], result);
};

module.exports = checkSuccesCallOfMethod;
