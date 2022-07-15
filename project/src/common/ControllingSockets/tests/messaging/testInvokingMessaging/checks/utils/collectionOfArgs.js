"use strict";

const collectionOfArgs = [
  [1, 2],
  ["hello", "browser"],
  [{obj: true}, {tab: 22}],
  /*[null]*/, [0], /*[NaN],*/ //NaN !== NaN true TODO
  [["subArray", "s", "2"], [39]]
];

module.exports = collectionOfArgs;
