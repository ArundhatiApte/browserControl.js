"use strict";

const areDeepEqual = require("util").isDeepStrictEqual;

const ControllingSide = require("./../../../../ControllingSide/ControllingSide");
const ControlledSide = require("./../../../../ControlledSide/ControlledSide");

const {
  eventId: symbolsOfEvent_eventId,
  listenerId: symbolsOfEvent_listenerId,
  args: symbolsOfEvent_args
} = ControllingSide.symbolsOfEvent;

const argsSet = require("./../_argsSet");

const checkInformationEvents = function(controllingSide, controlledSide) {
  return new Promise(async function(resolve, reject) {
    const countOfEvents = argsSet.length,
          eventId = 1,
          listenerId = 2,
          expected = argsSet,
          recorded = [];

    let isAllEventsValid = true;
    let countOfRecoredEvents = 0;

    controllingSide.setInformationEventMessageListener(function recordMessage(eventData, args) {
      if (
        (eventData[symbolsOfEvent_eventId] === eventId) &&
        (eventData[symbolsOfEvent_listenerId] === listenerId)
      ) {
        recorded.push(eventData[symbolsOfEvent_args]);
      } else {
        isAllEventsValid = false;
      }
      countOfRecoredEvents += 1;
      if (countOfRecoredEvents === countOfEvents) {
        if (isAllEventsValid && areDeepEqual(recorded, expected)) {
          resolve();
        } else {
          reject(new Error("Different args"));
        }
      }
    });

    await Promise.all(argsSet.map(function(args) {
      return controlledSide.sendInformationEventMessage(eventId, listenerId, args);
    }));
  });
};


module.exports = checkInformationEvents;
