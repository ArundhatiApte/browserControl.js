"use scrict";

const RemoteInteractiveSocketEventEmitter = require("./RemoteInteractiveSocketEventEmitter");

const {
  _createTimeoutToReceiveResponse,
  _createResponseAcceptor
} = RemoteInteractiveSocketEventEmitter;

const RemoteInteractivePromisedSocketEventEmitter = class extends RemoteInteractiveSocketEventEmitter {
  constructor(socketEventApi) {
    super(socketEventApi);
  }

  async _callAsyncListenerToGetResponse(listener, args, resolve, reject) {
    const timer = _createTimeoutToReceiveResponse(reject),
          callback = _createResponseAcceptor(resolve, timer);
    let responseFromListener;

    try {
      const gettingResponse = args ? listener.apply(null, args) : listener();
      responseFromListener = await gettingResponse;
    } catch(error) {
      clearTimeout(timer);
      reject(error);
      return;
    }
    callback(responseFromListener);
  }
};

module.exports = RemoteInteractivePromisedSocketEventEmitter;
