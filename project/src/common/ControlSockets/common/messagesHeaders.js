"use strict";

const messagesHeaders = {
  invoking: {
    response: {
      succes: 0,
      error: 1,
      clientNotFoundMethod: 2,
      syncErrorFromAsyncFn: 3,
      malformedRequest: 4
    }
  },
  events: {
    clientHeader: 1
  },
  descriptionAboutApi: {
    clientHeader: 2
  }
};

Object.freeze(messagesHeaders);

module.exports = messagesHeaders;
