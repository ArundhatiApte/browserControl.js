"use strict";

const valueView_bytiefy = require("./../../../../valueView/valueView").bytiefy;
const header = require("./../../../common/messagesHeaders").descriptionAboutApi.clientHeader;

const messager = {
  createMessageAboutApiDescription(sizeOfHeader, apiDescription) {
    const out = valueView_bytiefy(sizeOfHeader + 1, apiDescription);
    new Uint8Array(out)[sizeOfHeader] = header;
    return out;
  }
};

module.exports = messager;
