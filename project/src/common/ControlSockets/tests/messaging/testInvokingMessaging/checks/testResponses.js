"use strict";

const {
  strictEqual: expectEqual,
  deepStrictEqual: expectDeepEqual
} = require("assert");

const isItNaN = require("./../../../../common/valueView/modules/isItNaN/isItNaN");

const testResponses = function(serverMessanger, clientMessanger) {
  const responses = [null, 0, "str\u1234\u4567", {obj: 1}, [1, 2], NaN, ""];
  const sizeOfHeader = 9;
  const succesType = serverMessanger.statusOfCall.succes;

  const {
    symbolsOfResponseOnInvokingMessage: {
      status: symbols_status,
      result: symbols_result
    },
    parseResponseOnInvokingMessage
  } = serverMessanger;

  const { createResponseWithSuccesResult } = clientMessanger;

  for (const response of responses) {
    const message = createResponseWithSuccesResult(sizeOfHeader, response);
    const parsed = parseResponseOnInvokingMessage(message, sizeOfHeader);
    expectEqual(succesType, parsed[symbols_status]);

    const data = parsed[symbols_result];
    const type = typeof data;

    if (type === "object") {
      if (data === null) {
        expectEqual(response, null);
      } else {
        expectDeepEqual(data, response);
      }
    } else if (isItNaN(data)) {
      expectEqual(isItNaN(response), true);
    } else {
      expectEqual(data, response);
    }
  }
};

module.exports = testResponses;
