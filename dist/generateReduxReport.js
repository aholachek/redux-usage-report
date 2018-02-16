"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepObjectDiff = require("deep-object-diff");

var _stacktraceJs = require("stacktrace-js");

var _stacktraceJs2 = _interopRequireDefault(_stacktraceJs);

var _utility = require("./utility");

var _trackObjectUse = require("./trackObjectUse");

require("source-map-support/browser-source-map-support");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

sourceMapSupport.install(); // eslint-disable-line

// we need source maps for the stack traces
// or else we won't know whether to ignore object access
// from non-local code (e.g node_modules, browser extensions...)
var localStorageKey = "reduxUsageReportBreakpoints";

// so that JSON.stringify doesn't remove all undefined fields
function replaceUndefinedWithNull(obj) {
  Object.keys(obj).forEach(function (k) {
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

var shouldSkipProxy = function shouldSkipProxy(target, propKey) {
  // this is kind of hacky, but webpack dev server serves non-local files
  // that look like this: `webpack:///./~/react-redux/lib/components/connect.js `
  // whereas local files look like this: webpack:///./containers/TodoApp.js
  // also trying to avoid functions emanating from browser extensions

  var stackFrames = _stacktraceJs2.default.getSync();
  var initiatingFunc = stackFrames[stackFrames.findIndex(function (s) {
    return s.functionName === "Object.get";
  }) + 1];

  var initiatingFuncNotLocal = !!initiatingFunc && (initiatingFunc.fileName.match(/\.\/~\/|\/node_modules\//) || initiatingFunc.fileName.match(/extension:\/\//));

  if (!!initiatingFuncNotLocal || !target.hasOwnProperty(propKey) || global.reduxReport.__inProgress || global.reduxReport.__reducerInProgress) {
    return true;
  }
  return false;
};

function generateReduxReport(global, rootReducer) {
  globalObjectCache = globalObjectCache || global;
  global.reduxReport = global.reduxReport || {
    accessedState: {},
    state: {},
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
      var used = JSON.parse(JSON.stringify(this.accessedState));
      var stateCopy = JSON.parse(JSON.stringify(this.state));
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
    }
  });

  return function (prevState, action) {
    global.reduxReport.__reducerInProgress = true;
    var state = rootReducer(prevState, action);

    var usingReduxDevTools = state.computedStates && typeof state.currentStateIndex === "number";

    if (usingReduxDevTools) {
      state.computedStates[state.currentStateIndex].state = makeProxy(state.computedStates[state.currentStateIndex].state);
      global.reduxReport.__reducerInProgress = false;
      global.reduxReport.state = state.computedStates[state.currentStateIndex].state;
      return state;
    } else {
      var proxiedState = makeProxy(state);
      global.reduxReport.__reducerInProgress = false;
      global.reduxReport.state = proxiedState;
      return proxiedState;
    }
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
      return next.apply(undefined, [wrappedReducer].concat(args));
    };
  };
};

exports.default = storeEnhancer;