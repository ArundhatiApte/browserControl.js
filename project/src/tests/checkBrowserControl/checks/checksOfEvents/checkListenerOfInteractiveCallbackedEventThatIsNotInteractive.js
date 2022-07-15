"use strict";

const createAbsoluteUrlToServerOnLocalhost = require("./../../modules/createAbsoluteUrlToServerOnLocalhost");
const createOnceListener = require("./modules/createOnceListener");

const {
  createTimeoutForPromise,
  resolveAwaitedPromise,
  maxTimeMsForTask
} = require("./modules/common");

const checkListenerOfInteractiveCallbackedEventThatIsNotInteractive = function(httpServer, browser) {
  return new Promise(async function(resolve, reject) {
    const timeout = createTimeoutForPromise(reject, maxTimeMsForTask);
    const url = createAbsoluteUrlToServerOnLocalhost("home", httpServer.port);
    const onMessage = browser.runtime.onMessage;

    const listener = createOnceListener(onMessage, function(data, sender, sendResponse) {
      if (data === messageFromScript) {
        if (typeof sendResponse !== "function") {
          resolveAwaitedPromise(timeout, resolve)
        } else {
          reject(new Error("У обработчика есть возможнось отправить ответ"));
        }

        tabs.remove(tabId);
        return true;
      }
    });
    const isListnereInteractive = false;
    await onMessage.addListener(listener, isListnereInteractive);

    const tabs = browser.tabs;
    const { id: tabId } = await tabs.create({url});

    const messageFromScript = "ab";
    const srcOfScriptToSendMessage =
      "browser.runtime.sendMessage('" + messageFromScript + "');" +
      "1;";
    await tabs.executeScript(tabId, {
      code: srcOfScriptToSendMessage
    });
  });
};

module.exports = checkListenerOfInteractiveCallbackedEventThatIsNotInteractive;
