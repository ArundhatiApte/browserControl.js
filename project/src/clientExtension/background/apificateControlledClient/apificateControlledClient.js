"use strcit";

const SequenceGeneratorOfNumbers = require("./modules/SequenceGeneratorOfNumbers");
const createSocketEvent = require("./modules/createRemoteEvent/createRemoteEvent");
const ObjectMethodsTable = require("./modules/ObjectMethodsTable/ObjectMethodsTable");

const createExportedDescOfApi = require("./utils/createExportedDescOfApi/createExportedDescOfApi");
const createOnInvokingMessageListener = require("./utils/createOnInvokingMessageListener");
const logDebugMessage = require("./utils/logDebugMessage");

const maxIdOfObject = 255;
SequenceGeneratorOfNumbers.setMaxNumber(maxIdOfObject);

const apificateControlledClient = function(controlledClient, descriptionOfApi) {
  const formalizatedDescriptionOfApi = formalizateDescriptionOfApiAndWrapEventsToSocketEvents(
    controlledClient,
    descriptionOfApi
  );

  const objectsMethodsTable = extractObjectsMethodsTableFromFormalizateDescriptionOfApi(formalizatedDescriptionOfApi);

  const callMethodByRequestAndSendResponse = createOnInvokingMessageListener(controlledClient, objectsMethodsTable);
  controlledClient.setInvokingMessageListener(callMethodByRequestAndSendResponse);

  const out = createExportedDescOfApi(formalizatedDescriptionOfApi);
  return out;
};

const formalizateDescriptionOfApiAndWrapEventsToSocketEvents = (function() {

  const formalizateDescriptionOfApiAndWrapEventsToSocketEvents = function(
    controlledSocketClient,
    rawDescriptionOfApi,
    objIdGen
  ) {
    if (!objIdGen) {
      objIdGen = new SequenceGeneratorOfNumbers();
    }
    const out = {
      id: objIdGen.getNextNumber(),
      link: rawDescriptionOfApi
    };
    let methodIdGen = 0;

    for (const [key, prop] of Object.entries(rawDescriptionOfApi)) {
      if (key === "link") {
        out.link = prop;
        continue;
      }

      if (typeof prop === "object") {

        if (prop.isMethod) {
          methodIdGen += 1;
          const link = prop.link;
          if (!link) {
            throw new Error("Nullish link to " + key);
          }
          out[key] = _createDescOfMethod(link, prop.isReturning, prop.isAsync, methodIdGen);
          continue;
        }

        if (prop.isEvent) {
          const link = prop.link;
          if (!link) {
            throw new Error("Nullish link to " + key);
          }
          const id = objIdGen.getNextNumber();
          out[key] = _wrapEventToSocketEventAndCreateDesc(
            controlledSocketClient,
            link,
            id,
            prop.isInteractive,
            prop.isPromised
          );
          continue;
        }

        out[key] = formalizateDescriptionOfApiAndWrapEventsToSocketEvents(controlledSocketClient, prop, objIdGen);
      }
    }
    return out;
  };

  const _createDescOfMethod = function(method, isReturning, isAsync, id) {
    return {
      link: method,
      isMethod: true,
      isReturning,
      isAsync,
      id
    };
  };

  const _wrapEventToSocketEventAndCreateDesc = function(
    controlledSocketClient,
    event,
    id,
    isInteractive,
    isPromised
  ) {
    const socketEvent = createSocketEvent(controlledSocketClient, event, id, isInteractive, isPromised);
    return _createDescriptorOfEventWrapper(socketEvent, id, isInteractive, isPromised);
  };

  const _createDescriptorOfEventWrapper = function(socketEvent, id, isInteractive, isPromised) {
    const isSync = false;
    const isReturning = true;

    return {
      link: socketEvent,
      isEvent: true,
      id,
      isInteractive,
      isPromised,

      setNewListener: _descriptorOfMethod(socketEvent.setNewListener, 0, isReturning, isSync),
      hasListenerById: _descriptorOfMethod(socketEvent.hasListenerById, 1, isReturning, isSync),
      removeListenerById: _descriptorOfMethod(socketEvent.removeListenerById, 2, isReturning, isSync)
    };
  };

  const _descriptorOfMethod = function(method, id, isReturning, isAsync) {
    return {
      link: method,
      id,
      isMethod: true,
      isAsync: !!isAsync,
      isReturning: !!isReturning
    };
  };

  return formalizateDescriptionOfApiAndWrapEventsToSocketEvents;
})();

const extractObjectsMethodsTableFromFormalizateDescriptionOfApi = (function() {

  const _fillObjectMethodsTable = function(table, formalizedDescOfApi, key) {
    const parentObjId = formalizedDescOfApi.id;

    if (isNaN(parentObjId)) {
      throw new Error("Id is not a number (" + parentObjId + ") in object " + key);
    }
    for (const [key, prop] of Object.entries(formalizedDescOfApi)) {
      if (key === "link") {
        continue;
      }

      if (typeof prop === "object") {
        if (prop.isMethod) {
          table.set(parentObjId, formalizedDescOfApi.link, prop.id, prop.link, prop.isReturning, prop.isAsync);
          continue;
        } else {
          _fillObjectMethodsTable(table, prop, key);
        }
      }
    }
    return table;
  };

  return function(formalizedDescOfApi) {
    return _fillObjectMethodsTable(new ObjectMethodsTable(), formalizedDescOfApi);
  };
})();

module.exports = apificateControlledClient;
