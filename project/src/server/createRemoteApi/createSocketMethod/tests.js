"use strict";

const {
  strictEqual: expectEqual,
  rejects: expectThrowsAsync
} = require("assert");


const { addTestsFromTable } = require("./../../../tests/utils/addingTestsFromTable");

const {
  TimeoutToReceiveResponseError,
  symbolsOfResponseOnInvokingMessage: {
    status: symbolsOfResponseOnInvokingMessage_status,
    result: symbolsOfResponseOnInvokingMessage_result,
    errorMessage: symbolsOfResponseOnInvokingMessage_errorMessage,
    errorStack: symbolsOfResponseOnInvokingMessage_errorStack
  }
} = require(
  "./../../../common/ControlSockets/ControllingSide/ControllingSide"
);

const statusOfCall = require("./../../ControllingServer/ControllingServer").statusOfCall;
const createSocketMethod = require("./createSocketMethod");

const fakeControllingConnection = {
  sendInvokingMessage(objectId, methodId, args) {
    this.lastArgs = args;
    return Promise.resolve(this.resultOfCall);
  },
  lastArgs: null,
  resultOfCall: null
};

const checkCalling = async function(objectId, methodId, isMethodReturnig, args, resultToSend) {
  const callMethod = createSocketMethod(fakeControllingConnection, objectId, methodId, true);
  fakeControllingConnection.resultOfCall = resultToSend;
  const result = await callMethod.apply(null, args);
  expectEqual(result, resultToSend[symbolsOfResponseOnInvokingMessage_result]);
};

const testSuccesCall = checkCalling.bind(null, 0, 2, true, [2, 3], {
  [symbolsOfResponseOnInvokingMessage_status]: statusOfCall.succes,
  [symbolsOfResponseOnInvokingMessage_result]: 2 + 3
});

const testSuccesVoidCall = checkCalling.bind(null, 3, 4, false, undefined, {
  [symbolsOfResponseOnInvokingMessage_status]: statusOfCall.succes
});

const checkCallingWithError = async function(errorMessage, errorStack, statusOfCall) {
  const callMethod = createSocketMethod(fakeControllingConnection, 1, 234, true);
  fakeControllingConnection.resultOfCall = {
    [symbolsOfResponseOnInvokingMessage_status]: statusOfCall,
    [symbolsOfResponseOnInvokingMessage_errorMessage]: errorMessage,
    [symbolsOfResponseOnInvokingMessage_errorStack]: errorStack
  };
  await expectThrowsAsync(() => callMethod(1, 2), function(error) {
    expectEqual(error.constructor, createSocketMethod.ErrorFromClient);
    expectEqual(error.message, errorMessage);
    expectEqual(error.sourceStack, errorStack);
    return true;
  });
};

const testCallWithError = checkCallingWithError.bind(null, "error", "a-b-c-d", statusOfCall.error);
const testCallToAsyncFnThatThrowsErrorSync = checkCallingWithError.bind(
  null,
  "e",
  "stack",
  statusOfCall.syncErrorFromAsyncFn
);

describe("тест вызова процедур через соединения", function() {
  addTestsFromTable(it, [
    ["успешный вызов метода", testSuccesCall],
    ["успешный вызов без возвращаемого значения", testSuccesVoidCall],
    ["вызов с ошибкой", testCallWithError],
    ["вызов асинхронного метода, выбрасывающего ошибу синхронно", testCallToAsyncFnThatThrowsErrorSync]
  ]);
});
