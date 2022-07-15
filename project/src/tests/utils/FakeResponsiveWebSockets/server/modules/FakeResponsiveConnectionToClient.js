"use strict";

const concat2ArrayBuffers = require("./../../../concat2ArrayBuffers");

const FakeResponsiveWebSocketConnection = require("./../../common/FakeResponsiveWebSocketConnection");

const FakeResponsiveConnectionToClient = class extends FakeResponsiveWebSocketConnection{
  constructor(fakeWebSocketClient, userData) {
    super(fakeWebSocketClient);
    this[_userData] = userData;
  }

  get url() {
    return "foo";
  }

  getRemoteAddress() {
    return nonusedRemoteAddress;
  }

  get userData() {
    return this[_userData];
  }

  send2FragmentsOfBinaryRequest(firstFragment, secondFragment) {
    return this.sendBinaryRequest(concat2ArrayBuffers(firstFragment, secondFragment));
  }

  _createSenderOfResponse(resolvePromise) {
    return new SenderOfResponse(resolvePromise);
  }
};

const _userData = Symbol();
const nonusedRemoteAddress = new ArrayBuffer();

const SenderOfResponse = class {
  constructor(resolvePromise) {
    this[_resolvePromise] = resolvePromise;
  }

  sendBinaryResponse(message) {
    this[_resolvePromise](message);
  }

  send2FragmentsOfBinaryResponse(firstFragment, secondFragment) {
    this[_resolvePromise](concat2ArrayBuffers(firstFragment, secondFragment));
  }
};

const _resolvePromise = Symbol();

module.exports = FakeResponsiveConnectionToClient;
