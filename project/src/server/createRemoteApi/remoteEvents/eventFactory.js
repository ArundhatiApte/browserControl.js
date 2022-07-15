"use strict";

const RemoteInformationSocketEventEmitter = require("./RemoteInformationSocketEventEmitter");

const RemoteInteractiveSocketEventEmitter = require(
  "./remoteInteractiveSocketEventEmitters/RemoteInteractiveSocketEventEmitter"
);
const RemoteInteractiveCallbackedSocketEventEmitter = require(
 "./remoteInteractiveSocketEventEmitters/RemoteInteractiveCallbackedSocketEventEmitter"
);
const RemoteInteractivePromisedSocketEventEmitter = require(
"./remoteInteractiveSocketEventEmitters/RemoteInteractivePromisedSocketEventEmitter"
);
const TimeoutToReceiveResponseFromListenerError =
  RemoteInteractiveSocketEventEmitter.TimeoutToReceiveResponseFromListenerError;

const ListenerIsNotInteractiveError = RemoteInteractiveSocketEventEmitter.ListenerIsNotInteractiveError;

module.exports = {
  create(remoteEventApi, isInteractive, isPromised) {
    if (isInteractive) {
      return (isPromised) ?
        new RemoteInteractivePromisedSocketEventEmitter(remoteEventApi) :
        new RemoteInteractiveCallbackedSocketEventEmitter(remoteEventApi);
    }
    if (!isPromised) {
      return new RemoteInformationSocketEventEmitter(remoteEventApi);
    }
    throw new Error("ошибочная конфигурация удаленного события");
  },
  setMaxTimeMsToWaitResponseFromListener: RemoteInteractiveSocketEventEmitter.setMaxTimeMsToWaitResponseFromListener,
  TimeoutToReceiveResponseFromListenerError,
  ListenerIsNotInteractiveError
};
