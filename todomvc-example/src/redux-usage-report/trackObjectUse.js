"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMakeProxyFunction = undefined;
exports.default = trackObjectUse;

var _utility = require("./utility");

var createMakeProxyFunction = exports.createMakeProxyFunction = function createMakeProxyFunction(_ref) {
  var _ref$keepOriginalValu = _ref.keepOriginalValues,
      keepOriginalValues = _ref$keepOriginalValu === undefined ? false : _ref$keepOriginalValu,
      shouldSkipProxy = _ref.shouldSkipProxy,
      accessedProperties = _ref.accessedProperties,
      _ref$getBreakpoint = _ref.getBreakpoint,
      getBreakpoint = _ref$getBreakpoint === undefined ? function () {} : _ref$getBreakpoint,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === undefined ? function () {} : _ref$onChange;

  return function makeProxy(obj) {
    var stateLocation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    var handler = {
      get: function get(target, propKey) {
        var value = target[propKey];
        if (!(0, _utility.isUndefined)(shouldSkipProxy) && shouldSkipProxy(target, propKey)) return value;

        var accessedPropertiesPointer = !stateLocation ? accessedProperties : stateLocation.split(".").reduce(function (acc, key) {
          return acc[key];
        }, accessedProperties);

        var newStateLocation = stateLocation ? stateLocation + "." + propKey : propKey;
        onChange(newStateLocation);

        // allow people to examine the stack at certain access points
        if (getBreakpoint() === newStateLocation) {
          // explore the callstack to see when your app accesses a value
          debugger;
        }
        if ((0, _utility.isObjectOrArray)(value)) {
          if (!accessedPropertiesPointer[propKey]) {
            accessedPropertiesPointer[propKey] = Array.isArray(value) ? [] : {};
          }
          return makeProxy(value, newStateLocation);
        } else {
          if ((0, _utility.isUndefined)(accessedPropertiesPointer[propKey]) || !keepOriginalValues) {
            accessedPropertiesPointer[propKey] = value;
          }
          return value;
        }
      }
    };
    return new Proxy(obj, handler);
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