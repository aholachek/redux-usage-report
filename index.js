const isFunction = x => typeof x === 'function'
const isObjectOrArray = x => x === Object(x) && !isFunction(x)

export const createProxyHandler = shouldSkipProxy => accessedProperties => (stateLocation = '') => {
  return {
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
      }
      // use original object values
      if (accessedPropertiesPointer[propKey] === undefined) {
        accessedPropertiesPointer[propKey] = value
      }
      return value
    }
  }
}

export const createMakeProxyFunction = handler => (obj, accessedPropertiesPointer) => {
  return new Proxy(obj, handler(accessedPropertiesPointer))
}

export default function trackObjectUse (obj) {
  const accessedProperties = {}
  const handler = createProxyHandler()(accessedProperties)
  const makeProxy = createMakeProxyFunction(handler)

  const trackedObject = makeProxy(obj)
  return { trackedObject, accessedProperties }
}
