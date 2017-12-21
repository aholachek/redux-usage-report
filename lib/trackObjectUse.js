'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = trackObjectUse;
var isFunction = function isFunction(x) {
  return typeof x === 'function';
};
var isObjectOrArray = function isObjectOrArray(x) {
  return x === Object(x) && !isFunction(x);
};

var createMakeProxyFunction = exports.createMakeProxyFunction = function createMakeProxyFunction(shouldSkipProxy) {
  return function (accessedProperties) {
    return function makeProxy(obj) {
      var stateLocation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      var handler = {
        get: function get(target, propKey) {
          var value = Reflect.get(target, propKey);
          if (isFunction(shouldSkipProxy) && shouldSkipProxy(target, propKey)) return value;

          var accessedPropertiesPointer = !stateLocation ? accessedProperties : stateLocation.split('.').reduce(function (acc, key) {
            return acc[key];
          }, accessedProperties);

          if (isObjectOrArray(value)) {
            if (accessedPropertiesPointer[propKey] === undefined) {
              accessedPropertiesPointer[propKey] = Array.isArray(value) ? [] : {};
            }
            var newStateLocation = stateLocation ? stateLocation + '.' + propKey : propKey;
            return makeProxy(value, newStateLocation);
          } else {
            // use original object values, don't update them if they change
            if (accessedPropertiesPointer[propKey] === undefined) {
              accessedPropertiesPointer[propKey] = value;
            }
            return value;
          }
        }
      };
      return new Proxy(obj, handler);
    };
  };
};

function trackObjectUse(obj) {
  var accessedProperties = {};
  var makeProxy = createMakeProxyFunction()(accessedProperties);
  var trackedObject = makeProxy(obj);
  return { trackedObject: trackedObject, accessedProperties: accessedProperties };
}