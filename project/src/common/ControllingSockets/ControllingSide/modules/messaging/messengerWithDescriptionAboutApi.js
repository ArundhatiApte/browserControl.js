"use strcit";

const valueView_parse = require("./../../../../valueView/valueView").parse;

const messenger = {
  parseMessageAboutApiDescription(bytesMessage, startIndex) {
    return valueView_parse(bytesMessage, startIndex + 1);
  }
};

module.exports = messenger;
