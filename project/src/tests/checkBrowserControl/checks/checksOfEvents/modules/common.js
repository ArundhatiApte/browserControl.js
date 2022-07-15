"use strict";

const createTimeoutForPromise = function(rejectPromise, maxTimeMsToWait) {
  return setTimeout(function() {
    return rejectPromise(new Error("Время ожидания вышло."));
  }, maxTimeMsToWait);
};

const resolveAwaitedPromise = function(timeout, resolvePromise) {
  clearTimeout(timeout);
  resolvePromise();
};

const maxTimeMsForTask = 4000;

module.exports = {
  createTimeoutForPromise,
  resolveAwaitedPromise,
  maxTimeMsForTask
};
