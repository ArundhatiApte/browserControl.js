"use strict";

const {
  strictEqual: expectEqual,
  deepStrictEqual: expectDeepEqual,
  ok: expectTrue
} = require("assert");

const concat2ArrayBuffers = require("./../../../../tests/utils/concat2ArrayBuffers");
const { addTestsFromTable } = require("./../../../../tests/utils/addingTestsFromTable");

const messageCreatorAndResponseParser = require(
  "./../../ControlledSide/modules/messaging/eventMessageCreatorAndResponseParser.js"
);
const messageParserAndResponseCreator = require(
  "./../../ControllingSide/modules/messaging/eventMessageParserAndResponseCreator"
);

const {
  eventId: symbolsOfEvent_eventId,
  listenerId: symbolsOfEvent_listenerId,
  args: symbolsOfEvent_args
} = messageParserAndResponseCreator.symbolsOfEvent;

const argsCollection = [[1, 2], ["str\u1234", ""], [{object: 1}, {a: "b"}], [null], []];

const testEventMessageCreatingAndParsing = function() {
  const eventId = 11;
  const listenerId = 22;

  const sizeOfHeader = 2;

  for (const args of argsCollection) {
    const message = messageCreatorAndResponseParser.createEventMessage(sizeOfHeader, eventId, listenerId, args);
    const parsed = messageParserAndResponseCreator.parseEventMessage(message, sizeOfHeader);

    expectEqual(eventId, parsed[symbolsOfEvent_eventId]);
    expectEqual(listenerId, parsed[symbolsOfEvent_listenerId]);
    expectDeepEqual(args, parsed[symbolsOfEvent_args]);
  }
};

const testEventMessageWithoutArgs = function() {
  const eventId = 4;
  const listenerId = 5555;

  const sizeOfHeader = 3;

  const message = messageCreatorAndResponseParser.createEventMessage(sizeOfHeader, eventId, listenerId);
  const parsed = messageParserAndResponseCreator.parseEventMessage(message, sizeOfHeader);

  expectEqual(eventId, parsed[symbolsOfEvent_eventId]);
  expectEqual(listenerId, parsed[symbolsOfEvent_listenerId]);
  expectEqual(symbolsOfEvent_args in parsed, false);
};

const testResponses = function() {
  const responses = [null, 0, "str\u1234", [1, 2], 42, {
    obj: "last"
  }, NaN, undefined];

  for (const response of responses) {
    const message = messageParserAndResponseCreator.createEventListenerResponse(response);
    const parsedValue = messageCreatorAndResponseParser.parseResponse(message, 0);

    if (isNaN(response)) {
      expectTrue(isNaN(parsedValue));
      continue;
    }

    if (typeof response === "object" && typeof parsedValue === "object") {
      expectDeepEqual(response, parsedValue);
      continue;
    }
    expectEqual(response, parsedValue);
  }
};

describe("тест создания  и разбора сообщений о событиях и ответных данных", function() {
  addTestsFromTable(it, [
    ["создание и разбор сообщений о событиях", testEventMessageCreatingAndParsing],
    ["создание сообщения о событии без параметров", testEventMessageWithoutArgs],
    ["сообщения о ответа обработчика события", testResponses]
  ]);
});
