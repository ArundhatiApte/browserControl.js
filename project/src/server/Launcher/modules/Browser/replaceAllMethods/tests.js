"use strict";

const expectThrows = require("assert").throws;

const replaceAllMethodsRecursive = require("./replaceAllMethods");

const test = function() {
  const browser = {
    tabs: {
      create() {
        return 1;
      },
      remove() {},
      onRemoved: {
        addListener() {}
      }
    }
  };

  const throwError = function() {
    throw new Error("Брузер был закрыт.");
  };
  replaceAllMethodsRecursive(browser, throwError);

  expectThrows(browser.tabs.create);
  expectThrows(browser.tabs.remove);
  expectThrows(browser.tabs.onRemoved.addListener);
};

describe("замена вложенных методов", function() {
  it("т", test);
});
