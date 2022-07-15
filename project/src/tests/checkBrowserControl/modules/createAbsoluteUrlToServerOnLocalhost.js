"use strict";

const createAbsoluteUrlToServerOnLocalhost = function(link, port) {
  return "http://127.0.0.1:" + port + "/" + link;
};

module.exports = createAbsoluteUrlToServerOnLocalhost;
