import { createMakeProxyFunction, getChildObject, UNPROXIED_OBJ_KEY } from "../src/trackObjectUse"
import { isObjectOrArray } from "../src/utility"
describe("getChildObject", () => {
  const testObj = {
    a: 1,
    b: {
      c: {
        d: [
          1,
          2,
          {
            e: { f: "g" }
          }
        ]
      }
    }
  }

  it("returns the part of the object indicated by the provided string of keys", () => {
    expect(getChildObject(testObj, "b.c.d.2.e")).toEqual({ f: "g" })
  })
  it("returns the object if the key list is empty", () => {
    expect(getChildObject(testObj, "")).toEqual(testObj)
  })
})

describe("createMakeProxyFunction", () => {
  const isProxy = obj => isObjectOrArray(obj[UNPROXIED_OBJ_KEY])
  const isDoubleProxied = obj =>
    isObjectOrArray(obj[UNPROXIED_OBJ_KEY]) &&
    isObjectOrArray(obj[UNPROXIED_OBJ_KEY][UNPROXIED_OBJ_KEY])

  it("returns a function that creates a proxy to track object use", () => {
    const accessedProperties = {}
    const makeProxy = createMakeProxyFunction({ accessedProperties })
    const object = { a: { b: "c" }, d: [1, 2, 3, 4, 5] }
    const proxy = makeProxy(object)

    const test1 = proxy.a.b
    const test2 = proxy.d[2]
    expect(accessedProperties).toEqual({
      a: { b: "c" },
      d: [undefined, undefined, 3]
    })
  })

  it("will create proxies of child objects when they are accessed", () => {
    const accessedProperties = {}
    const makeProxy = createMakeProxyFunction({ accessedProperties })
    const object = { a: { b: "c" }, d: [1, 2, 3, 4, 5] }
    const proxy = makeProxy(object)

    const test1 = proxy.a.b

    expect(isProxy(proxy.a)).toBe(true)
    // the original child is preserved as a non-proxy
    expect(isProxy(object.a)).toBe(false)
  })

  it("does not try to proxy non-object or non-array values", () => {
    const accessedProperties = {}
    const makeProxy = createMakeProxyFunction({ accessedProperties })
    const object = { a: { b: "c" }, d: [1, 2, 3, 4, 5] }
    const proxy = makeProxy(object)

    const test1 = proxy.a.b

    expect(isProxy(proxy.a.b)).toBe(false)
  })

  it("updates values in accessed properties if they change and are accessed again", () => {
    const accessedProperties = {}
    const makeProxy = createMakeProxyFunction({ accessedProperties })
    const object = { a: { b: "c" }, d: [1, 2, 3, 4, 5] }
    const proxy = makeProxy(object)

    const test1 = proxy.a.b
    expect(accessedProperties).toEqual({
      a: { b: "c" }
    })

    object.a.b = "e"
    const test2 = proxy.a.b
    expect(accessedProperties).toEqual({
      a: { b: "e" }
    })
  })

  it("will not augment the accessedProperties object if shouldSkipProxy argument returns true", () => {
    const accessedProperties = {}
    const makeProxy = createMakeProxyFunction({
      accessedProperties,
      shouldSkipProxy: () => true
    })
    const object = { a: { b: "c" }, d: [1, 2, 3, 4, 5] }
    const proxy = makeProxy(object)

    const test1 = proxy.a.b
    expect(accessedProperties).toEqual({})
  })

  it("just returns the value if the key is not on the objects prototype", () => {
    const accessedProperties = {}
    const makeProxy = createMakeProxyFunction({ accessedProperties })
    const object = { a: { b: "c" }, d: [1, 2, 3, 4, 5] }
    const proxy = makeProxy(object)

    const isPrototypeOf = proxy.isPrototypeOf
    expect(accessedProperties).toEqual({})
  })

  it("has a hidden key for accessing the unproxied object from the proxy", () => {
    const accessedProperties = {}
    const makeProxy = createMakeProxyFunction({ accessedProperties })
    const object = { a: { b: "c" }, d: [1, 2, 3, 4, 5] }
    const proxy = makeProxy(object)

    expect(isProxy(proxy)).toBe(true)
    expect(isProxy(proxy[UNPROXIED_OBJ_KEY])).toBe(false)
    expect(object).toEqual(proxy[UNPROXIED_OBJ_KEY])
  })

  it("makes sure never to proxy an already-proxied object", () => {
    const accessedProperties = {}
    const makeProxy = createMakeProxyFunction({ accessedProperties })
    const object = { a: { b: "c" }, d: [1, 2, 3, 4, 5] }
    const doubleProxy = makeProxy(makeProxy(object))

    expect(isProxy(doubleProxy)).toBe(true)
    expect(isDoubleProxied(doubleProxy)).toBe(false)
  })
})
