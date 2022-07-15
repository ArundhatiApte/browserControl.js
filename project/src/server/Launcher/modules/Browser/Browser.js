"use strict";

const createRemoteApi = require("./../../../createRemoteApi/createRemoteApi");
const replaceAllMethods = require("./replaceAllMethods/replaceAllMethods");

const Browser = class {
  constructor(process, controllingConnection, descriptionOfApi) {
    this[_process] = process;
    this[_connection] = controllingConnection;
    _setupApi(this, controllingConnection, descriptionOfApi);
    _setupListenersOfEvents(this);
  };

  setCloseListener(listener) {
    this[_onClose] = listener
  }

  setDisconnectListener(listener) {
    this[_onDisconnect] = listener;
  }

  getProcess() {
    return this[_process];
  }
};

Browser.RemoteError = require("./../../../createRemoteApi/createRemoteApi").ErrorFromClient;

const _process = Symbol(),
      _connection = Symbol(),
      _browserApi = Symbol(),
      _onClose = Symbol(),
      _onDisconnect = Symbol();

const _setupApi = function(browser, controllingConnection, descriptionOfApi) {
  const apiControlledViaSocket = createRemoteApi(controllingConnection, descriptionOfApi);
  browser[_browserApi] = apiControlledViaSocket;

  for (const [name, subApi] of Object.entries(apiControlledViaSocket)) {
    browser[name] = subApi;
  }
};

const _setupListenersOfEvents = function(browser) {
  browser[_process].once("close", _onProcessClose.bind(browser));
  browser[_connection].setCloseListener(_onConnectionClose.bind(browser));
};

const _onProcessClose = function() {
  _deapificateApiOfBrowser(this, _throwErrorAboutClosedProcess);
  _callListenerIfNeed(this, this[_onClose]);
};

const _onConnectionClose = function() {
  _deapificateApiOfBrowser(this, _throwErrorAboutClosedConnection);
  _callListenerIfNeed(this, this[_onDisconnect]);
};

const _deapificateApiOfBrowser = function(browser, throwError) {
  for (const object of Object.values(browser[_browserApi])) {
    replaceAllMethods(object, throwError);
  }
};

const _callListenerIfNeed = function(context, listener) {
  if (listener) {
    listener.call(context);
  }
};

const _throwErrorAboutClosedConnection = async function() {
  throw new Error("WebSocket connection with browser was closed.");
};

const _throwErrorAboutClosedProcess = async function() {
  throw new Error("Process of browser was closed.");
};

module.exports = Browser;
