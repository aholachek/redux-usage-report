'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _isSafeInteger = require('babel-runtime/core-js/number/is-safe-integer');

var _isSafeInteger2 = _interopRequireDefault(_isSafeInteger);

exports.default = JSONIterableNode;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _JSONNestedNode = require('./JSONNestedNode');

var _JSONNestedNode2 = _interopRequireDefault(_JSONNestedNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Returns the "n Items" string for this node,
// generating and caching it if it hasn't been created yet.
function createItemString(data, limit) {
  var count = 0;
  var hasMore = false;
  if ((0, _isSafeInteger2.default)(data.size)) {
    count = data.size;
  } else {
    // eslint-disable-next-line no-unused-vars
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(data), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var entry = _step.value;

        if (limit && count + 1 > limit) {
          hasMore = true;
          break;
        }
        count += 1;
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
  }
  return '' + (hasMore ? '>' : '') + count + ' ' + (count !== 1 ? 'entries' : 'entry');
}

// Configures <JSONNestedNode> to render an iterable
function JSONIterableNode(_ref) {
  var props = (0, _objectWithoutProperties3.default)(_ref, []);

  return _react2.default.createElement(_JSONNestedNode2.default, (0, _extends3.default)({}, props, {
    nodeType: 'Iterable',
    nodeTypeIndicator: '()',
    createItemString: createItemString
  }));
}