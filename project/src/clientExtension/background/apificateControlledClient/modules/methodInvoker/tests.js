"use strict";

const expectEqual = require("assert").strictEqual;

const {
  symbolsOfResult: {
    data,
    status
  },
  statusOfCall,
  call: invokeMethod
} = require("./methodInvoker");

const object = {
  _zero: 0,
  add(a, b) {
    return this._zero + a + b;
  },
  doSync() {},
  multipAsync(a, b) {
    return Promise.resolve(this._zero + a * b);
  },
  doAsync() {},

  throwErrorSync() {
    throw new Error(this.errorMessage);
  },
  async throwErrorAsync() {
    throw new Error(this.errorMessage);
  },
  errorMessage: "panic"
};

const checkCallingMethodSuccesfully = async function(
  object,
  method,
  args,
  isAsync,
  isReturning,
  expectedStatus,
  expectedResult
) {
  const result = await invokeMethod(object, method, args, isAsync, isReturning);
  expectEqual(result[status], expectedStatus);
  expectEqual(result[data], expectedResult);
};

const checkCallingMethodWithError = async function(
  object,
  method,
  args,
  isAsync,
  isReturning,
  expectedStatus,
  expectedMessage
) {
  const result = await invokeMethod(object, method, args, isAsync, isReturning);
  expectEqual(result[status], expectedStatus);
  const error = result[data];
  expectEqual(error instanceof Error, true);
  expectEqual(error.message, expectedMessage);
};

const createCheckingCallingMethodSuccesfulyFn = function(args) {
  return checkCallingMethodSuccesfully.bind(null, ...args);
};

const createCheckingCallingMethodWithErrorFn = function(args) {
  return checkCallingMethodWithError.bind(null, ...args);
};

const addTestsFromTable = function(addTest, createTest, table) {
  for (const [nameOfTest, args] of table) {
    addTest(nameOfTest, createTest(args));
  }
};

describe("тест вызова методов", function() {
  const isAsync = true;
  const isReturning = true;

  addTestsFromTable(it, createCheckingCallingMethodSuccesfulyFn, [
    [
      "успешный вызов синхронного метода, возвращающего результат",
      [object, object.add, [1, 2], !isAsync, isReturning, statusOfCall.succes, 3]
    ],
    [
      "успешный вызов синхронной процедуры",
      [object, object.doSync, [1, 2], !isAsync, !isReturning, statusOfCall.succes, undefined]
    ],
    [
      "успешный вызов aсинхронного метода, возвращающего результат",
      [object, object.multipAsync, [3, 4], isAsync, isReturning, statusOfCall.succes, 12]
    ],
    [
      "успешный вызов aсинхронной процедуры",
      [object, object.doAsync, [3, 4], isAsync, !isReturning, statusOfCall.succes, undefined]
    ]
  ]);

  const { errorMessage } = object;

  addTestsFromTable(it, createCheckingCallingMethodWithErrorFn, [
    [
      "выброс ошибки из синхронной функции",
      [object, object.throwErrorSync, null, !isAsync, isReturning, statusOfCall.error, errorMessage]
    ],
    [
      "выброс ошибки из синхронной процедуры",
      [object, object.throwErrorSync, null, !isAsync, !isReturning, statusOfCall.error, errorMessage]
    ],
    [
      "выброс ошибки из aсинхронной функции",
      [object, object.throwErrorAsync, [3, 4], isAsync, isReturning, statusOfCall.error, errorMessage]
    ],
    [
      "выброс ошибки из aсинхронной процедуры",
      [object, object.throwErrorAsync, [3, 4], isAsync, !isReturning, statusOfCall.error, errorMessage]
    ],
    [
      "синхронный выброс ошибки из асинхронной функции",
      [
        object,
        object.throwErrorSync,
        null,
        isAsync,
        isReturning,
        statusOfCall.syncErrorFromAsyncFn,
        errorMessage
      ]
    ]
  ]);
});
