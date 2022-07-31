"use strict";

const ControllingSide = require("./../../ControllingSide/ControllingSide");
const ControlledSide = require("./../../ControlledSide/ControlledSide");

const fakeResponsiveWebSocketServer = require(
  "./../../../../tests/utils/FakeResponsiveWebSockets/server/server"
);
const FakeResponsiveWebSocketClient = require("./../../../../tests/utils/FakeResponsiveWebSockets/Client/Client");

const executeTests = require("./executeTests");

const createControllingAndControlledSides = function() {
  return new Promise(function(resolve, reject) {
    const responsiveClient = new FakeResponsiveWebSocketClient();

    fakeResponsiveWebSocketServer.setConnectionListener(async function(responsiveConnection) {
      const connectionToClient = new ControllingSide(responsiveConnection);

      try {
        await connectingClient;
      } catch(error) {
        reject(error);
      }

      const controlledClient = new ControlledSide(responsiveClient);
      resolve({
        controllingSide: connectionToClient,
        controlledSide: controlledClient
      });
    });

    const connectingClient = responsiveClient.connect("ws://any.thing");
  });
};

executeTests(describe, it, {
  nameOfTests: "тест управляющего серв. и оповещающего клиент. соедиений",
  createControllingAndControlledSides
});
