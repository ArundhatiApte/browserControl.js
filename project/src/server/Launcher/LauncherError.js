"use strict";

const LauncherError = class extends Error {
  constructor(message, sourceError) {
    super(message);
    this.cause = sourceError;
  }
};

module.exports = LauncherError;
