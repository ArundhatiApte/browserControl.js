"use strict";

const expectDeepEqual = require("assert").deepStrictEqual;

const checkInteractiveEvents = async function(getEvent, createListener, clientApi, remoteApi) {
  const multip2 = (n) => n * 2;
  const nums = [1, 2, 3, 4];

  const emittedArgs = nums.map(n => [n]);

  const expectedResponses = nums.map(multip2);
  const receivedResponses = [];

  const sendMultipledResponse = createListener(multip2);

  const isInteractive = true;
  const clientEvent = getEvent(clientApi);
  const event = getEvent(remoteApi);

  await event.addListener(sendMultipledResponse, isInteractive);

  for (const args of emittedArgs) {
    const responses = await clientEvent.emit(args);
    receivedResponses.push(responses[0]);
  }
  expectDeepEqual(expectedResponses, receivedResponses);
};

const createCheckingInteractiveEventsFn = (getEvent, createListener) => checkInteractiveEvents.bind(
  null,
  getEvent,
  createListener
);

module.exports = {
  checkInteractiveCallbackedEvents: createCheckingInteractiveEventsFn(
    (api) => api.runtime.onMessage,
    (createResult) => (n, sendResponse) => sendResponse(createResult(n))
  ),
  checkInteractivePromisedEvents: createCheckingInteractiveEventsFn(
    (api) => api.webNavigation.onBeforeNavogate,
    (createResult) => (n) => Promise.resolve(createResult(n))
  ),
};
