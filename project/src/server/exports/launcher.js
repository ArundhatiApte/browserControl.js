"use strict";

const uWebSockets = require("uWebSockets.js");

const ResponsiveWebSocketServer = require("./../../common/ResponsiveWebSockets/Server/ResponsiveWebSocketServer");
const ControllingServer = require("./../ControllingServer/ControllingServer");
const Launcher = require("./../Launcher/Launcher");

ResponsiveWebSocketServer.setUWebSockets(uWebSockets);

const responsiveWebSocketServer = new ResponsiveWebSocketServer({
  server: new uWebSockets.App({}),
  compression: uWebSockets.DISABLED,
  idleTimeout: 0, // отключить
  maxBackpressure: 1024 * 1024,
  maxPayloadLength: 64 * 1024
});

const defaultPort = 45678;
const launcher = new Launcher(new ControllingServer(responsiveWebSocketServer), defaultPort);

module.exports = launcher;
