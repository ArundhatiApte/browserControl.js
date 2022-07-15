"use strict";

const ControllingSide = require("./../../../common/ControllingSockets/ControllingSide/ControllingSide");

const {
  _connection
} = ControllingSide._namesOfProtectedProperties;

const ControlingConnection = class extends ControllingSide {
  constructor(responsiveWebSocketConnection) {
    super(responsiveWebSocketConnection);
  }

  setCloseListener(listener) {
    this[_connection].setCloseListener(listener ? listener.bind(this) : null);
  }

  close() {
    return this[_connection].close();
  }
};

ControlingConnection.statusOfCall = ControllingSide.statusOfCall;

module.exports = ControlingConnection;
