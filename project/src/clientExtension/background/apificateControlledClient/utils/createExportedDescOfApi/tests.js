"use strict";

const expectDeepEqual = require("assert").deepStrictEqual;

const createExportedDescOfApi = require("./createExportedDescOfApi");

const test = function() {
  const isAsync = true;
  const isReturning = true;

  const inputDescOfMethod = function(method, id, isAsync, isReturning) {
    return {
      link: method,
      id,
      isMethod: true,
      isAsync: !!isAsync,
      isReturning: !!isReturning
    };
  };

  const noOp = () => {};
  const inputDescOfEvent = function(event, id, isInteractive, isPromised) {
    return {
      link: event,
      id,
      isEvent: true,
      isInteractive: !!isInteractive,
      isPromised: !!isPromised,

      setNewListener: inputDescOfMethod(noOp, 0, false, true),
      hasListenerById: inputDescOfMethod(noOp, 1, false, true),
      removeListenerById: inputDescOfMethod(noOp, 2, false, true)
    };
  };

  const inputDescOfApi = {
    tabs: {
      id: 0,
      create: inputDescOfMethod(() => {}, 16, isAsync, isReturning),
      remove: inputDescOfMethod(() => {}, 13, isAsync),
      onUpdated: inputDescOfEvent({}, 32)
    },
    webNavigation: {
      id: 1,
      onBeforeNavigate: inputDescOfEvent({}, 64, true, true)
    }
  };

  const outputDescOfMethod = function(id, isReturning) {
    return {
      id,
      isMethod: true,
      isReturning: !!isReturning
    };
  };

  const outputDescOfEvent = function(id, isInteractive, isPromised) {
    return {
      id,
      isEvent: true,
      isInteractive: !!isInteractive,
      isPromised: !!isPromised,

      setNewListener: outputDescOfMethod(0, true),
      hasListenerById: outputDescOfMethod(1, true),
      removeListenerById: outputDescOfMethod(2, true)
    };
  };

  const expectedResult = {
    tabs: {
      id: 0,
      create: outputDescOfMethod(16, isReturning),
      remove: outputDescOfMethod(13),
      onUpdated: outputDescOfEvent(32)
    },
    webNavigation: {
      id: 1,
      onBeforeNavigate: outputDescOfEvent(64, true, true)
    }
  };

  const result = createExportedDescOfApi(inputDescOfApi);
  expectDeepEqual(result, expectedResult);
};

describe("тест создания описания экспорируемого Api", function() {
  it("т", test);
});
