"use strict";

const sliceArray = Array.prototype.slice;

const create = function(controlledClient, eventId, listenerId) {
  return _sendDataAboutEventAndReciveResponse.bind(null, controlledClient, eventId, listenerId);
};

const _sendDataAboutEventAndReciveResponse = function(controlledClient, eventId, listenerId) {
  const args = arguments;

  return new Promise(async function(resolve, reject) {
    let responseFromListener;
    try {
      if (args.length === 3) {
        responseFromListener = await controlledClient.sendInteractiveEventMessage(eventId, listenerId);
      } else {
        const sendedArgs = sliceArray.call(args, 3);
        responseFromListener = await controlledClient.sendInteractiveEventMessage(
          eventId,
          listenerId,
          sendedArgs
        );
      }
    } catch(error) {
      reject(error);
    }
    resolve(responseFromListener);
  });
};

module.exports = create;
