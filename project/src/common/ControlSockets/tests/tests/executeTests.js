"use strict";

const { createAndAddTestsFromTable } = require("./../../../../tests/utils/addingTestsFromTable");

const {
  checkSuccesCallOfMethod,
  checkSuccesCallOfMethodWithoutArgs,
  checkCallingMethodsAndReceivingResponses,

  checkResponseWithError,
  checkResponseWithSyncErrorFromAsyncFn,

  checkResponseWithClientNotFoundMethodStatus,
  checkResponseWithSyncErrorFromAsyncFnStatus,

  checkTimeoutOfCall,

  checkInformationEvents,
  checkInteractiveEvents,

  checkSendingDescriptionOfApi
} = require("./checks/checks");

const executeTests = function(describeTests, addTest, options) {
  describeTests(options.nameOfTests, function() {
    setupTests(describeTests, addTest, options);
  });
};

const setupTests = function(describeTests, addTest, options) {
  const { createControllingAndControlledSides } = options;

  let controllingSide;
  let controlledSide;

  before(async function createConnections() {
    const cons = await createControllingAndControlledSides();
    controllingSide = cons.controllingSide;
    controlledSide = cons.controlledSide;
  });

  const createTest = function(check) {
    return runTest.bind(null, check);
  };
  const runTest = function(check) {
    return check(controllingSide, controlledSide);
  };

  addTests(describeTests, addTest, createTest);
};

const addTests = function(describeTests, addTest, createTest) {
  describeTests("вызов методов", function() {
    this.slow(250); // checkTimeoutOfCall

    createAndAddTestsFromTable(createTest, addTest, [
      ["успешный вызов метода", checkSuccesCallOfMethod],
      ["успешный вызов без параметров", checkSuccesCallOfMethodWithoutArgs],
      ["вызов методов и получение ответов", checkCallingMethodsAndReceivingResponses],

      ["ответ с сообщением об ошибке и стеком", checkResponseWithError],
      [
        "ответ с сообщением о выброшеноой синхр. ошибке из асинхр. функции и стеком",
        checkResponseWithSyncErrorFromAsyncFn
      ],

      ["ответ со статусом \"отсутсвует метод\"", checkResponseWithClientNotFoundMethodStatus],
      ["ответ со статусом \"синхронная ошибка асинхронной функции\"", checkResponseWithSyncErrorFromAsyncFnStatus],

      ["истечение времения ожидания ответа на вызов метода", checkTimeoutOfCall]
    ]);
  });
  describeTests("события", function() {
    createAndAddTestsFromTable(createTest, addTest, [
      ["информационные события", checkInformationEvents],
      ["интерактивные события", checkInteractiveEvents]
    ]);
  });
  addTest("отправка описания API", createTest(checkSendingDescriptionOfApi));
};

module.exports = executeTests;
