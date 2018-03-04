import { isObjectOrArray, isUndefined } from "./utility"

export const UNPROXIED_OBJ_KEY = "**__GET_INITIAL_PROXY_VAL__**"

const getUnproxiedObject = target =>
  target[UNPROXIED_OBJ_KEY] !== undefined ? target[UNPROXIED_OBJ_KEY] : target

export const getChildObject = (obj, stateLocation) => {
  if (!stateLocation) return obj
  return stateLocation.split(".").reduce((acc, key) => {
    return acc[key]
  }, obj)
}

export const createMakeProxyFunction = ({
  accessedProperties,
  keepOriginalValues = false,
  shouldSkipProxy = () => false,
  getBreakpoint = () => {},
  onChange = () => {}
}) => {
  return function makeProxy(obj, stateLocation = "") {
    const handler = {
      get(target, propKey) {
        if (propKey === UNPROXIED_OBJ_KEY) return target
        const value = target[propKey]

        if (!Object.hasOwnProperty.call(target, propKey)) return value

        if (shouldSkipProxy()) return value

        const newStateLocation = stateLocation ? stateLocation + "." + propKey : propKey

        // allow people to examine the stack at certain access points
        if (getBreakpoint() === newStateLocation) {
          // explore the callstack to see when your app accesses a value
          debugger
        }

        const accessedPropertiesPointer = getChildObject(accessedProperties, stateLocation)

        if (isObjectOrArray(value)) {
          if (isUndefined(accessedPropertiesPointer[propKey])) {
            accessedPropertiesPointer[propKey] = Array.isArray(value) ? [] : {}
            onChange(newStateLocation)
          }
          return makeProxy(value, newStateLocation)
        } else {
          if (
            isUndefined(accessedPropertiesPointer[propKey]) ||
            (!keepOriginalValues && value !== accessedPropertiesPointer[propKey])
          ) {
            accessedPropertiesPointer[propKey] = value
            onChange(newStateLocation)
          }
          return value
        }
      }
    }
    // prevent double-wrapping proxies
    const unproxiedObj = getUnproxiedObject(obj)
    return new Proxy(unproxiedObj, handler)
  }
}

export default function trackObjectUse(obj, { keepOriginalValues = true } = {}) {
  const accessedProperties = {}
  const makeProxy = createMakeProxyFunction({ accessedProperties, keepOriginalValues })
  const trackedObject = makeProxy(obj)
  return { trackedObject, accessedProperties }
}
