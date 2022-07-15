"use strict";

const {
  ok: expectTrue,
  deepStrictEqual: expectDeepEqual
} = require("assert");

const ObjectMethodsTable = require("./ObjectMethodsTable");

const {
  object,
  method,
  isReturning,
  isAsync
} = ObjectMethodsTable.symbolsOfEntry;

const testSettingGetting = function() {
  const table = new ObjectMethodsTable();
  const obj1 = {
    add() {}
  };
  const obj2 = {
    getByRequest() {},
    zz() {}
  };

  const itIsReturning = true,
        itIsAsync = true;

  table.set(1, obj1, 0, obj1.add, itIsReturning, !itIsAsync);
  expectDeepEqual(table.get(1, 0), {
    [object]: obj1,
    [method]: obj1.add,
    [isReturning]: true,
    [isAsync]: false
  });

  const notExist = table.get(100, 1);
  expectTrue(!notExist);

  table.set(2, obj2, 1, obj2.getByRequest, itIsReturning, itIsAsync);
  expectDeepEqual(table.get(2, 1), {
    [object]: obj2,
    [method]: obj2.getByRequest,
    [isReturning]: true,
    [isAsync]: true
  });

  table.set(2, obj2, 2, obj2.zz, !itIsReturning, !itIsAsync);
  expectDeepEqual(table.get(2, 2), {
    [object]: obj2,
    [method]: obj2.zz,
    [isReturning]: false,
    [isAsync]: false
  });
};

describe("тест таблицы методов объектов", function() {
  it("установка и получение", testSettingGetting);
});
