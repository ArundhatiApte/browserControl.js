"use strict";

const callToAvoidRecursion = require("./../../common/callToAvoidRecursion");
const { _onConnection } = require("./../server")._namesOfPrivateProperties;

const emitConnectionEventAvoidingRecursion = function(server, connectionToClient) {
  return callToAvoidRecursion(function() {
    if (server[_onConnection]) {
      server[_onConnection](connectionToClient);
    }
  });
};

module.exports = emitConnectionEventAvoidingRecursion;
