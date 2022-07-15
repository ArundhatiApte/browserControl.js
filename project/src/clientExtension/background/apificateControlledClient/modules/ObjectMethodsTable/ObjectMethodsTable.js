"use strict";

const {
  create: createDescriptorOfMethod,
  isAsync: isMethodAsync,
  isReturning: isMethodReturning
} = require("./descriptorOfMethod/descriptorOfMethod");

const ObjectMethodsTable = class {
  constructor() {
    const table = this[_data] = new Map();

    // запоминание ссылкок на часто используемые методы
    this.get = this.get;
    table.get = table.get;
  }

  set(objectId, objectLink, methodId, funcLink, isReturned, isAsync) {
    const table = this[_data],
          methodsIdsToMethodsDesc = table.get(objectId),
          methodDescript = createDescriptorOfMethod(isReturned, isAsync),
          methodData = dataAboutMethod_create(funcLink, methodDescript);

    if (!methodsIdsToMethodsDesc) {
      const subTable = new Map();
      subTable[_link] = objectLink;
      subTable.set(methodId, methodData);

      table.set(objectId, subTable);;
      return;
    }
    if (methodsIdsToMethodsDesc[_link] !== objectLink) {
      throw new Error("Table with methods of object with id " + objectId + " is already exist.");
    }
    methodsIdsToMethodsDesc.set(methodId, methodData);
  }

  get(objectId, methodId) {
    const methodsIdsToMethodsDesc = this[_data].get(objectId);
    if (!methodsIdsToMethodsDesc) {
      return null;
    }
    const entry = methodsIdsToMethodsDesc.get(methodId);
    if (!entry) {
      return null;
    }
    const descriptor = entry[dataAboutMethod_nameOfDescriotor];
    return {
      [outEntry_object]: methodsIdsToMethodsDesc[_link],
      [outEntry_method]: entry[dataAboutMethod_nameOfLinkToMethod],
      [outEntry_isReturning]: isMethodReturning(descriptor),
      [outEntry_isAsync]: isMethodAsync(descriptor)
    };
  }
};

const _data = "_";
const _link = Symbol();

const dataAboutMethod_create = function(linkToFn, descriptorOfFn) {
  return {
    [dataAboutMethod_nameOfLinkToMethod]: linkToFn,
    [dataAboutMethod_nameOfDescriotor]: descriptorOfFn
  };
};

const dataAboutMethod_nameOfLinkToMethod = Symbol(),
      dataAboutMethod_nameOfDescriotor = Symbol();

const outEntry_object = _link,
      outEntry_method = Symbol(),
      outEntry_isReturning = Symbol(),
      outEntry_isAsync = Symbol();

ObjectMethodsTable.symbolsOfEntry = {
  object: outEntry_object,
  method: outEntry_method,
  isReturning: outEntry_isReturning,
  isAsync: outEntry_isAsync
};

module.exports = ObjectMethodsTable;
