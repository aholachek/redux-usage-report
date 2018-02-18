import { diff } from "deep-object-diff"
import StackTrace from "stacktrace-js"
import { isObjectOrArray } from "./utility"
import { createMakeProxyFunction } from "./trackObjectUse"
import cloneDeep from "lodash.clone"
import throttle from "lodash.throttle"
import "source-map-support/browser-source-map-support"

// we need source maps for the stack traces
// or else we won't know whether to ignore object access
// from non-local code (e.g node_modules, browser extensions...)
// this takes the stack trace file name from e.g.  fileName: "http://localhost:3001/static/js/bundle.js",
// to "http://localhost:3000/Users/alexholachek/Desktop/work/redux-usage-report/todomvc-example/src/containers/App.js
// this raises an error during jest tests so limit to development
//
if (process.env.NODE_ENV === "development") {
  sourceMapSupport.install({
    environment: 'node',
  }) // eslint-disable-line

}

const localStorageKey = "reduxUsageReportBreakpoints"

// so that JSON.stringify doesn't remove all undefined fields
function replaceUndefinedWithNull(obj) {
  Object.keys(obj).forEach(k => {
    const val = obj[k]
    if (val === undefined) {
      obj[k] = null
    }
    if (isObjectOrArray(val)) {
      replaceUndefinedWithNull(val)
    }
  })
}

let globalObjectCache

const shouldSkipProxy = (target, propKey) => {
  // this is kind of hacky, but webpack dev server serves non-local files
  // that look like this: `webpack:///./~/react-redux/lib/components/connect.js `
  // whereas local files look like this: webpack:///./containers/TodoApp.js
  // also trying to avoid functions emanating from browser extensions

  const stackFrames = StackTrace.getSync()
  const initiatingFunc =
    stackFrames[stackFrames.findIndex(s => s.functionName === "Object.get") + 1]

  const initiatingFuncNotLocal =
    !!initiatingFunc &&
    (initiatingFunc.fileName.match(/\.\/~\/|\/node_modules\//) ||
      initiatingFunc.fileName.match(/extension:\/\//))

  if (
    !!initiatingFuncNotLocal ||
    !target.hasOwnProperty(propKey) ||
    global.reduxReport.__inProgress ||
    global.reduxReport.__reducerInProgress
  ) {
    return true
  }
  return false
}

function generateReduxReport(global, rootReducer) {
  globalObjectCache = globalObjectCache || global
  global.reduxReport = global.reduxReport || {
    accessedState: {},
    state: {},
    setOnChangeCallback(cb) {
      global.reduxReport.onChangeCallback = throttle(cb, 1000)
    },
    removeOnChangeCallback() {
      global.reduxReport.onChangeCallback = undefined
    },
    setBreakpoint: function(breakpoint) {
      if (!global.localStorage) return
      global.localStorage.setItem(localStorageKey, breakpoint)
    },
    clearBreakpoint: function() {
      if (!global.localStorage) return
      global.localStorage.setItem(localStorageKey, null)
    },
    generate() {
      global.reduxReport.__inProgress = true
      const used = cloneDeep(this.accessedState)
      const stateCopy = cloneDeep(this.state)
      const unused = diff(stateCopy, used)
      replaceUndefinedWithNull(unused)
      const report = {
        used,
        unused,
        stateCopy
      }
      global.reduxReport.__inProgress = false
      return report
    }
  }

  const makeProxy = createMakeProxyFunction({
    shouldSkipProxy,
    accessedProperties: global.reduxReport.accessedState,
    getBreakpoint: () => global.localStorage && global.localStorage.getItem(localStorageKey),
    onChange: (...args) => global.reduxReport.onChangeCallback && global.reduxReport.onChangeCallback(...args)
  })

  return (prevState, action) => {
    global.reduxReport.__reducerInProgress = true
    const state = rootReducer(prevState, action)

    const usingReduxDevTools = state.computedStates && typeof state.currentStateIndex === "number"

    if (usingReduxDevTools) {
      state.computedStates[state.currentStateIndex].state = makeProxy(
        state.computedStates[state.currentStateIndex].state
      )
      global.reduxReport.__reducerInProgress = false
      global.reduxReport.state = state.computedStates[state.currentStateIndex].state
      return state
    } else {
      const proxiedState = makeProxy(state)
      global.reduxReport.__reducerInProgress = false
      global.reduxReport.state = proxiedState
      return proxiedState
    }
  }
}

// "next" is either createStore or a wrapped version from another enhancer
const storeEnhancer = (global = window) => next => (reducer, ...args) => {
  const wrappedReducer = generateReduxReport(global, reducer)
  return next(wrappedReducer, ...args)
}

export default storeEnhancer
