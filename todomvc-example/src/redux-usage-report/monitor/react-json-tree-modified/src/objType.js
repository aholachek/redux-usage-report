'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _iterator = require('babel-runtime/core-js/symbol/iterator');

var _iterator2 = _interopRequireDefault(_iterator);

exports.default = objType;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function objType(obj) {
  var type = Object.prototype.toString.call(obj).slice(8, -1);
  if (type === 'Object' && typeof obj[_iterator2.default] === 'function') {
    return 'Iterable';
  }

  return type;
}