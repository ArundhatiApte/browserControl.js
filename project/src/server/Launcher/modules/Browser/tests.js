"use strict";

const expect = require("assert");
const EventEmitter = require("events").EventEmitter;

const { addTestsFromTable } = require("./../../../../tests/utils/addingTestsFromTable");

const Browser = require("./Browser");

const createBrowser = function() {
  return new Browser(fakeProcess, fakeConnection, descriptionOfAPI);
};

const descriptionOfAPI = Object.freeze({
  customExtensions: {},
  tabs: {},
  runtime: {},
  webNavigation: {}
});

const fakeProcess = new EventEmitter();

const fakeConnection = {
  async close() {
    if (this._) {
      this._();
    }
  },
  setInteractiveEventMessageListener() {},
  setInformationEventMessageListener() {},
  setCloseListener(listener) {
    this._ = listener;
  },
  _:  null
};

const testCaseWhenConnectionToClientWasClosed = function() {
  return new Promise(function(resolve, reject) {
    const browser = createBrowser(),
          timeout = createTimeoutForTask(reject);
    browser.setDisconnectListener(createResolver(timeout, resolve));
    fakeConnection.close();
  });
};

const createTimeoutForTask = function(rejectPromise) {
  return setTimeout(function() {
    return rejectPromise(new Error("Время ожидания закончилось."));
  }, maxTimeMsForTask);
};

const maxTimeMsForTask = 144;

const createResolver = function(timeout, resolvePromise) {
  return function() {
    clearTimeout(timeout);
    resolvePromise();
  };
};

const testCaseWhenProcessOfBrowserWasClosed = function() {
  return new Promise(function(resolve, reject) {
    const browser = createBrowser(),
          timeout = createTimeoutForTask(reject);

    browser.setCloseListener(createResolver(timeout, resolve));
    browser.setDisconnectListener(reject);
    fakeProcess.emit("close");
  });
};

const testClosingBrowser = function() {
  return new Promise(function(resolve, reject) {
    const browser = createBrowser(),
          timeout = createTimeoutForTask(reject);

    browser.setCloseListener(createResolver(timeout, resolve));
    browser.getProcess().emit("close");
  });
};

describe("тест событий браузера", function() {
  addTestsFromTable(it, [
    ["соединение с клиентом потеряно", testCaseWhenConnectionToClientWasClosed],
    ["браузер был закрыт", testCaseWhenProcessOfBrowserWasClosed],
    ["закрытие браузера", testClosingBrowser]
  ]);
});
