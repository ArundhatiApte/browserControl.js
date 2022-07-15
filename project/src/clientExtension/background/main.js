"use strict";

const settings = require("./../common/settings");

const descriptionOfBrowserExportedApi = require("./descriptionOfBrowserExportedApi");

const ControlledSocketClient = require("./ControlledSocketClient/ControlledSocketClient");
const apificateControlledClient = require("./apificateControlledClient/apificateControlledClient");

ControlledSocketClient.setW3CWebSocketClientClass(window.WebSocket);

const maxTimeMsToWaitResponseFromListenerOfInteractiveEvent = 24000;

(async function main() {
  const port = await settings.getControlPort();
  const controlledClient = new ControlledSocketClient();
  const urlOfControllingServer = "ws://127.0.0.1:" + port + "/";

  controlledClient.setMaxTimeMsToWaitResponse(maxTimeMsToWaitResponseFromListenerOfInteractiveEvent);

  try {
    await controlledClient.connect(urlOfControllingServer);
  } catch(error) {
    console.warn("не удалось подключиться к серверу", error);
    return;
  }

  const descriptionOfSendedApi = apificateControlledClient(controlledClient, descriptionOfBrowserExportedApi);
  controlledClient.sendDescribingApiMessage(descriptionOfSendedApi);
  console.log("интерфейс экспортирован для локального сервера на порту ", port);
})();
