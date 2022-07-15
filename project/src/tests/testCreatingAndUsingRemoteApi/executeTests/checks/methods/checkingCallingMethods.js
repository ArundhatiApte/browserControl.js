"use strict";

const expectEqual = require("assert").strictEqual;

const checkCallingInternallySyncFnMethod = async function(clientApi, remoteApi) {
  return expectEqual(4, await remoteApi.math.sum(1, 3));
};

const checkCallingInternallyAsyncFnMethod = async function(clientApi, remoteApi) {
  return expectEqual(6, await remoteApi.math.sumAsync(2, 4));
};

const checkCallingInternallySyncPrcdMethod = function(clientApi, remoteApi) {
  return remoteApi.procedures.doA();
};

const checkCallingInternallyAsyncPrcdMethod = function(clientApi, remoteApi) {
  return remoteApi.procedures.doBAsync();
};

module.exports = {
  checkCallingInternallySyncFnMethod,
  checkCallingInternallyAsyncFnMethod,
  checkCallingInternallySyncPrcdMethod,
  checkCallingInternallyAsyncPrcdMethod
};
