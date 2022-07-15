"use strict";

const expect = require("assert");

const uWebSockets = require("uWebSockets.js");

const ResponsiveWebSocketServer = require(
  "./../../common/ResponsiveWebSockets/Server/ResponsiveWebSocketServer"
);
ResponsiveWebSocketServer.setUWebSockets(uWebSockets);

const ResponsiveWebSocketClient = require("./../../common/ResponsiveWebSockets/Client/ResponsiveWebSocketClient");
const W3CWebSocketClient = require("./../../common/ResponsiveWebSockets/W3CWebSocketClient");

ResponsiveWebSocketClient.setWebSocketClientClass(W3CWebSocketClient);

const executeTests = require("./executeTests/executeTests");

executeTests(describe, it, {
  nameOfTests: "тест использования удаленного Api",
  responsiveWebSocketServer: new ResponsiveWebSocketServer({server: new uWebSockets.App({})}),
  port: 1234,
  ResponsiveWebSocketClient
});
