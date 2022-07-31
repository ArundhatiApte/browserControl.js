"use strict";

const areDeepEqual = require("util").isDeepStrictEqual;

const checkSendingDescriptionOfApi = function(controllingSide, controlledSide) {
  return new Promise(function(resolve, reject) {
    const descriptionOfApi = {
      math: {
        id: 0,
        add: {
          isMethod: true,
          id: 1
        },
        factorial: {
          isMethod: true,
          id: 2
        }
      }
    };

    controllingSide.setDescribingApiMessageListener(function(description) {
      if(areDeepEqual(descriptionOfApi, description)) {
        resolve()
      } else {
        reject(new Error("Разные описания."));
      }
    });
    controlledSide.sendDescribingApiMessage(descriptionOfApi);
  });
};

module.exports = checkSendingDescriptionOfApi;
