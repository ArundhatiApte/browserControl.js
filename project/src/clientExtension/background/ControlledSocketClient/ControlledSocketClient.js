"use strcit";

const ResponsiveWebSocketClient = require(
  "./../../../common/ResponsiveWebSockets/Client/ResponsiveWebSocketClient"
);
const ControlledSide = require("./../../../common/ControllingSockets/ControlledSide/ControlledSide");

const { _connection } = ControlledSide._namesOfProtectedProperties;

const ControlledSocketClient = class extends ControlledSide {
  constructor(responsiveWebSocketClient) {
    super(responsiveWebSocketClient || new ResponsiveWebSocketClient());
  }

  connect(url) {
    return this[_connection].connect(url);
  }
};

ControlledSocketClient.setW3CWebSocketClientClass = ResponsiveWebSocketClient.setWebSocketClientClass;

module.exports = ControlledSocketClient;
