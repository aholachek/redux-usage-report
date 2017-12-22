const isObjectOrArray = x => x === Object(x) && typeof x !== 'function'
const isUndefined = x => x === undefined

export const createMakeProxyFunction = ({
  keepOriginalValues = false,
  shouldSkipProxy,
  accessedProperties
}) => {
  return function makeProxy (obj, stateLocation = '') {
    const handler = {
      get (target, propKey) {
        const value = target[propKey]
        if (!isUndefined(shouldSkipProxy) && shouldSkipProxy(target, propKey)) return value

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
          // use original object values, don't update them if they change
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
