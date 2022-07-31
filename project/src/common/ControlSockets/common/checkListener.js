"use strict";

module.exports = function(listener) {
  if (listener) {
    return;
  }
  throw new Error("Listener is nullsih.");
};
