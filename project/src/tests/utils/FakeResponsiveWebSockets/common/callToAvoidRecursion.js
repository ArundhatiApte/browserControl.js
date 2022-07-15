"use strict";

const callToAvoidRecursion = function(fn) {
  return setTimeout(fn, 0);
};

module.exports = callToAvoidRecursion;
 
