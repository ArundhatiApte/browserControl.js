"use strcit";

const valueView_parse = require("./../../../common/valueView/valueView").parse;

const messenger = {
  parseMessageAboutApiDescription(bytesMessage, startIndex) {
    return valueView_parse(bytesMessage, startIndex + 1);
  }
};

module.exports = messenger;
