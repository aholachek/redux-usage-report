import { isObjectOrArray, isUndefined } from './utility'

export const createMakeProxyFunction = ({
  keepOriginalValues = false,
  shouldSkipProxy,
  accessedProperties,
  debuggerPoints = []
}) => {
  return function makeProxy (obj, stateLocation = '') {
    const handler = {
      get (target, propKey) {
        const value = target[propKey]
        if (!isUndefined(shouldSkipProxy) && shouldSkipProxy(target, propKey)) return value
        if (debuggerPoints.find(p => p === stateLocation)) {
          debugger
        }

        const accessedPropertiesPointer = !stateLocation
          ? accessedProperties
          : stateLocation.split('.').reduce((acc, key) => {
            return acc[key]
          }, accessedProperties)

        if (isObjectOrArray(value)) {
          if (!accessedPropertiesPointer[propKey]) {
            accessedPropertiesPointer[propKey] = Array.isArray(value) ? [] : {}
          }
          var newStateLocation = stateLocation ? stateLocation + '.' + propKey : propKey
          return makeProxy(value, newStateLocation)
        } else {
          if (isUndefined(accessedPropertiesPointer[propKey]) || !keepOriginalValues) {
            accessedPropertiesPointer[propKey] = value
          }
          return value
        }
      }
    }
    return new Proxy(obj, handler)
  }
}

export default function trackObjectUse (obj, { keepOriginalValues = true } = {}) {
  const accessedProperties = {}
  const makeProxy = createMakeProxyFunction({ accessedProperties, keepOriginalValues })
  const trackedObject = makeProxy(obj)
  return { trackedObject, accessedProperties }
}
