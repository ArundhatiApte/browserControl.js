"use strict";

const checkResponseAboutError = require("./utils/checkResponseAboutError");

const createCheckingCreatingAndParsingResponseWithErrorMessageFn = (function() {
  const checkCreatingAndParsingResponseWithErrorMessage = function(
    createResponseWithErrorMessageAndStack,
    errorMessage,
    errorStack,
    parseResponseOnInvokingMessage,
    statusOnServer
  ) {
    const sizeOfHeader = 1;
    const message = createResponseWithErrorMessageAndStack(sizeOfHeader, errorMessage, errorStack);
    const parsed = parseResponseOnInvokingMessage(message, sizeOfHeader);
    checkResponseAboutError(parsed, statusOnServer, errorMessage, errorStack);
  };

  return function(createResponseWithError, errorMessage, errorStack, parseResponseOnInvokingMessage, statusOnServer) {
    return checkCreatingAndParsingResponseWithErrorMessage.bind(
      null,
      createResponseWithError,
      errorMessage,
      errorStack,
      parseResponseOnInvokingMessage,
      statusOnServer
    );
  };
})();

module.exports = createCheckingCreatingAndParsingResponseWithErrorMessageFn;
