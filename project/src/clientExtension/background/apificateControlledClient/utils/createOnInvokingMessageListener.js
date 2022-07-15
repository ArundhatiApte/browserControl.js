"use strict";

const {
  object: omt_symbolsOfEntry_object,
  method: omt_symbolsOfEntry_method,
  isReturning: omt_symbolsOfEntry_isReturning,
  isAsync: omt_symbolsOfEntry_isAsync
} = require("./../modules/ObjectMethodsTable/ObjectMethodsTable").symbolsOfEntry;

const {
  call: methodInvoker_call,
  statusOfCall: {
    succes: methodInvoker_statusOfCall_succes,
    error: methodInvoker_statusOfCall_error,
    syncErrorFromAsyncFn: methodInvoker_statusOfCall_syncErrorFromAsyncFn
  },
  symbolsOfResult: {
    data: symbolsOfResult_data,
    status: symbolsOfResult_status
  }
} = require("./../modules/methodInvoker/methodInvoker");

const logDebugMessage = require("./logDebugMessage");

const createOnInvokingMessageListener = function(controlledClient, objectsMethodsTable) {
  return async function callMethodAndSendResponseOnInvokingMessage(objectId, methodId, args, senderOfResponse) {
    const dataAboutMethod = objectsMethodsTable.get(objectId, methodId);
    if (dataAboutMethod) {
      const isReturning = dataAboutMethod[omt_symbolsOfEntry_isReturning];
      const dataAboutCall = await methodInvoker_call(
        dataAboutMethod[omt_symbolsOfEntry_object],
        dataAboutMethod[omt_symbolsOfEntry_method],
        args,
        dataAboutMethod[omt_symbolsOfEntry_isAsync],
        isReturning
      );
      _sendResultOfMethodCall(dataAboutCall, isReturning, senderOfResponse);
    } else {
      logDebugMessage("Cant't find method (id: ", methodId, ") for object (id: objectId).");
      senderOfResponse.sendClientNotFoundMethodStatus();
    }
  };
};

const _sendResultOfMethodCall = function(dataAboutCall, isMethodReturning, senderOfResponse) {
  const status = dataAboutCall[symbolsOfResult_status];

  if (status === methodInvoker_statusOfCall_succes) {
    _sendResultOfSuccesMethodCall(dataAboutCall, isMethodReturning, senderOfResponse);
    return;
  }
  if (status === methodInvoker_statusOfCall_error) {
    const error = dataAboutCall[symbolsOfResult_data];
    if (error !== undefined) {
      if (error instanceof Error) {
        senderOfResponse.sendError(error.message, error.stack);
      } else {
        senderOfResponse.sendError(error);
      }
    } else {
      senderOfResponse.sendErrorStatus();
    }
    return;
  }
  if (status === methodInvoker_statusOfCall_syncErrorFromAsyncFn) {
    const error = dataAboutCall[symbolsOfResult_data];
    if (error !== undefined) {
      if (error instanceof Error) {
        senderOfResponse.sendSyncErrorFromAsyncFn(error.message, error.stack);
      } else {
        senderOfResponse.sendSyncErrorFromAsyncFn(error);
      }
    } else {
      senderOfResponse.sendSyncErrorFromAsyncFnStatus();
    }
    return;
  }
};

const _sendResultOfSuccesMethodCall = function(dataAboutCall, isMethodReturning, senderOfResponse) {
  if (isMethodReturning) {
    senderOfResponse.sendResult(dataAboutCall[symbolsOfResult_data]);
  } else {
    senderOfResponse.sendSuccesStatus();
  }
};

module.exports = createOnInvokingMessageListener;
