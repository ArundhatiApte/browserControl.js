 "use strict";

const extractArgsWithouCallback = require("./extractArgsWithouCallback");

const TimeoutToReceiveResponseError =
  require("./../../../../../../ControlledSocketClient/ControlledSocketClient"
).TimeoutToReceiveResponseError;

const createInteractiveCallbackedSocketListener = function(controlledClient, eventId, listenerId) {
  return _listenInteractiveCallbackedEvent.bind(null, controlledClient, eventId, listenerId);
};

const _listenInteractiveCallbackedEvent = function(controlledClient, eventId, listenerId) {
  // без return!!
  // т.к. если обработчик browser.runtime.onMessage вернет Promise
  // то это будет расценено, как попытка послать ответ на сообщение
  _sendDataAboutEventAndReceiveResponse(controlledClient, eventId, listenerId, arguments);

  //для асинхронново вызова sendResponse
  return true;
};

const _sendDataAboutEventAndReceiveResponse = async function(controlledClient, eventId, listenerId, args) {
  const argsWithoutCallback = extractArgsWithouCallback(args, 3);
  const callback = args[args.length - 1];

  let responseFromListener;
  try {
    responseFromListener = await controlledClient.sendInteractiveEventMessage(
      eventId,
      listenerId,
      argsWithoutCallback
    );
  } catch(error) {
    if (error instanceof TimeoutToReceiveResponseError) {
      return;
    }
    throw error;
  }

  callback(responseFromListener);
};

const createInformationEventListener = function(controlledClient, eventId, listenerId) {
  return _sendDataAboutEvent.bind(null, controlledClient, eventId, listenerId);
};

const _sendDataAboutEvent = function(controlledClient, eventId, listenerId) {
  const argsWithoutCallback = extractArgsWithouCallback(arguments, 3);
  controlledClient.sendInformationEventMessage(
    eventId,
    listenerId,
    argsWithoutCallback
  );
};

module.exports = {
  createInteractiveCallbackedSocketListener,
  createInformationEventListener
};
