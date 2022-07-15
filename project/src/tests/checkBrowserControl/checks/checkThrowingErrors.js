"use strict";

const expectThrowsAsync = require("assert").rejects;

const checkThrowingErrors = function(_, browser) {
  const tabs = browser.tabs;

  const methodToWrongParamet = [
    [tabs.create, "http://duckduckgo.com"]
  ];

  const checkings = [];
  for (const [method, parametr] of methodToWrongParamet) {
    checkings.push(checkThrowingError(tabs, method, parametr));
  }
  return Promise.all(checkings);
};

const checkThrowingError = function(context, method, parametr) {
  return expectThrowsAsync(method.bind(context, method));
};

module.exports = checkThrowingErrors;
