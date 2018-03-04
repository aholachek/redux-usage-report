import { isObjectOrArray, isUndefined } from "./utility"

const UNPROXIED_OBJ_KEY = "__initialValue"

const getUnproxiedObject = target =>
  target[UNPROXIED_OBJ_KEY] !== undefined ? target[UNPROXIED_OBJ_KEY] : target

export const createMakeProxyFunction = ({
  keepOriginalValues = false,
  accessedProperties,
  shouldSkipProxy = () => false,
  getBreakpoint = () => {},
  onChange = () => {}
}) => {
  return function makeProxy(obj, stateLocation = "") {
    const handler = {
      get(target, propKey) {
        // need to be able to actually get the value without triggering another get cycle
        if (propKey === UNPROXIED_OBJ_KEY) return target
        const value = target[propKey]

        if (!Object.hasOwnProperty.call(target, propKey)) return value

        if (shouldSkipProxy()) return JSON.parse(JSON.stringify(value))

        const accessedPropertiesPointer = !stateLocation
          ? accessedProperties
          : stateLocation.split(".").reduce((acc, key) => {
              return acc[key]
            }, accessedProperties)

        const newStateLocation = stateLocation ? stateLocation + "." + propKey : propKey

        // allow people to examine the stack at certain access points
        if (getBreakpoint() === newStateLocation) {
          // explore the callstack to see when your app accesses a value
          debugger
        }
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
