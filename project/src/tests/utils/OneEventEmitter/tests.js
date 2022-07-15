"use strcit";

const {
  ok: expectTrue,
  deepStrictEqual: expectDeepEqual
} = require("assert").ok;

const OneEventEmitter = require("./OneEventEmitter");

const test = function() {
  const emitter = new OneEventEmitter();
  const collectionOfArgs = [
    [1, 2], ["ab", "p"]
  ];
  const recorded = [];

  const firstRecordingListener = function(...args) {
    recorded.push(args);
  };
  const secondListener = () => {};

  emitter.addListener(firstRecordingListener);
  expectTrue(emitter.hasListener(firstRecordingListener));

  emitter.addListener(secondListener);
  expectTrue(emitter.hasListener(secondListener));
  expectTrue(emitter.hasListener(firstRecordingListener));

  emitter.removeListener(secondListener);
  expectTrue(emitter.hasListener(firstRecordingListener));
  expectTrue(!emitter.hasListener(secondListener));

  const emitEvent = emitter.emit;
  for (const args of collectionOfArgs) {
    emitEvent.apply(emitter, args);
  }
  emitter.removeListener(firstRecordingListener);
  expectDeepEqual(recorded, collectionOfArgs);
};

describe("тест генератора 1-го события", function() {
  it("добавление, проверка, генерация, удаление", test);
});
