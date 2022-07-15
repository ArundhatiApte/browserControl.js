"use strict";

const expect = require("assert");

const wait = require("./../../../utils/wait");
const createAbsoluteUrlToServerOnLocalhost = require("./../../modules/createAbsoluteUrlToServerOnLocalhost");

const {
  createTimeoutForPromise,
  resolveAwaitedPromise,
  maxTimeMsForTask
} = require("./modules/common");

const createOnceListener = require("./modules/createOnceListener");

const checkInteractiveListenerOfInteractiveCallbackedEvent = function(httpServer, browser) {
  return new Promise(async function(resolve, reject) {
    const timeout = createTimeoutForPromise(reject, maxTimeMsForTask);

    const tabs = browser.tabs;
    const idOfMessage = 2;
    const expectedResponse = 4;
    const propertyInWindow = "response";

    const srcOfSendingAndRecodingResponseScript = createScriptToSendMessageAndRecordResponse(
      idOfMessage,
      propertyInWindow
    );

    const onMessage = browser.runtime.onMessage;

    const listener = createOnceListener(onMessage, function(data, sender, sendResponse) {
      if (typeof data === "object" && data.idOfMessage === idOfMessage) {
        (async function() {
          sendResponse(expectedResponse);
          await wait(200);
          const responseInTab = await getValueFromWindow(tabs, tabId, propertyInWindow);

          if (responseInTab === expectedResponse) {
            resolveAwaitedPromise(timeout, resolve);
          } else {
            reject(new Error("Ответное сообщение отличается отожидаемого: " + responseInTab));
          }
        })();
        return true;
      }
    });

    const isListenerInteractive = true;
    await onMessage.addListener(listener, isListenerInteractive);

    const url = createAbsoluteUrlToServerOnLocalhost("home", httpServer.port);
    const { id: tabId } = await tabs.create({url});

    await tabs.executeScript(tabId, {
      code: srcOfSendingAndRecodingResponseScript
    });
  });
};

const createScriptToSendMessageAndRecordResponse = (function () {

  const sendMessageAndRecordResponse = async function(
    idOfMessage,
    nameOfPropertyInWindowToRecordResponse
  ) {
    console.log("sendMessageAndRecordResponse");
    window.wasScriptRunned = true;
    let response;
    try {
      response = await browser.runtime.sendMessage({
        idOfMessage
      });
      window[nameOfPropertyInWindowToRecordResponse] = response;
      console.log("sendMessageAndRecordResponse: response ", response);
    } catch(error) {
      console.log("sendMessageAndRecordResponse: error", error);
    }
  };

  return function(
    idOfMessage,
    nameOfPropertyInWindowToRecordResponse
  ) {
    return createIife(sendMessageAndRecordResponse, [
      idOfMessage,
      nameOfPropertyInWindowToRecordResponse
    ]);
  };
})();

const createIife = function(fn, args) {
  return "(" +
    fn.toString() +
  ").apply(null," + JSON.stringify(args) + ");";
};

const getValueFromWindow = async function(tabs, tabId, propertyInWindow) {
  const [value] = await tabs.executeScript(tabId, {
    code: createScrOfScriptToGetValueFromWindow(propertyInWindow)
  });
  return value;
};

const createScrOfScriptToGetValueFromWindow = (function() {

  const getValueFromWindow = function(nameOfProperty) {
    return window[nameOfProperty];
  };

  return function(nameOfProperty) {
    return createIife(getValueFromWindow, [nameOfProperty]);
  };
})();

module.exports = checkInteractiveListenerOfInteractiveCallbackedEvent;
