"use strict";

const _portPrefName = "_";
const defaultPort = 45678;

const settings = {
  setControlPort(port) {
    return browser.storage.local.set({
      [_portPrefName]: port
    });
  },
  async getControlPort() {
    const storedObject = await browser.storage.local.get(_portPrefName);
    const port = storedObject[_portPrefName];

    if (port) {
      return port;
    }
    return defaultPort;
  }
};

module.exports = settings;
