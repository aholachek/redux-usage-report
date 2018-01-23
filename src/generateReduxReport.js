import { diff } from 'deep-object-diff'
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
  if (
    !target.hasOwnProperty(propKey) ||
    global.reduxReport.__inProgress ||
    global.reduxReport.__reducerInProgress
  ) {
    return true
  }
  return false
}

function generateReduxReport (global, rootReducer, debuggerPoints = []) {
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
        unused
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
    global.reduxReport.__reducerInProgress = false
    const proxiedState = makeProxy(state)
    global.reduxReport.state = proxiedState
    return proxiedState
  }
}

export default generateReduxReport
