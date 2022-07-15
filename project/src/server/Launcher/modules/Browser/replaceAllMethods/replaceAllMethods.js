"use strict";

const isPropertyPrivate = require("./isPropertyPrivate");

const replaceAllMethodsRecursive = function(api, fnToReplaceAllPublicMethods) {
  for (const [key, value] of Object.entries(api)) {
    const type = typeof value;

    if (type === "function") {
      if (isPropertyPrivate(key)) {
        continue;
      }
      api[key] = fnToReplaceAllPublicMethods;
      continue;
    }

    if (type === "object" && (value !== null)) {
      replaceAllMethodsRecursive(value, fnToReplaceAllPublicMethods);
    }
  }
};

module.exports = replaceAllMethodsRecursive;
