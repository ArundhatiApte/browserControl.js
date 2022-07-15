"use strict";

const expectEqual = require("assert").strictEqual;

const ControllingSide = require("./../../../../ControllingSide/ControllingSide");

const {
  status: symbolsOfResponseOnInvokingMessage_status,
  result: symbolsOfResponseOnInvokingMessage_result,
  errorMessage: symbolsOfResponseOnInvokingMessage_errorMessage,
  errorStack: symbolsOfResponseOnInvokingMessage_errorStack
} = ControllingSide.symbolsOfResponseOnInvokingMessage;

const createCheckingGettingResponseWithErrorStatusAndMessageFn = (function() {
  const checkgGettingResponseWithErrorStatusAndMessage = async function(
    sendResponseFromControlledSide,
    statusOnServerWithError,
    controllingSide,
    controlledSide
  ) {
    controlledSide.setInvokingMessageListener((objectId, methodId, args, senderOfResponse) => (
      sendResponseFromControlledSide(senderOfResponse, errorMessage, errorStack)
    ));

    const resultOfCall = await controllingSide.sendInvokingMessage(1, 3, [4]);

    expectEqual(resultOfCall[symbolsOfResponseOnInvokingMessage_status], statusOnServerWithError);
    expectEqual(symbolsOfResponseOnInvokingMessage_result in resultOfCall, false);

    expectEqual(resultOfCall[symbolsOfResponseOnInvokingMessage_errorMessage], errorMessage);
    expectEqual(resultOfCall[symbolsOfResponseOnInvokingMessage_errorStack], errorStack);
  };

  const errorMessage = "poasjduiiad";
  const errorStack = "a(1),b(2),c(3),d(4)";

  return function(sendResponseFromControlledSide, statusOnServer) {
    return checkgGettingResponseWithErrorStatusAndMessage.bind(null, sendResponseFromControlledSide, statusOnServer);
  };
})();

const statusOnServer = ControllingSide.statusOfCall;

module.exports = {
  checkResponseWithError: createCheckingGettingResponseWithErrorStatusAndMessageFn(
    (rs, errorMessage, errorStack) => rs.sendError(errorMessage, errorStack),
    statusOnServer.error
  ),
  checkResponseWithSyncErrorFromAsyncFn: createCheckingGettingResponseWithErrorStatusAndMessageFn(
    (rs, errorMessage, errorStack) => rs.sendSyncErrorFromAsyncFn(errorMessage, errorStack),
    statusOnServer.syncErrorFromAsyncFn
  )
};

