"use strict";

const executeTests = require("./../../../common/ResponsiveWebSockets/tests/testResponsiveWebSockets/executeTests");
const fakeServer = require("./server/server");
const FakeClient = require("./Client/Client");

const createConnectionToClientAndClient = function() {
  return new Promise(function(resolve, reject) {
    const client = new Client();
    server.setConnectionListener(async function(connectionToClient) {
      await connectingClient;
      resolve({
        connectionToClient,
        client
      });
    });
    const connectingClient= client.connect("ws://any.thing");
  });
};

executeTests(describe, it, {
  nameOfTest: "тест поддельных отзывчивых WebSockets",
  responsiveWebSocketServer: fakeServer,
  urlOfServer: "ws://any.thing",
  port: 1234,
  ResponsiveWebSocketClient: FakeClient
});
