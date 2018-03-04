"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMakeProxyFunction = undefined;

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = trackObjectUse;

var _utility = require("./utility");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UNPROXIED_OBJ_KEY = "__initialValue";

var getUnproxiedObject = function getUnproxiedObject(target) {
  return target[UNPROXIED_OBJ_KEY] !== undefined ? target[UNPROXIED_OBJ_KEY] : target;
};

var createMakeProxyFunction = exports.createMakeProxyFunction = function createMakeProxyFunction(_ref) {
  var _ref$keepOriginalValu = _ref.keepOriginalValues,
      keepOriginalValues = _ref$keepOriginalValu === undefined ? false : _ref$keepOriginalValu,
      accessedProperties = _ref.accessedProperties,
      _ref$shouldSkipProxy = _ref.shouldSkipProxy,
      shouldSkipProxy = _ref$shouldSkipProxy === undefined ? function () {
    return false;
  } : _ref$shouldSkipProxy,
      _ref$getBreakpoint = _ref.getBreakpoint,
      getBreakpoint = _ref$getBreakpoint === undefined ? function () {} : _ref$getBreakpoint,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === undefined ? function () {} : _ref$onChange;

  return function makeProxy(obj) {
    var stateLocation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    var handler = {
      get: function get(target, propKey) {
        // need to be able to actually get the value without triggering another get cycle
        if (propKey === UNPROXIED_OBJ_KEY) return target;
        var value = target[propKey];

        if (!Object.hasOwnProperty.call(target, propKey)) return value;

        if (shouldSkipProxy()) return JSON.parse((0, _stringify2.default)(value));

        var accessedPropertiesPointer = !stateLocation ? accessedProperties : stateLocation.split(".").reduce(function (acc, key) {
          return acc[key];
        }, accessedProperties);

        var newStateLocation = stateLocation ? stateLocation + "." + propKey : propKey;

        // allow people to examine the stack at certain access points
        if (getBreakpoint() === newStateLocation) {
          // explore the callstack to see when your app accesses a value
          debugger;
        }
        if ((0, _utility.isObjectOrArray)(value)) {
          if ((0, _utility.isUndefined)(accessedPropertiesPointer[propKey])) {
            accessedPropertiesPointer[propKey] = Array.isArray(value) ? [] : {};
            onChange(newStateLocation);
          }
          return makeProxy(value, newStateLocation);
        } else {
          if ((0, _utility.isUndefined)(accessedPropertiesPointer[propKey]) || !keepOriginalValues && value !== accessedPropertiesPointer[propKey]) {
            accessedPropertiesPointer[propKey] = value;
            onChange(newStateLocation);
          }
          return value;
        }
      }
    };
    // prevent double-wrapping proxies
    var unproxiedObj = getUnproxiedObject(obj);
    return new Proxy(unproxiedObj, handler);
  };
};

function trackObjectUse(obj) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$keepOriginalVal = _ref2.keepOriginalValues,
      keepOriginalValues = _ref2$keepOriginalVal === undefined ? true : _ref2$keepOriginalVal;

  var accessedProperties = {};
  var makeProxy = createMakeProxyFunction({ accessedProperties: accessedProperties, keepOriginalValues: keepOriginalValues });
  var trackedObject = makeProxy(obj);
  return { trackedObject: trackedObject, accessedProperties: accessedProperties };
}