"use strict";

const extractArgsWithouCallback = function(argsLikeArray, startIndex) {
  const out = [];
  const lenMinCallback = argsLikeArray.length - 1;

  for (let i = startIndex; i < lenMinCallback; i += 1) {
    out.push(argsLikeArray[i]);
  }
  return out;
};

module.exports = extractArgsWithouCallback;
