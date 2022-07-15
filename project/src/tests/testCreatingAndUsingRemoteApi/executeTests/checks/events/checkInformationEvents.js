"use strict";

const areDeepEqual = require("util").isDeepStrictEqual;

const checkInformationEvents = function(clientAPI, remoteAPI) {
  return new Promise(async function(resolve, reject) {
    const emittedArgs = [
      [1, 2], ["a", {obj: true}]
    ];
    const recordedArgs = [];
    let eventsToRecord = emittedArgs.length;

    const recordDataAndCheckWhenAll = async function(...args) {
      recordedArgs.push(args);
      eventsToRecord -= 1;

      if (eventsToRecord === 0) {
        if (areDeepEqual(emittedArgs, recordedArgs)) {
          resolve();
        } else {
          reject(new Error("Различные данные событий."));
        }
      }
    };

    const event = remoteAPI.webNavigation.onCompleted;
    await event.addListener(recordDataAndCheckWhenAll);

    const emitter = clientAPI.webNavigation.onCompleted;
    const emitEvent = emitter.emit;

    for (const args of emittedArgs) {
      emitEvent.apply(emitter, args);
    }
  });
};

module.exports = checkInformationEvents;
