"use strict";

const createAbsoluteUrlToServerOnLocalhost = require("./../../modules/createAbsoluteUrlToServerOnLocalhost");
const createOnceListener = require("./modules/createOnceListener");

const checkListenerOfInteractiveEventThatIgnoreAbilityToSendResponse = async function(httpServer, browser) {
  const tabs = browser.tabs;
  const isListenerInteractive = true;
  const sendedMessage = "hello";

  const url = createAbsoluteUrlToServerOnLocalhost("home", httpServer.port);
  const onMessage = browser.runtime.onMessage;

  const listener = createOnceListener(onMessage, function(data, sender, sendResponse) {
    if (data === sendedMessage) {
      setTimeout(sendResponse.bind(null, 2), 20000);
      tabs.remove(tab.id);
      return true;
    }
  });

  const [tab] = await Promise.all([
    tabs.create({url}),
    onMessage.addListener(listener, isListenerInteractive)
  ]);

  await tabs.executeScript(tab.id, {
    code: "browser.runtime.sendMessage('" + sendedMessage +"');\n1"
  });
};

module.exports = checkListenerOfInteractiveEventThatIgnoreAbilityToSendResponse;
