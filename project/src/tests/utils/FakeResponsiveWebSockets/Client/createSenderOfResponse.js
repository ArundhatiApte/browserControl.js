 "use strict";

const createSenderOfResponse = function(resolverOfPromise) {
  return {
    sendBinaryResponse: resolverOfPromise
  };
};

module.exports = createSenderOfResponse;
