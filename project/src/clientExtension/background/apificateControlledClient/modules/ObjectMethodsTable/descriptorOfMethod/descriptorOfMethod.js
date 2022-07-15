"use strict";

const descriptorOfMethod = {
  create(isReturning, isAsync) {
    let out = 0;
    if (isReturning) {
      out |= maskForReturning;
    }
    if (isAsync) {
      out |= maskForAsync;
    }
    return out;
  }
};

const maskForAsync = 0b01,
      maskForReturning = 0b10;

const createMethodToGetBit = function(mask) {
  return function(descriptorOfMethod) {
    return !!(descriptorOfMethod & mask);
  };
};

descriptorOfMethod.isAsync = createMethodToGetBit(maskForAsync);
descriptorOfMethod.isReturning = createMethodToGetBit(maskForReturning);

module.exports = descriptorOfMethod;
