"use strict";

const { createAndAddTestsFromTable } = require("./../../../../../tests/utils/addingTestsFromTable");

const serverMessanger = require(
  "./../../../ControllingSide/modules/messaging/invokingMessageCreatorAndResponseParser"
);
const clientMessanger = require(
  "./../../../ControlledSide/modules/messaging/invokingMessageParserAndResponseCreator"
);

const {
  createCheckingCreatingAndParsingResponseWithErrorMessageFn,

  testCreatingAndParsingValidInvokingMessagesWithArgs,
  testCreatingAndParsingValidInvokingMessageWithoutArgs,
  testResponses,
  testBrokenMessages,
  testValidResponseWithOnlyErrorStatus
} = require("./checks");

const statusOnServer = serverMessanger.statusOfCall;

const testValidResponseWithErrorMessage = createCheckingCreatingAndParsingResponseWithErrorMessageFn(
  clientMessanger.createResponseWithError,
  "time to sleep",
  "a,b,c,d",
  serverMessanger.parseResponseOnInvokingMessage,
  statusOnServer.error
);

const testMessagesAboutSyncErrorFromAsyncFn = createCheckingCreatingAndParsingResponseWithErrorMessageFn(
  clientMessanger.createResponseWithSyncErrorFromAsyncFn,
  "Error#",
  "d(1), e(2)",
  serverMessanger.parseResponseOnInvokingMessage,
  statusOnServer.syncErrorFromAsyncFn
);

describe("тест форматирования и разбора сообщений о вызовах функций", function() {
  const runTest = function(check) {
    return check(serverMessanger, clientMessanger);
  };
  const createTest = function(check) {
    return runTest.bind(null, check);
  };

  createAndAddTestsFromTable(createTest, it, [
    ["cообщения с параметрами", testCreatingAndParsingValidInvokingMessagesWithArgs],
    ["сообщения без параметров", testCreatingAndParsingValidInvokingMessageWithoutArgs],
    ["ответы", testResponses],
    ["повреждённые сообщения", testBrokenMessages],
    ["ответ только со статусами ошибки", testValidResponseWithOnlyErrorStatus]
  ]);

  it("ответ с сообщением об ошибке", testValidResponseWithErrorMessage);
  it(
    "ответ с сообщением о выброшенной синхронно ошибке из асинхронной функции",
    testMessagesAboutSyncErrorFromAsyncFn
  );
});
