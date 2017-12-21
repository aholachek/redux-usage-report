'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _trackObjectUse = require('./trackObjectUse');

var _deepObjectDiff = require('deep-object-diff');

var globalObjectCache = void 0;

var shouldSkipProxy = function shouldSkipProxy(target, propKey) {
  if (!target.hasOwnProperty(propKey) || global.reduxReport.__inProgress || global.reduxReport.__reducerInProgress) {
    return true;
  }
  return false;
};

function generateReduxReport(global) {
  var makeProxy = (0, _trackObjectUse.createMakeProxyFunction)(shouldSkipProxy)(global.reduxReport.accessedState);

  globalObjectCache = globalObjectCache || global;
  global.reduxReport = global.reduxReport || {
    accessedState: {},
    state: {},
    generate: function generate() {
      global.reduxReport.__inProgress = true;
      var report = {
        used: this.accessedState,
        unused: (0, _deepObjectDiff.deletedDiff)(this.state, this.accessedState)
      };
      global.reduxReport.__inProgress = false;
      return report;
    }
  };

  return function (rootReducer) {
    return function (prevState, action) {
      global.reduxReport.__reducerInProgress = true;
      var state = rootReducer(prevState, action);
      global.reduxReport.__reducerInProgress = false;
      var proxiedState = makeProxy(state);
      global.reduxReport.state = proxiedState;
      return proxiedState;
    };
  };
}

exports.default = generateReduxReport;