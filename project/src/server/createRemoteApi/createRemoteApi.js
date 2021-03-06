"use strcit";

const createSocketMethod = require("./createSocketMethod/createSocketMethod");
const eventFactory = require("./remoteEvents/eventFactory");
const createEventFromEventEmitter = require("./remoteEvents/createEventFromEventEmitter");

const {
  createEmittingInteractiveEventMethod,
  createEmittingInformationEventMethod
} = require("./utils/createMethodsToEmitEvent");

eventFactory.setMaxTimeMsToWaitResponseFromListener(11000);

const maxTimeMsToWaitResponseOnMethodCall = 20000;

const createRemoteApi = function(connectionToControlledClient, descriptionOfApi) {
  connectionToControlledClient.maxTimeMSToWaitResponse = maxTimeMsToWaitResponseOnMethodCall;
  const exportedApiAndEventIdsToEmitters = _createApiAndEventEmittersTable(
    connectionToControlledClient,
    descriptionOfApi
  );
  const eventIdToEmitter = exportedApiAndEventIdsToEmitters.eventIdToEmitter;

  const onInformationEventMessage = createEmittingInformationEventMethod(eventIdToEmitter);
  const onInteractiveEventMessage = createEmittingInteractiveEventMethod(eventIdToEmitter);

  connectionToControlledClient.setInformationEventMessageListener(onInformationEventMessage);
  connectionToControlledClient.setInteractiveEventMessageListener(onInteractiveEventMessage);

  return exportedApiAndEventIdsToEmitters.exportedApi;
};

createRemoteApi.ErrorFromClient = createSocketMethod.ErrorFromClient;

const _createApiAndEventEmittersTable = function(connectionToControlledClient, descriptionOfApi) {
  const eventIdToEmitter = new Map();
  const out = {
    exportedApi: {},
    eventIdToEmitter: eventIdToEmitter
  };

  out.exportedApi = _createApiByDescriptionAndFillEventsEmittersTable(
    connectionToControlledClient,
    descriptionOfApi,
    eventIdToEmitter
  );

  return out;
};

const _createApiByDescriptionAndFillEventsEmittersTable = function(
  connectionToControlledClient,
  descriptionOfApi,
  eventIdToEmitter
) {
  const out = {};
  const parentObjId = descriptionOfApi.id;

  for (const [key, prop] of Object.entries(descriptionOfApi)) {
    if (typeof prop === "object") {

      if (prop.isMethod) {

        const methodId = prop.id;
        if (isNaN(methodId)) {
          throw new Error("?? ???????????????? ???????????????????? ?????? ???????????? " + key + " ?????????????????????? ??????????????????????????.");
        }
        if (isNaN(parentObjId)) {
          throw new Error("?? ???????????????? ???????????????????? ?????????????????????? ?????????????????????????? " +
                          "?????? ?????????????? ?? ?????????????? " + key + "(id: " + methodId + ").");
        }
        out[key] = createSocketMethod(connectionToControlledClient, parentObjId, methodId, prop.isReturning);

      } else if (prop.isEvent) {

        const socketApi = _createApiOfRemoteEvent(connectionToControlledClient, prop),
              emiter = eventFactory.create(socketApi, prop.isInteractive, prop.isPromised),
              outEvent = createEventFromEventEmitter(emiter, prop.isInteractive);

        out[key] = outEvent;

        const eventId = prop.id;
        if (isNaN(eventId)) {
          throw new Error("?????? ?????????????? " + key + "?????????????????????? ????????????????????????.");
        }
        eventIdToEmitter.set(eventId, emiter);

      } else {
        out[key] = _createApiByDescriptionAndFillEventsEmittersTable(
          connectionToControlledClient,
          prop,
          eventIdToEmitter
        );
      }
    }
  }
  return out;
};

const _createApiOfRemoteEvent = function(connectionToControlledClient, descOfEvent) {
  const objectId = descOfEvent.id;
  if (isNaN(objectId)) {
    throw new Error("?????? ?????????????? ???????????????????? ??????????????????????????.");
  }

  const out = {
    setNewListener: _getMethodOfRemoteEvent(
      connectionToControlledClient,
      objectId,
      descOfEvent.setNewListener
    ),
    hasListenerById: _getMethodOfRemoteEvent(
      connectionToControlledClient,
      objectId,
      descOfEvent.hasListenerById
    ),
    removeListenerById: _getMethodOfRemoteEvent(
      connectionToControlledClient,
      objectId,
      descOfEvent.removeListenerById
    )
  };

  return out;
};

const _getMethodOfRemoteEvent = function(connectionToControlledClient, objectId, descOfMethod) {
  if (!descOfMethod) {
    throw new Error("???????????????????? ???????????????????? ?? ????????????.");
  }
  const id = descOfMethod.id;
  if (isNaN(id)) {
    throw new Error("???????????????????? id ??????????a.")
  }

  return createSocketMethod(connectionToControlledClient, objectId, id, descOfMethod.isReturning);
};

module.exports = createRemoteApi;
