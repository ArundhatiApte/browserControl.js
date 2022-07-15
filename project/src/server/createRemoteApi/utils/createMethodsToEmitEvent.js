"use strcit";

const {
  symbolsOfEvent: {
    eventId: symbolsOfEvent_eventId,
    listenerId: symbolsOfEvent_listenerId,
    args: symbolsOfEvent_args
  }
} = require("./../../../common/ControllingSockets/ControllingSide/ControllingSide");

const {
  TimeoutToReceiveResponseFromListenerError,
  ListenerIsNotInteractiveError
} = require("./../remoteEvents/eventFactory");

const isDebug = require("./isDebug");

const createEmittingInteractiveEventMethod= function(eventIdToEmitter) {
  return function onInteractiveEventMessage(eventData, sendResponse) {
    _informInteractiveEventEmitterAndSendResponse(eventData, sendResponse, eventIdToEmitter);
  };
};

const _informInteractiveEventEmitterAndSendResponse = async function(eventData, sendResponse, eventIdToEmitter) {
  const emiter = _getEmitterFromTable(eventData[symbolsOfEvent_eventId], eventIdToEmitter);
  if (!emiter) {
    return;
  }
  const listenerId = eventData[symbolsOfEvent_listenerId],
        args = eventData[symbolsOfEvent_args];

  let responseFromListener;
  try {
    responseFromListener = await emiter.emitForInteractiveListener(listenerId, args);
  } catch(error) {

    if (error instanceof TimeoutToReceiveResponseFromListenerError) {
      if (isDebug) {
        _logDebugMessage(
          "Время ожидания ответа от обработчика события (id: ",
          eventData[symbolsOfEvent_eventId], ") истекло."
        );
      }
      return;
    }

    if (error instanceof ListenerIsNotInteractiveError) {
      return;
    }
    throw error;
  }

  sendResponse(responseFromListener);
};

const _getEmitterFromTable = function(eventId, eventIdToEmitter) {
  const emiter = eventIdToEmitter.get(eventId);
  if (emiter) {
    return emiter;
  }
  if (_isDebug) {
    _logDebugMessage("Не найден генератор событий для события с id ", eventId);
  }
};

const _logDebugMessage = console.warn.bind(console);

const createEmittingInformationEventMethod = function(eventIdToEmitter) {
  return function onInformationEventMessage(eventData) {
    return _emitInformationEvent(eventData, eventIdToEmitter);
  };
};

const _emitInformationEvent = function(eventData, eventIdToEmitter) {
  const emiter = _getEmitterFromTable(eventData[symbolsOfEvent_eventId], eventIdToEmitter);
  if (!emiter) {
    return;
  }
  emiter.emitForInformationListener(eventData[symbolsOfEvent_listenerId], eventData[symbolsOfEvent_args]);
};

module.exports = {
  createEmittingInteractiveEventMethod,
  createEmittingInformationEventMethod
};
