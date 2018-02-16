'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isObjectOrArray = exports.isObjectOrArray = function isObjectOrArray(x) {
  return x === Object(x) && typeof x !== 'function';
};
var isUndefined = exports.isUndefined = function isUndefined(x) {
  return x === undefined;
};