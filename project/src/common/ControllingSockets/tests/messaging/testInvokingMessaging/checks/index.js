"use strict";

module.exports = {
  createCheckingCreatingAndParsingResponseWithErrorMessageFn: require(
    "./createCheckingCreatingAndParsingResponseWithErrorMessageFn"
  ),

  testCreatingAndParsingValidInvokingMessagesWithArgs: require(
    "./testCreatingAndParsingValidInvokingMessagesWithArgs"
  ),
  testCreatingAndParsingValidInvokingMessageWithoutArgs: require(
    "./testCreatingAndParsingValidInvokingMessageWithoutArgs"
  ),
  testResponses: require("./testResponses"),
  testBrokenMessages: require("./testBrokenMessages"),
  testValidResponseWithOnlyErrorStatus: require("./testValidResponseWithOnlyErrorStatus")
};
