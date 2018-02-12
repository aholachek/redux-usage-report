import { diff } from 'deep-object-diff'
import StackTrace from 'stacktrace-js'
import { isObjectOrArray } from './utility'
import { createMakeProxyFunction } from './trackObjectUse'

const localStorageKey = 'reduxUsageReportBreakpoints'

// so that JSON.stringify doesn't remove all undefined fields
function replaceUndefinedWithNull (obj) {
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
  const initiatingFunc = StackTrace.getSync().filter(
    s => s.fileName && !s.fileName.match('redux-usage-report')
  )[0]

  // this is kind of hacky, but webpack dev server serves non-local files
  // that look like this: `webpack:///./~/react-redux/lib/components/connect.js `
  // whereas local files look like this: webpack:///./containers/TodoApp.js
  // also trying to avoid functions emanating from browser extensions
  var initiatingFuncNotLocal =
    initiatingFunc &&
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

function generateReduxReport (global, rootReducer) {
  globalObjectCache = globalObjectCache || global
  global.reduxReport = global.reduxReport || {
    accessedState: {},
    state: {},
    setBreakpoint: function (breakpoint) {
      if (!global.localStorage) return
      global.localStorage.setItem(localStorageKey, breakpoint)
    },
    clearBreakpoint: function () {
      if (!global.localStorage) return
      global.localStorage.setItem(localStorageKey, null)
    },
    generate () {
      global.reduxReport.__inProgress = true
      const used = JSON.parse(JSON.stringify(this.accessedState))
      const stateCopy = JSON.parse(JSON.stringify(this.state))
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
    breakpoint: (global.localStorage && global.localStorage.getItem(localStorageKey)) || []
  })

  return (prevState, action) => {
    global.reduxReport.__reducerInProgress = true
    const state = rootReducer(prevState, action)

    const usingReduxDevTools = state.computedStates && typeof state.currentStateIndex === 'number'

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
