"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _deepObjectDiff = require("deep-object-diff");

var _stacktraceJs = require("stacktrace-js");

var _stacktraceJs2 = _interopRequireDefault(_stacktraceJs);

var _utility = require("./utility");

var _trackObjectUse = require("./trackObjectUse");

var _lodash = require("lodash.debounce");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// we need source maps for the stack traces
// or else we won't know whether to ignore object access
// from non-local code (e.g node_modules, browser extensions...)
// this takes the stack trace file name from e.g.  
// fileName: "http://localhost:3001/static/js/bundle.js",
// to "http://localhost:3000/Users/alexholachek/Desktop/work/redux-usage-report/todomvc-example/src/containers/App.js
// this raises an error during jest tests so limit to development
if (process.env.NODE_ENV === "development") {
  require("./lib/browser-source-map-support");
  sourceMapSupport.install(); // eslint-disable-line
}

var localStorageKey = "reduxUsageReportBreakpoints";

// so that JSON.stringify doesn't remove all undefined fields
function replaceUndefinedWithNull(obj) {
  (0, _keys2.default)(obj).forEach(function (k) {
    var val = obj[k];
    if (val === undefined) {
      obj[k] = null;
    }
    if ((0, _utility.isObjectOrArray)(val)) {
      replaceUndefinedWithNull(val);
    }
  });
}

var globalObjectCache = void 0;

var shouldSkipProxy = function shouldSkipProxy() {
  if (global.reduxReport.__inProgress || global.reduxReport.__reducerInProgress) return true;

  if (!global.reduxReport.__skipAccessOriginCheck) {
    var stackFrames = _stacktraceJs2.default.getSync();
    var initiatingFunc = stackFrames[stackFrames.findIndex(function (s) {
      return s.functionName === "Object.get";
    }) + 1];

    var initiatingFuncNotLocal = !!initiatingFunc && initiatingFunc.fileName && (initiatingFunc.fileName.match(/\.\/~\/|\/node_modules\//) || initiatingFunc.fileName.match(/extension:\/\//));

    if (!!initiatingFuncNotLocal) return true;
  }
  return false;
};

// this function takes a reducer and returns 
// an augmented reducer that tracks redux usage
function generateReduxReport(global, rootReducer) {
  globalObjectCache = globalObjectCache || global;
  global.reduxReport = global.reduxReport || {
    accessedState: {},
    state: {},
    setOnChangeCallback: function setOnChangeCallback(cb) {
      global.reduxReport.onChangeCallback = (0, _lodash2.default)(cb, 10);
    },
    removeOnChangeCallback: function removeOnChangeCallback() {
      global.reduxReport.onChangeCallback = undefined;
    },

    setBreakpoint: function setBreakpoint(breakpoint) {
      if (!global.localStorage) return;
      global.localStorage.setItem(localStorageKey, breakpoint);
    },
    clearBreakpoint: function clearBreakpoint() {
      if (!global.localStorage) return;
      global.localStorage.setItem(localStorageKey, null);
    },
    generate: function generate() {
      global.reduxReport.__inProgress = true;
      var used = JSON.parse((0, _stringify2.default)(this.accessedState));
      var stateCopy = JSON.parse((0, _stringify2.default)(this.state));
      var unused = (0, _deepObjectDiff.diff)(stateCopy, used);
      replaceUndefinedWithNull(unused);
      var report = {
        used: used,
        unused: unused,
        stateCopy: stateCopy
      };
      global.reduxReport.__inProgress = false;
      return report;
    }
  };

  var makeProxy = (0, _trackObjectUse.createMakeProxyFunction)({
    shouldSkipProxy: shouldSkipProxy,
    accessedProperties: global.reduxReport.accessedState,
    getBreakpoint: function getBreakpoint() {
      return global.localStorage && global.localStorage.getItem(localStorageKey);
    },
    onChange: function onChange(stateLocation) {
      return global.reduxReport.onChangeCallback && global.reduxReport.onChangeCallback(stateLocation);
    }
  });

  // this function replaces the previous root reducer
  // it will break if the DevTools.instrument() call came before generateReduxReport
  // in the compose order
  return function (prevState, action) {
    global.reduxReport.__reducerInProgress = true;
    var state = rootReducer(prevState, action);
    var proxiedState = makeProxy(state);
    global.reduxReport.__reducerInProgress = false;

    global.reduxReport.state = proxiedState;
    if (global.reduxReport.onChangeCallback) setTimeout(function () {
      return global.reduxReport.onChangeCallback("");
    }, 1);
    return proxiedState;
  };
}

// "next" is either createStore or a wrapped version from another enhancer
var storeEnhancer = function storeEnhancer() {
  var global = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  return function (next) {
    return function (reducer) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var wrappedReducer = generateReduxReport(global, reducer);
      var store = next.apply(undefined, [wrappedReducer].concat(args));
      return (0, _extends3.default)({}, store, { replaceReducer: function replaceReducer(nextReducer) {
          return generateReduxReport(global, nextReducer);
        } });
    };
  };
};

exports.default = storeEnhancer;