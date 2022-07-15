"use strict";

const wait = function (timeMs) {
  return new Promise(function (resolve, reject) {
    return setTimeout(resolve, timeMs);
  });
};

module.exports = wait;
