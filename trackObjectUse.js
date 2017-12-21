const isFunction = x => typeof x === 'function'
const isObjectOrArray = x => x === Object(x) && !isFunction(x)

export const createMakeProxyFunction = shouldSkipProxy => accessedProperties => {
  return function makeProxy (obj, stateLocation = '') {
    const handler = {
      get (target, propKey) {
        const value = Reflect.get(target, propKey)
        if (isFunction(shouldSkipProxy) && shouldSkipProxy(target, propKey)) return value

        const accessedPropertiesPointer = !stateLocation
          ? accessedProperties
          : stateLocation.split('.').reduce((acc, key) => {
            return acc[key]
          }, accessedProperties)

        if (isObjectOrArray(value)) {
          if (accessedPropertiesPointer[propKey] === undefined) {
            accessedPropertiesPointer[propKey] = Array.isArray(value) ? [] : {}
          }
          const newStateLocation = stateLocation ? stateLocation + '.' + propKey : propKey
          return makeProxy(value, newStateLocation)
        } else {
          // use original object values, don't update them if they change
          if (accessedPropertiesPointer[propKey] === undefined) {
            accessedPropertiesPointer[propKey] = value
          }
          return value
        }
      }
    }
    return new Proxy(obj, handler)
  }
}

export default function trackObjectUse (obj) {
  const accessedProperties = {}
  const makeProxy = createMakeProxyFunction()(accessedProperties)
  const trackedObject = makeProxy(obj)
  return { trackedObject, accessedProperties }
}
