"use strict";

const expectDeepEqual = require("assert").deepStrictEqual;
const areDeepEqual = require("util").isDeepStrictEqual;

const { addTestsFromTable } = require("./../../../../tests/utils/addingTestsFromTable");

const eventFactory = require("./../eventFactory");

const FakeSocketEventAPI = require("./utils/FakeSocketEventAPI");
const CheckingAddingHavingRemovingListenersTester = require(
  "./utils/CheckingAddingHavingRemovingListenersTester"
);

const createRemoteEvent = function(isInteractive, isPromised) {
  const socketEventAPI = new FakeSocketEventAPI();
  return eventFactory.create(socketEventAPI, isInteractive, isPromised);
};

const isInteractive = true;
const isPromised = true;

eventFactory.setMaxTimeMsToWaitResponseFromListener(200);


const testEmittingInformationEvent = function() {
  return new Promise(async function(resolve, reject) {
    const emittedArgs = [
      [1, 2], ["blah", "hah"], [{o: 1}]
    ];

    const informationEventEmitter = createRemoteEvent(!isInteractive);
    const recordedData = [];
    const expectedData = emittedArgs.slice();
    let countOfEventsToReceive = emittedArgs.length;

    const listenerId = await informationEventEmitter.addListener(function(...args) {
      recordedData.push(args);
      countOfEventsToReceive -= 1;
      if (countOfEventsToReceive === 0) {
        if (areDeepEqual(expectedData, recordedData)) {
          resolve();
        } else {
          reject(new Error("Different args for event."));
        }
      }
    });

    for (const args of emittedArgs) {
      informationEventEmitter.emitForInformationListener(listenerId, args);
    }
  })
};

const checkEmittingInteractiveEvent = async function(emitter, createListener) {
  const emittedArgs = [
    [1, 2], [3, 4], [5, 6], [7, 8]
  ];
  const multiple = (n) => (n * 2);
  const expectedResponsesFromListener = emittedArgs.map((nums) => nums.map(multiple));
  const recordedResponsesFromListener = [];
  const listener = createListener(multiple);
  const listenerId = await emitter.addListener(listener, true);

  for (const args of emittedArgs) {
    const response = await emitter.emitForInteractiveListener(listenerId, args);
    recordedResponsesFromListener.push(response);
  }
  expectDeepEqual(expectedResponsesFromListener, recordedResponsesFromListener);
};

const testInteractiveCallbackedEventEmitter = function() {
  return checkEmittingInteractiveEvent(createRemoteEvent(isInteractive, !isPromised), function createListener(doWithArg) {
    return function() {
      const len = arguments.length,
            callback = arguments[len - 1],
            out = [],
            lenMinus1 = len - 1;

      for (let i = 0; i < lenMinus1; i += 1) {
        out.push(doWithArg(arguments[i]));
      }
      callback(out);
    };
  });
};

const testInteractivePromisedEventEmitter = function() {
  return checkEmittingInteractiveEvent(createRemoteEvent(isInteractive, isPromised), function createListener(doWithArg) {
    return function() {
      const len = arguments.length,
            out = [];

      for (let i = 0; i < len; i += 1) {
        out.push(doWithArg(arguments[i]));
      }
      return Promise.resolve(out);
    };
  });
};

// TODO
// testTimeoutToReciveResponseFromListenerOfInteractiveEvent,
// testEmitingToListenerOfInteractiveEventThatIsn'tInteractive

describe("тест объектов событий сервера", function() {
  addCheckingAddingHavingRemovingTests(it);
  addTestsFromTable(it, [
    ["информационные события", testEmittingInformationEvent],
    ["интерактивные события на обещаниях", testInteractivePromisedEventEmitter],
    ["интерактивные события на обратных вызовах", testInteractiveCallbackedEventEmitter]
  ]);
});

function addCheckingAddingHavingRemovingTests(addTest) {
  const informationEventEmitter = createRemoteEvent(!isInteractive);
  const callbackedEventEmitter = createRemoteEvent(isInteractive);
  const promisedEventEmitter = createRemoteEvent(isInteractive, isPromised);

  const prefixOfTestName = "добавление, проверка, удаление обработчиков у ";
  for (const eventEmitter of [informationEventEmitter, callbackedEventEmitter, promisedEventEmitter]) {
    const testingAddHasRemove = new CheckingAddingHavingRemovingListenersTester(eventEmitter);
    addTest(prefixOfTestName + eventEmitter.constructor.name, testingAddHasRemove.createTest());
    after(testingAddHasRemove.createCleaningProcedure());
  }
}
