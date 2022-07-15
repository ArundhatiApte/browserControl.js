"use strict";

const createEnum = require ("createEnum");

const statusOfCall = createEnum("succes", "error", "syncErrorFromAsyncFn");

const {
  succes: statusOfCall_succes,
  error: statusOfCall_error,
  syncErrorFromAsyncFn: statusOfCall_syncErrorFromAsyncFn,
} = statusOfCall;

const data = Symbol();
const status = Symbol();

const methodInvoker = {
  statusOfCall,
  symbolsOfResult: { data, status },
  call(object, method, args, isAsync, isReturning) {
    if (isAsync) {
      return _invokeAsyncMethod(object, method, args, isReturning);
    }
    return Promise.resolve(_invokeSyncMethod(object, method, args, isReturning));
  }
};

const _invokeAsyncMethod = async function(object, method, args, isReturning) {
  let promise;
  try {
    promise = method.apply(object, args);
  } catch(error) {
    return error ?
      {[status]: statusOfCall_syncErrorFromAsyncFn, [data]: error} :
      _syncErrorFromAsyncFnResult;
  }

  let result;
  try {
    result = await promise;
  } catch(error) {
    return _createErrorResult(error);
  }
  if (isReturning) {
    return _createSuccesResult(result);
  }
  return _succesResult;
};

const _invokeSyncMethod = function(object, method, args, isReturning) {
  try {
    if (isReturning) {
      const result = method.apply(object, args);
      return _createSuccesResult(result);
    } else {
      method.apply(object, args);
      return _succesResult;
    }
  } catch(error) {
    return _createErrorResult(error);
  }
};

const _createResultOnlyWithStatus = function(code) {
  return Object.freeze({[status]: code});
};

const _succesResult = _createResultOnlyWithStatus(statusOfCall_succes),
      _syncErrorFromAsyncFnResult = _createResultOnlyWithStatus(statusOfCall_syncErrorFromAsyncFn),
      _errorResult = _createResultOnlyWithStatus(statusOfCall_error);

const _createSuccesResult = function(result) {
  return result !== undefined ?
   {[status]: statusOfCall_succes, [data]: result} :
    _succesResult;
};

const _createErrorResult = function(error) {
  return error !== undefined ? {
    [status]: statusOfCall_error,
    [data]: error
  } : _errorResult;
};

module.exports = methodInvoker;
