import { createMakeProxyFunction } from './trackObjectUse'
import { deletedDiff } from 'deep-object-diff'

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

function generateReduxReport (global) {
  globalObjectCache = globalObjectCache || global
  global.reduxReport = global.reduxReport || {
    accessedState: {},
    state: {},
    generate () {
      global.reduxReport.__inProgress = true
      const report = {
        used: this.accessedState,
        unused: deletedDiff(this.state, this.accessedState)
      }
      global.reduxReport.__inProgress = false
      return report
    }
  }
  const makeProxy = createMakeProxyFunction(shouldSkipProxy)(global.reduxReport.accessedState)

  return rootReducer => (prevState, action) => {
    global.reduxReport.__reducerInProgress = true
    const state = rootReducer(prevState, action)
    global.reduxReport.__reducerInProgress = false
    const proxiedState = makeProxy(state)
    global.reduxReport.state = proxiedState
    return proxiedState
  }
}

export default generateReduxReport
