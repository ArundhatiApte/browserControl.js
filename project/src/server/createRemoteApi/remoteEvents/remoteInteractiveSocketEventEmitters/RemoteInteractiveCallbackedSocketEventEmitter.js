"use scrict";

const RemoteInteractiveSocketEventEmitter = require("./RemoteInteractiveSocketEventEmitter");

const {
  _createTimeoutToReceiveResponse,
  _createResponseAcceptor
} = RemoteInteractiveSocketEventEmitter;

const RemoteInteractiveCallbackedSocketEventEmitter = class extends RemoteInteractiveSocketEventEmitter {
  constructor(socketEventApi) {
    super(socketEventApi);
  }

  _callAsyncListenerToGetResponse(listener, args, resolve, reject) {
    const timer = _createTimeoutToReceiveResponse(reject),
          callback = _createResponseAcceptor(resolve, timer);

    args = args ? args.concat([callback]) : [callback];
    try {
      listener.apply(null, args);
    } catch(error) {
      clearTimeout(timer);
      reject(error);
    }
  }
};

module.exports = RemoteInteractiveCallbackedSocketEventEmitter;
