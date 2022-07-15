"use strict";

const OneEventEmitter = require("./../../utils/OneEventEmitter/OneEventEmitter");

const InteractiveCallbackedOneEventEmitter = require("./eventEmitters/InteractiveCallbackedOneEventEmitter");
const InteractivePromisedOneEventEmitter = require("./eventEmitters/InteractivePromisedOneEventEmitter");

const clientApi = {
  math: {
    sum(a, b) {
      return a + b + this._zero;
    },
    _zero: 0,
    async sumAsync(a, b) {
      return this.sum(a, b);
    }
  },
  procedures: {
    doA() {},
    async doBAsync() {}
  },
  runtime: {
    onMessage: new InteractiveCallbackedOneEventEmitter()
  },
  webNavigation: {
    onCompleted: new OneEventEmitter(),
    onBeforeNavogate: new InteractivePromisedOneEventEmitter()
  },
  errors: {
    throwSyncFromFn() {
      throw new Error(this.messageAboutError);
    },
    throwAsyncFromFn() {
      return Promise.reject(new Error(this.messageAboutError));
    },
    messageAboutError: "st is not defined.",

    throwSyncFromProcedure() {
      throw new Error(this.messageAboutError);
    },
    async throwAsyncFromProcedure() {
      throw new Error(this.messageAboutError);
    },
    asyncFnThatThrowsSync() {
      this.throwSyncFromFn();
    }
  }
};

const createDescriptionOfMethod = function(link, isReturning, isAsync) {
  return {
    isMethod: true,
    link,
    isReturning: !!isReturning,
    isAsync: !!isAsync
  };
};

const createDescriptorOfEvent = function(event, isInteractive, isPromised) {
  return {
    link: event,
    isEvent: true,
    isInteractive,
    isPromised
  };
};

const descriptionOfClientApi = {
  link: clientApi,
  math: {
    link: clientApi.math,
    sum: createDescriptionOfMethod(clientApi.math.sum, true),
    sumAsync: createDescriptionOfMethod(clientApi.math.sumAsync, true, true)
  },
  procedures: {
    link: clientApi.storage,
    doA: createDescriptionOfMethod(clientApi.procedures.doA),
    doBAsync: createDescriptionOfMethod(clientApi.procedures.doBAsync, false, true)
  },
  runtime: {
    onMessage: createDescriptorOfEvent(clientApi.runtime.onMessage, true)
  },
  webNavigation: {
    onCompleted: createDescriptorOfEvent(clientApi.webNavigation.onCompleted),
    onBeforeNavogate: createDescriptorOfEvent(clientApi.webNavigation.onBeforeNavogate, true, true)
  },
  errors: {
    link: clientApi.errors,

    throwSyncFromFn: createDescriptionOfMethod(clientApi.errors.throwSyncFromFn, true),
    throwAsyncFromFn: createDescriptionOfMethod(clientApi.errors.throwAsyncFromFn, true, true),

    throwSyncFromProcedure: createDescriptionOfMethod(clientApi.errors.throwSyncFromProcedure),
    throwAsyncFromProcedure: createDescriptionOfMethod(clientApi.errors.throwAsyncFromProcedure, false, true),
    asyncFnThatThrowsSync: createDescriptionOfMethod(clientApi.errors.asyncFnThatThrowsSync, false, true)
  }
};

module.exports = {
  clientApi,
  descriptionOfClientApi
};
