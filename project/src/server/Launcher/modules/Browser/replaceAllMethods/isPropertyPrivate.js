"use strict";

const isPropertyPrivate = function(name) {
  return name[0] === "_";
};

module.exports = isPropertyPrivate;
