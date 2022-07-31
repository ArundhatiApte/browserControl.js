"use strict";

const {
  checkResponseWithClientNotFoundMethodStatus,
  checkResponseWithSyncErrorFromAsyncFnStatus
} = require("./checkResponsesWithErrorStatus");

const {
  checkResponseWithError,
  checkResponseWithSyncErrorFromAsyncFn
} = require("./checkResponsesWithErrorStatusMessageAndStack");

module.exports = {
  checkSuccesCallOfMethod: require("./checkSuccesCallOfMethod"),
  checkSuccesCallOfMethodWithoutArgs: require("./checkSuccesCallOfMethodWithoutArgs"),
  checkCallingMethodsAndReceivingResponses: require("./checkCallingMethodsAndReceivingResponses"),

  checkResponseWithError,
  checkResponseWithSyncErrorFromAsyncFn,

  checkResponseWithClientNotFoundMethodStatus,
  checkResponseWithSyncErrorFromAsyncFnStatus,

  checkTimeoutOfCall: require("./checkTimeoutOfCall")
};
