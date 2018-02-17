'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = getCollectionEntries;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getLength(type, collection) {
  if (type === 'Object') {
    return (0, _keys2.default)(collection).length;
  } else if (type === 'Array') {
    return collection.length;
  }

  return Infinity;
}

function isIterableMap(collection) {
  return typeof collection.set === 'function';
}

function getEntries(type, collection, sortObjectKeys) {
  var from = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var to = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Infinity;

  var res = void 0;

  if (type === 'Object') {
    var keys = (0, _getOwnPropertyNames2.default)(collection);

    if (typeof sortObjectKeys !== 'undefined') {
      keys.sort(sortObjectKeys);
    }

    keys = keys.slice(from, to + 1);

    res = {
      entries: keys.map(function (key) {
        return { key: key, value: collection[key] };
      })
    };
  } else if (type === 'Array') {
    res = {
      entries: collection.slice(from, to + 1).map(function (val, idx) {
        return { key: idx + from, value: val };
      })
    };
  } else {
    var idx = 0;
    var entries = [];
    var done = true;

    var isMap = isIterableMap(collection);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(collection), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        if (idx > to) {
          done = false;
          break;
        }
        if (from <= idx) {
          if (isMap && Array.isArray(item)) {
            if (typeof item[0] === 'string' || typeof item[0] === 'number') {
              entries.push({ key: item[0], value: item[1] });
            } else {
              entries.push({
                key: '[entry ' + idx + ']',
                value: {
                  '[key]': item[0],
                  '[value]': item[1]
                }
              });
            }
          } else {
            entries.push({ key: idx, value: item });
          }
        }
        idx++;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    res = {
      hasMore: !done,
      entries: entries
    };
  }

  return res;
}

function getRanges(from, to, limit) {
  var ranges = [];
  while (to - from > limit * limit) {
    limit = limit * limit;
  }
  for (var i = from; i <= to; i += limit) {
    ranges.push({ from: i, to: Math.min(to, i + limit - 1) });
  }

  return ranges;
}

function getCollectionEntries(type, collection, sortObjectKeys, limit) {
  var from = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var to = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : Infinity;

  var getEntriesBound = getEntries.bind(null, type, collection, sortObjectKeys);

  if (!limit) {
    return getEntriesBound().entries;
  }

  var isSubset = to < Infinity;
  var length = Math.min(to - from, getLength(type, collection));

  if (type !== 'Iterable') {
    if (length <= limit || limit < 7) {
      return getEntriesBound(from, to).entries;
    }
  } else {
    if (length <= limit && !isSubset) {
      return getEntriesBound(from, to).entries;
    }
  }

  var limitedEntries = void 0;
  if (type === 'Iterable') {
    var _getEntriesBound = getEntriesBound(from, from + limit - 1),
        hasMore = _getEntriesBound.hasMore,
        entries = _getEntriesBound.entries;

    limitedEntries = hasMore ? [].concat((0, _toConsumableArray3.default)(entries), (0, _toConsumableArray3.default)(getRanges(from + limit, from + 2 * limit - 1, limit))) : entries;
  } else {
    limitedEntries = isSubset ? getRanges(from, to, limit) : [].concat((0, _toConsumableArray3.default)(getEntriesBound(0, limit - 5).entries), (0, _toConsumableArray3.default)(getRanges(limit - 4, length - 5, limit)), (0, _toConsumableArray3.default)(getEntriesBound(length - 4, length - 1).entries));
  }

  return limitedEntries;
}