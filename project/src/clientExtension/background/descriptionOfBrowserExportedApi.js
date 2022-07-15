"use strict";

const createDescOfMethod = function(link, isReturning, isAsync) {
  const out = {link, isMethod: true};
  if (isReturning) {
    out.isReturning = true;
  }
  if (isAsync) {
    out.isAsync = true;
  }
  return out;
};

const createDescOfEvent = function(link, isInteractive, isPromised) {
  const out = {link, isEvent: true};
  if (isInteractive) {
    out.isInteractive = true;
  }
  if (isPromised) {
    out.isPromised = true;
  }
  return out;
};

const createDescOfSetting = function(setting) {
  return {
    link: setting,
    get: createDescOfMethod(setting.set, isReturning, isAsync),
    set: createDescOfMethod(setting.set, isReturning, isAsync),
    clear: createDescOfMethod(setting.set, isReturning, isAsync),
    onChange: createDescOfEvent(setting.onChange)
  };
};

const {
  cookies,
  privacy,
  proxy,
  runtime,
  tabs,
  webNavigation,
  windows
} = browser;

const isAsync = true;
const isReturning = true;

const descOfBrowserApi = {
  cookies: {
    link: cookies,

    get: createDescOfMethod(cookies.get, isReturning, isAsync),
    getAll: createDescOfMethod(cookies.getAll, isReturning, isAsync),
    getAllCookieStores: createDescOfMethod(cookies.getAllCookieStores, isReturning, isAsync),
    remove: createDescOfMethod(cookies.remove, isReturning, isAsync),
    set: createDescOfMethod(cookies.set, isReturning, isAsync),

    onChanged: createDescOfEvent(cookies.onChanged),
  },

  privacy: (function() {
    const {
      network,
      websites
    } = privacy;

    return {
      link: privacy,
      network: {
        link: network,
        networkPredictionEnabled: createDescOfSetting(network.networkPredictionEnabled),
        peerConnectionEnabled: createDescOfSetting(network.peerConnectionEnabled),
        webRTCIPHandlingPolicy: createDescOfSetting(network.webRTCIPHandlingPolicy),
        httpsOnlyMode: createDescOfSetting(network.httpsOnlyMode)
      },
      websites: {
        cookieConfig: createDescOfSetting(websites.cookieConfig),
        firstPartyIsolate: createDescOfSetting(websites.firstPartyIsolate),
        hyperlinkAuditingEnabled: createDescOfSetting(websites.hyperlinkAuditingEnabled),
        referrersEnabled: createDescOfSetting(websites.referrersEnabled),
        resistFingerprinting: createDescOfSetting(websites.resistFingerprinting),
        trackingProtectionMode: createDescOfSetting(websites.trackingProtectionMode)
      }
    };
  })(),

  proxy: {
    link: proxy,
    settings: createDescOfSetting(proxy.settings)
  },

  runtime: {
    link: runtime,

    getBrowserInfo: createDescOfMethod(runtime.getBrowserInfo, isReturning, isAsync),
    sendMessage: createDescOfMethod(runtime.sendMessage, isReturning, isAsync),

    onMessage: createDescOfEvent(runtime.onMessage, true),
    onMessageExternal: createDescOfEvent(runtime.onMessageExternal, true),
  },

  tabs: {
    link: tabs,

    create: createDescOfMethod(tabs.create, isReturning, isAsync),
    detectLanguage: createDescOfMethod(tabs.detectLanguage, isReturning, isAsync),
    duplicate: createDescOfMethod(tabs.duplicate, isReturning, isAsync),
    executeScript: createDescOfMethod(tabs.executeScript, isReturning, isAsync),

    get: createDescOfMethod(tabs.get, isReturning, isAsync),
    insertCSS: createDescOfMethod(tabs.insertCSS, false, isAsync),
    query: createDescOfMethod(tabs.query, isReturning, isAsync),
    reload: createDescOfMethod(tabs.reload, true),

    remove: createDescOfMethod(tabs.remove, false, isAsync),
    removeCSS: createDescOfMethod(tabs.removeCSS, false, isAsync),
    sendMessage: createDescOfMethod(tabs.sendMessage, true, true),
    update: createDescOfMethod(tabs.update, isReturning, isAsync),

    onActivated: createDescOfEvent(tabs.onActivated),
    onCreated: createDescOfEvent(tabs.onCreated),
    onRemoved: createDescOfEvent(tabs.onRemoved),
    onUpdated: createDescOfEvent(tabs.onUpdated)
  },

  webNavigation: {
    link: webNavigation,

    onBeforeNavigate: createDescOfEvent(webNavigation.onBeforeNavigate),
    onCompleted: createDescOfEvent(webNavigation.onCompleted),
    onDOMContentLoaded: createDescOfEvent(webNavigation.onDOMContentLoaded),
    onErrorOccurred: createDescOfEvent(webNavigation.onErrorOccurred)
  },

  windows: {
    link: windows,

    create: createDescOfMethod(windows.create, isReturning, isAsync),
    get: createDescOfMethod(windows.get, isReturning, isAsync),
    getAll: createDescOfMethod(windows.getAll, isReturning, isAsync),
    getCurrent: createDescOfMethod(windows.getCurrent, isReturning, isAsync),
    remove: createDescOfMethod(windows.remove, false, isAsync),
    update: createDescOfMethod(windows.update, isReturning, isAsync),

    onCreated: createDescOfEvent(windows.onCreated)
  }
};

module.exports = descOfBrowserApi;
