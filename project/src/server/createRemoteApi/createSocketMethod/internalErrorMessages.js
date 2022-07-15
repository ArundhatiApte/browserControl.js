"use strict";

const internalError = "Internal error:: ";

const internalErrorMessages = {
  createClientNotFoundMethodErrorMessage(objectId, methodId) {
    return internalError +
      "There is no method (id: " + methodId + ") of object (id: " + objectId + ") in browser namespace";
  },
  brokenRequestErrorMessage(objectId, methodId) {
    return internalError + "Browser send \"broken request\" status in response";
  },
  unknownError: "Internal error",
  responseTimeoutErrorMessage: internalError + "The time for waiting the response to method call has expired."
};

Object.freeze(internalErrorMessages);

module.exports = internalErrorMessages;
