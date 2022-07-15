"use strict";

const {
  strictEqual: expectEqual,
  deepStrictEqual: expectDeepEqual
} = require("assert");

const areDeepEqual = require("util").isDeepStrictEqual;

const ControllingSide = require("./../../../../../../common/ControllingSockets/ControllingSide/ControllingSide");
const ControlledSide = require("./../../../../../../common/ControllingSockets/ControlledSide/ControlledSide");

const {
  eventId: symbolsOfEvent_eventId,
  listenerId: symbolsOfEvent_listenerId,
  args: symbolsOfEvent_args
} = ControllingSide.symbolsOfEvent;

const { addTestsFromTable } = require("./../../../../../../tests/utils/addingTestsFromTable");
const OneEventEmitter = require("./../../../../../../tests/utils/OneEventEmitter/OneEventEmitter");

const fakeResponsiveWSServer = require(
  "./../../../../../../tests/utils/FakeResponsiveWebSockets/server/server"
);
const FakeResponsiveWSClient = require(
  "./../../../../../../tests/utils/FakeResponsiveWebSockets/Client/Client"
);

const createRemoteEvent = require("./../createRemoteEvent");
const TestingSettingCheckingRemovingListenersTester = require("./TestingSettingCheckingRemovingListenersTester");

let controllingSide, controlledSide;

const createConnections = function() {
  return new Promise(function(resolve) {
    const client = new FakeResponsiveWSClient();
    controlledSide = new ControlledSide(client);

    fakeResponsiveWSServer.setConnectionListener(async function(connectionToClient) {
      controllingSide = new ControllingSide(connectionToClient);
      await connectingClient;
      resolve();
    });

    const connectingClient = client.connect("ws://any.thing");
  });
};

const emitted = [
  [null], [0, -1, 10], ["str"], [{
    sscAuto: "Tautra",
    koenigsegg: "Agera"
  }], ["a", "y", "r"], [["sub", {arg: 1}]]
];

const testInformationEvent = function() {
  return new Promise(function(resolve, reject) {
    const oneEventEmiter = new OneEventEmitter();
    const idOfEvent = 38;

    const remoteEvent = createRemoteEvent(
      controlledSide,
      oneEventEmiter,
      idOfEvent,
      false,
      false
    );
    remoteEvent.setNewListener();

    const recorded = [];
    let areAllEventsIdsValid;
    let countOfEventsToRecord = emitted.length;

    controllingSide.setInformationEventMessageListener(function(dataAboutEvent) {
      countOfEventsToRecord -= 1;
      areAllEventsIdsValid = idOfEvent === dataAboutEvent[symbolsOfEvent_eventId];
      recorded.push(dataAboutEvent[symbolsOfEvent_args]);

      if (countOfEventsToRecord === 0) {
        if (areDeepEqual(recorded, emitted)) {
          resolve();
        } else {
          reject(new Error("Different data about events."));
        }
      }
    });

    const emitEvent = oneEventEmiter.emit;
    emitted.forEach((args) => emitEvent.apply(oneEventEmiter, args));
  });
};

const checkInteractiveEvent = async function(
  createTestingEventEmiter,
  idOfEvent,
  isInteractive,
  isPromised
) {
  const interactiveEventEmiter = createTestingEventEmiter();

  controllingSide.setInteractiveEventMessageListener(function echo(dataAboutEvent, sendResponse) {
    return sendResponse(dataAboutEvent[symbolsOfEvent_args]);
  });
  const remoteEvent = createRemoteEvent(
    controlledSide,
    interactiveEventEmiter,
    idOfEvent,
    isInteractive,
    isPromised
  );

  remoteEvent.setNewListener(isInteractive);
  const emitEvent = interactiveEventEmiter.emit;

  const responses = await Promise.all(emitted.map(async (args) => {
    const responsesFromListeners = await emitEvent.apply(interactiveEventEmiter, args);
    return responsesFromListeners[0];
  }));
  expectDeepEqual(responses, emitted);
};

const testInteractiveCallbackedEvent = function() {
  return checkInteractiveEvent(() => {
    const callbackedEventEmiter = new InteractiveOneEventEmiter();

    callbackedEventEmiter._callListener = function(listener, args) {
      return new Promise((resolve, reject) => {
        const argsWithCallback = Array.from(args);
        argsWithCallback.push(resolve);
        listener.apply(null, argsWithCallback);
      });
    };

    return callbackedEventEmiter;
  }, 1, true);
};

const testInteractivePromisedEvent = function() {
  return checkInteractiveEvent(() => {
    const promisedEventEmiter = new InteractiveOneEventEmiter();
    promisedEventEmiter._callListener = (listener, args) => listener.apply(null, args);
    return promisedEventEmiter;
  }, 11, true, true);
};

const InteractiveOneEventEmiter = class {
  constructor() {
    this[_listeners] = new Set();
  }

  emit() {
    const listeners = this[_listeners];
    if (listeners.size === 0) {
      return Promise.resolve();
    }
    const gettingResponses = [];
    const callListener = this._callListener;
    for (const listener of listeners) {
      gettingResponses.push(callListener(listener, arguments));
    }
    return Promise.all(gettingResponses);
  }

  addListener(listener) {
    return this[_listeners].add(listener);
  }
};

const _listeners = Symbol();

describe("тест событий, передаваемых удаленной стороне по сокету", function() {
  before(createConnections);

  addTestsFromTable(it, [
    ["информационные события", testInformationEvent],
    ["интерактивные события с обратными вызовами", testInteractiveCallbackedEvent],
    ["интерактивные события на обещаниях", testInteractivePromisedEvent]
  ]);
});
