"use strict";

const {
  strictEqual: expectEqual,
  rejects: expectThrowsAsync
} = require("assert");

const RemoteError = require("./../../../../../server/createRemoteApi/createRemoteApi").ErrorFromClient;

const checkThrowingErrors = function(clientApi, remoteApi) {
  const messageAboutError = clientApi.errors.messageAboutError;

  return Promise.all(Object.values(remoteApi.errors).map((method) => checkThrowing(method, messageAboutError)));
};

const createCheckingThrowingErrorFromRemoteApiFn = function(nameOfMethod) {
  return checkThrowingErrorFromRemoteApi.bind(null, nameOfMethod);
};

const checkThrowingErrorFromRemoteApi = function(nameOfMethod, clientApi, remoteApi) {
  return checkThrowingError(remoteApi.errors[nameOfMethod], clientApi.errors.messageAboutError);
};

const checkThrowingError = function(fn, errorMessage) {
  return expectThrowsAsync(fn, function(error) {
    expectEqual(true, error instanceof RemoteError);
    expectEqual(errorMessage, error.message);
    return true;
  });
};

module.exports = {
  checkThrowingErrorFromInternallySyncFnMethod: createCheckingThrowingErrorFromRemoteApiFn("throwSyncFromFn"),
  checkThrowingErrorFromInternallyAsyncFnMethod: createCheckingThrowingErrorFromRemoteApiFn("throwAsyncFromFn"),
  checkThrowingErrorFromInternallySyncPrcdMethod: createCheckingThrowingErrorFromRemoteApiFn(
    "throwSyncFromProcedure"
  ),
  checkThrowingErrorFromInternallyAsyncPrcdMethod: createCheckingThrowingErrorFromRemoteApiFn(
    "throwAsyncFromProcedure"
  )
};
