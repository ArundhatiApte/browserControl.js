"use strict";

const headersOfResponse = require("./../../../common/messagesHeaders").invoking.response;

const {
  parse: valueView_parse,
  bytiefy: valueView_bytiefy
} = require("./../../../common/valueView/valueView");

const headersOfResponses_succes = headersOfResponse.succes;
const headersOfResponse_error = headersOfResponse.error;

const symbolsOfResponseOnInvokingMessage_status = Symbol();
const symbolsOfResponseOnInvokingMessage_result = Symbol();
const symbolsOfResponseOnInvokingMessage_errorMessage = Symbol();
const symbolsOfResponseOnInvokingMessage_errorStack = Symbol();

const messenger = {
  sizeOfHeaderForInvokingMessage: 2,
  fillArrayBufferAsHeaderOfInvokingMessage(arrayBuffer, objectId, methodId) {
    const uint8s = new Uint8Array(arrayBuffer);
    uint8s[0] = objectId;
    uint8s[1] = methodId;
  },
  createBodyFromArgs: valueView_bytiefy.bind(null, 0),

  parseResponseOnInvokingMessage(response, startIndex) { // startIndex всегда указан
    const status = new Uint8Array(response)[startIndex];
    const payloadStartIndex = startIndex + 1;

    if (status === headersOfResponses_succes) {
      return _createSuccesStatsFromResponse(response, payloadStartIndex);
    }
    if (status === headersOfResponse_error) {
      return _createErrorStatsFromResponse(response, payloadStartIndex);
    }
    if (status === headersOfResponse.syncErrorFromAsyncFn) {
      return _createSyncErrorFromAsyncFnStats(response, payloadStartIndex);
    }
    if (status === headersOfResponse.clientNotFoundMethod) {
      return _clientNotFoundMethodResult;
    }
    if (status === headersOfResponse.malformedRequest) {
      return _malformedRequestResult;
    }
    throw new Error("Malformed response on method call (unrecognized header).");
  },
  statusOfCall: headersOfResponse,
  symbolsOfResponseOnInvokingMessage: {
    status: symbolsOfResponseOnInvokingMessage_status,
    result: symbolsOfResponseOnInvokingMessage_result,
    errorMessage: symbolsOfResponseOnInvokingMessage_errorMessage,
    errorStack: symbolsOfResponseOnInvokingMessage_errorStack
  }
};

const createStatsOfResponseParsing = function(statusCode) {
  return Object.freeze({[symbolsOfResponseOnInvokingMessage_status]: statusCode});
};

const _clientNotFoundMethodResult = createStatsOfResponseParsing(headersOfResponse.clientNotFoundMethod);
const _syncErrorFromAsyncFnResultWithoutError = createStatsOfResponseParsing(
  headersOfResponse.syncErrorFromAsyncFn
);
const _malformedRequestResult = createStatsOfResponseParsing(headersOfResponse.malformedRequest);
const _succesCallWithoutResult = createStatsOfResponseParsing(headersOfResponse.succes);
const _errorCallWithoutInfoAboutError = createStatsOfResponseParsing(headersOfResponse.error);

const _createSuccesStatsFromResponse = function(bytes, startIndexOfArgs) {
  if (bytes.byteLength <= startIndexOfArgs) {
    return _succesCallWithoutResult;
  }
  return {
    [symbolsOfResponseOnInvokingMessage_status]: headersOfResponses_succes,
    [symbolsOfResponseOnInvokingMessage_result]: valueView_parse(bytes, startIndexOfArgs)
  };
};

const _createExtractingErrorFromResponseFn = (function() {
  const extractErrorMessageIfHasOrGetDefaultResult = function(defaultStatus, resultWithoutError, bytes, startIndex) {
    if (bytes.byteLength <= startIndex) {
      return resultWithoutError;
    }
    let errorMessageAndStack;
    try {
      errorMessageAndStack = valueView_parse(bytes, startIndex);
    } catch(error) {
      throw new Error("Malformed response about error.");
    }
    return {
      [symbolsOfResponseOnInvokingMessage_status]: defaultStatus,
      [symbolsOfResponseOnInvokingMessage_errorMessage]: errorMessageAndStack[0],
      [symbolsOfResponseOnInvokingMessage_errorStack]: errorMessageAndStack[1]
    };
  };

  return function(resultWithoutError) {
    const defaultStatus = resultWithoutError[symbolsOfResponseOnInvokingMessage_status];
    return extractErrorMessageIfHasOrGetDefaultResult.bind(null, defaultStatus, resultWithoutError);
  };
})();

const _createErrorStatsFromResponse = _createExtractingErrorFromResponseFn(_errorCallWithoutInfoAboutError);
const _createSyncErrorFromAsyncFnStats = _createExtractingErrorFromResponseFn(
  _syncErrorFromAsyncFnResultWithoutError
);

Object.freeze(messenger);

module.exports = messenger;
