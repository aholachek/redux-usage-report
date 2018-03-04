describe("basic proxy behavior", () => {
  it("if a proxied object is proxied again, both proxies will be active, rather than the second proxy simply overriding the first", () => {
    const handler1 = {
      get(target, propKey) {
        return "proxied get"
      }
    }

    const handler2 = {
      get(target, propKey) {
        return `${target[propKey]} is wrapped with an outer proxy`
      }
    }
    const proxy = new Proxy({ test: 1 }, handler1)
    const wrappedProxy = new Proxy(proxy, handler2)
    expect(proxy.test).toBe("proxied get")
    expect(wrappedProxy.test).toBe("proxied get is wrapped with an outer proxy")
  })

  it("there can be a special hidden key that just returns the unproxied target to avoid this proxy nesting", () => {
    const handler1 = {
      get(target, propKey) {
        if (propKey === "__initialVal") return target
        if (target.__initialVal !== undefined) return target.__initialVal[propKey]
        return "proxied get"
      }
    }

    const handler2 = {
      get(target, propKey) {
        const value =
          target.__initialVal !== undefined ? target.__initialVal[propKey] : target[propKey]
        return `${value} is wrapped with an outer proxy`
      }
    }
    const proxy = new Proxy({ test: 1 }, handler1)
    const wrappedProxy = new Proxy(proxy, handler2)
    expect(proxy.test).toBe("proxied get")
    expect(proxy.__initialVal.test).toBe(1)
    expect(wrappedProxy.test).toBe("1 is wrapped with an outer proxy")
  })

  it("JSON.parse(JSON.stringify(obj)) will return a non-proxied object from a proxied object, after calling the proxy's get methods", () => {
    const handler1 = {
      get: jest.fn(function(target, propKey) {
        return "proxied get"
      })
    }

    const proxy = new Proxy({ test: 1 }, handler1)
    const copied = JSON.parse(JSON.stringify(proxy))
    expect(handler1.get.mock.calls.length).toBe(2)
    expect(copied.test).toBe("proxied get")
    expect(handler1.get.mock.calls.length).toBe(2)
  })
})
