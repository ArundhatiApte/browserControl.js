"use strict";

const expectEqual = require("assert").strictEqual;

const ControllingSide = require("./../../../../ControllingSide/ControllingSide");

const serversStatusOfCall = ControllingSide.statusOfCall;

const {
  status: symbolsOfResponseOnInvokingMessage_status,
  result: symbolsOfResponseOnInvokingMessage_result
} = ControllingSide.symbolsOfResponseOnInvokingMessage;

const createCheckingGettingStatusWihErrorFn = (function() {
  const checkingGettingStatusWihError = async function(
    sendStatusFromControlledSide,
    statusOnServer,
    controllingSide,
    controlledSide
  ) {
    controlledSide.setInvokingMessageListener((objectId, methodId, args, senderOfResponse) => (
      sendStatusFromControlledSide(senderOfResponse)
    ));

    const resultOfCall = await controllingSide.sendInvokingMessage(1, 3, [4]);
    expectEqual(resultOfCall[symbolsOfResponseOnInvokingMessage_status], statusOnServer);
    expectEqual(symbolsOfResponseOnInvokingMessage_result in resultOfCall, false);
  };

  return function(sendStatusFromControlledSide, statusOnServer) {
    return checkingGettingStatusWihError.bind(null, sendStatusFromControlledSide, statusOnServer);
  };
})();

module.exports = {
  checkResponseWithClientNotFoundMethodStatus: createCheckingGettingStatusWihErrorFn(
    (senderOfResponse) => senderOfResponse.sendClientNotFoundMethodStatus(),
    serversStatusOfCall.clientNotFoundMethod
  ),
  checkResponseWithSyncErrorFromAsyncFnStatus: createCheckingGettingStatusWihErrorFn(
    (senderOfResponse) => senderOfResponse.sendSyncErrorFromAsyncFnStatus(),
    serversStatusOfCall.syncErrorFromAsyncFn
  )
};

