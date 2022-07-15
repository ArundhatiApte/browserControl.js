"use strict";

const wait = require("./../../utils/wait");
const createAbsoluteUrlToServerOnLocalhost = require("./../modules/createAbsoluteUrlToServerOnLocalhost");

const checkCallingMethods = function(httpServer, browser) {
  const port = httpServer.port;
  const checkings = [];

  let absoluteUrl, checking;

  for (const link of Object.keys(httpServer.urlToPage)) {
    absoluteUrl = createAbsoluteUrlToServerOnLocalhost(link, port);
    checking = checkOpeningAndClosingTab(browser, absoluteUrl);
    checkings.push(checking);
  }

  return Promise.all(checkings);
};

const checkOpeningAndClosingTab = async function(browser, absoluteUrl) {
  const tabs = browser.tabs;
  const { id: tabId }= await tabs.create({url: absoluteUrl});

  await wait(600);
  await tabs.remove(tabId);
};

module.exports = checkCallingMethods;
