"use strict";

const launchProcess = require("child_process").spawn;

const Browser = require("./modules/Browser/Browser");
const LauncherError = require("./LauncherError");

const maxTimeMsToWaitResultOfMethodCall = 24000;

const Launcher = class {
  constructor(controllingServer, port) {
    this[_controlligServer] = controllingServer;
    this[_port] = port;

    this[_launchingBrowser] = Promise.resolve();
    this[_wasServerStarted] = false;

    this[_awaitedPromiseOnDescriptonOfApi] = null;
    controllingServer.setConnectionListener(_acceptBrowserIfNeed.bind(this));
  }

  async launch(commandToStartBrowser, maxTimeMsToWait = defaultMaxTimeMsToWaitLaunching) {
    if (this[_wasServerStarted]) {
      return _launchBrowserAfterStartOfServer(this, commandToStartBrowser, maxTimeMsToWait);
    }
    try {
      await this[_controlligServer].listen(this[_port]);
    } catch(error) {
      throw new LauncherError("Can't start webSocket server.", error);
    }
    this[_wasServerStarted] = true;
    return _launchBrowserAfterStartOfServer(this, commandToStartBrowser, maxTimeMsToWait);
  }

  setPort(port) {
    this[_port] = port;
  }

  close() {
    return this[_controlligServer].close();
  }
};

const _controlligServer = "_";
const _port = "_p";

const _wasServerStarted = "_s";
const _launchingBrowser = "_l";
const _awaitedPromiseOnDescriptonOfApi = "_d";

const _launchBrowserAfterStartOfServer = async function(
  launcher,
  commandToStartBrowser,
  maxTimeMsToWait = defaultMaxTimeMsToWaitLaunching
) {
  try {
    await launcher[_launchingBrowser];
  } catch(error) {}

  const launchingBrowser = _launchBrowser(launcher, commandToStartBrowser, maxTimeMsToWait);
  launcher[_launchingBrowser] = launchingBrowser;
  const browser = await launchingBrowser;
  return browser;
};

const _launchBrowser = function(launcher, commandToStartBrowser, maxTimeMsToWait) {
  return new Promise(function (resolve, reject) {
    const timeoutToLaunch = _createTimeoutToLaunchBrowser(launcher, maxTimeMsToWait, reject);

    let process;
    const getProcess = function() {
      return process;
    };

    launcher[_awaitedPromiseOnDescriptonOfApi] = _createAwaitedPromiseOnDescriptonOfApi(
      timeoutToLaunch,
      getProcess,
      resolve
    );

    try {
      process = launchProcess(commandToStartBrowser);
    } catch(error) {
      clearTimeout(timeoutToLaunch);
      delete launcher[_awaitedPromiseOnDescriptonOfApi];
      reject(new LauncherError("Can't start browser (" + commandToStartBrowser + ")", error));
    }
  });
};

const _createTimeoutToLaunchBrowser = function(self, maxTimeMsToWait, rejectPromise) {
  return setTimeout(function() {
    delete self[_awaitedPromiseOnDescriptonOfApi];
    rejectPromise(new Error("Время ожидания запуска браузера истекло"));
  }, maxTimeMsToWait);
};
const defaultMaxTimeMsToWaitLaunching = 8000;

const _createAwaitedPromiseOnDescriptonOfApi = function(timeoutToLaunch, getProcess, resolvePromise) {
  return {timeoutToLaunch, getProcess, resolvePromise};
};

const _acceptBrowserIfNeed = function(controllingConnectionToClient) {
  const entryOfListener = this[_awaitedPromiseOnDescriptonOfApi];
  if (!entryOfListener) {
    controllingConnectionToClient.close();
    return;
  }
  controllingConnectionToClient.setMaxTimeMsToWaitResponse(maxTimeMsToWaitResultOfMethodCall);

  controllingConnectionToClient.setDescribingApiMessageListener((descriptionOfApi) => {
    delete this[_awaitedPromiseOnDescriptonOfApi];
    clearTimeout(entryOfListener.timeoutToLaunch);
    const process = entryOfListener.getProcess();
    const browser = new Browser(process, controllingConnectionToClient, descriptionOfApi);
    entryOfListener.resolvePromise(browser);
  });
};

module.exports = Launcher;
