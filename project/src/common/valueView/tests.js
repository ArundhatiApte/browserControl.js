"use strcit";

const {
  strictEqual: expectEqual,
  deepStrictEqual: expectDeepEqual
} = require("assert");

const { addTestsFromTable } = require("./../../tests/utils/addingTestsFromTable");

const isItNaN = require("./modules/isItNaN/isItNaN");

const {
  bytiefy,
  parse
} = require("./valueView");

const createBytesFromUint8s = function(uint8s) {
  return (new Uint8Array(uint8s)).buffer;
};

const checkEncodingDecodingValue = function(value, checkValues /*fn(srcValue, parsed)*/) {
  const headers = [[], [1], [2, 3]];
  for (const bytesOfHeader of headers) {
    const sizeOfHeader = bytesOfHeader.length;
    bytiefied = bytiefy(sizeOfHeader, value);
    parsed = parse(bytiefied, sizeOfHeader);
    checkValues(value, parsed);
  }
};

const createTestOfEncodingDecodingValue = function(value, checkDecoded) {
  return function createdTest() {
    return checkEncodingDecodingValue(value, checkDecoded);
  };
};

const testNaN = createTestOfEncodingDecodingValue(NaN, function(_, parsed) {
  return isItNaN(parsed);
});

const testNull = createTestOfEncodingDecodingValue(null, function(_, parsed) {
  return expectEqual(parsed, null);
});

const testUndefined = createTestOfEncodingDecodingValue(undefined, function(_, parsed) {
  return expectEqual(parsed, undefined);
});

const createTestOfEncodingDecodingValues = function(values, checkValues) {
  return function createdTestOfValues() {
    return checkEncodingDecodingValues(values, checkValues);
  };
};

const checkEncodingDecodingValues = function(values, checkValues) {
  for (const value of values) {
    checkEncodingDecodingValue(value, checkValues);
  }
};

const testNums = createTestOfEncodingDecodingValues([-100, 0, 1, 200, 22.3345678], expectEqual);

const testStrings = createTestOfEncodingDecodingValues(["ASCII", "* 5  ½ ♥", "", "0", "кариывг"], expectEqual);

const testObjects = (function() {
  const objects = [{
    a: 1,
    b: "строка ½ ♥" ,
    c: null
  }, {}, {
    "key +key: ": 0,
    a: [1, 2]
  }, [2, 3]];

  return createTestOfEncodingDecodingValues(objects, expectDeepEqual);
})();

describe("тест представления значений JavaScript в двоичном формате", function() {
  addTestsFromTable(it, [
    ["NaN", testNaN],
    ["null", testNull],
    ["nums", testNums],
    ["strings", testStrings],
    ["Objects", testObjects]
  ]);
});
