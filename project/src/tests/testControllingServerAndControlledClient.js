"use strict";

const fakeResponsiveWebSocketServer = require("./utils/FakeResponsiveWebSockets/server/server");
const FakeResponsiveWebSocketClient = require("./utils/FakeResponsiveWebSockets/Client/Client");

const ControllingServer = require("./../server/ControllingServer/ControllingServer");
const ControlledClient = require("./../clientExtension/background/ControlledSocketClient/ControlledSocketClient");

const executeTests = require("./../common/ControlSockets/tests/tests/executeTests");

const createControllingAndControlledSides = function() {
  return new Promise(function(resolve, reject) {
    const controllingServer = new ControllingServer(fakeResponsiveWebSocketServer);
    const responsiveWebSocketClient = new FakeResponsiveWebSocketClient();
    const controlledSide = new ControlledClient(responsiveWebSocketClient);

    controllingServer.setConnectionListener(async function(controllingConnection) {
      await connectingClient;
      resolve({
        controllingSide: controllingConnection,
        controlledSide
      });
    });
    const connectingClient = responsiveWebSocketClient.connect("ws://any.thing");
  });
};

executeTests(describe, it, {
  nameOfTests: "тест сервера и клиента для удалённого вызова методов и отправки событий",
  createControllingAndControlledSides
});
