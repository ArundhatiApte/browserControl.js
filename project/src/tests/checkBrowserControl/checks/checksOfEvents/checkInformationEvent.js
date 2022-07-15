"use strict";

const expect = require("assert");

const createAbsoluteUrlToServerOnLocalhost = require("./../../modules/createAbsoluteUrlToServerOnLocalhost");

const {
  createTimeoutForPromise,
  resolveAwaitedPromise,
  maxTimeMsForTask
} = require("./modules/common");

const createOnceListener = require("./modules/createOnceListener");

const checkInformationEvent = function(httpServer, browser) {
  return new Promise(async function(resolve, reject) {
    const timeout = createTimeoutForPromise(reject, maxTimeMsForTask);
    const url = createAbsoluteUrlToServerOnLocalhost("about", httpServer.port);

    const tabs = browser.tabs;
    const onRemoved = tabs.onRemoved;

    const checkTab = createOnceListener(onRemoved, function checkTab(tabId) {
      if (tabId === id) {
        resolveAwaitedPromise(timeout, resolve);
        const willRemoveListener = true;
        return willRemoveListener;
      }
    });
    await onRemoved.addListener(checkTab);

    const { id } = await tabs.create({url});
    await tabs.remove(id);
  });
};

module.exports = checkInformationEvent;
