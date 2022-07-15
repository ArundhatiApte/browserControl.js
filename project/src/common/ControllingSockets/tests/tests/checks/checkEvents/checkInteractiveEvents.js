"use strict";

const {
  deepStrictEqual: expectDeepEqual,
  ok: expectTrue
} = require("assert");

const ControllingSide = require("./../../../../ControllingSide/ControllingSide");
const ControlledSide = require("./../../../../ControlledSide/ControlledSide");

const {
  eventId: symbolsOfEvent_eventId,
  listenerId: symbolsOfEvent_listenerId,
  args: symbolsOfEvent_args
} = ControllingSide.symbolsOfEvent;

const argsSet = require("./../_argsSet");

const checkInteractiveEvents = async function(controllingSide, controlledSide) {
  const eventId = 0,
        listenerId = 6;
  const countOfEmittedEvents = argsSet.length;

  let isEventStatsValid = true;

  controllingSide.setInteractiveEventMessageListener(function(eventData, sendResponse) {
    recordedEventData.push(eventData);
    if (
      (eventData[symbolsOfEvent_eventId] !== eventId) &&
      (eventData[symbolsOfEvent_listenerId] !== listenerId)
    ) {
      isEventStatsValid = false;
    }
    sendResponse(eventData[symbolsOfEvent_args][0]);
  });

  const expectedEventData = [];
  const recordedEventData = [];

  const expectedEventResponses = [];
  const recordedEventResponses = [];

  const checkingEvents = [];

  for (const args of argsSet) {
    expectedEventData.push({
      [symbolsOfEvent_eventId]: eventId,
      [symbolsOfEvent_listenerId]: listenerId,
      [symbolsOfEvent_args]: args
    });
    expectedEventResponses.push(args[0]);
    checkingEvents.push(recordResponseFromListener(
      controlledSide,
      eventId,
      listenerId,
      args,
      recordedEventResponses
    ));
  }

  await Promise.all(checkingEvents);

  expectTrue(isEventStatsValid);
  expectDeepEqual(recordedEventResponses, expectedEventResponses);
  expectDeepEqual(recordedEventData, expectedEventData);
};

const recordResponseFromListener = async function(
  controlledSide,
  eventId,
  listenerId,
  args,
  recordedEventResponses
) {
  const response = await controlledSide.sendInteractiveEventMessage(eventId, listenerId, args);
  recordedEventResponses.push(response);
};

module.exports = checkInteractiveEvents;
