# Redux Usage Report

This library tracks the way your app is using the data in your Redux store.
It exports a store enhancer called `generateReduxReport`.

**To install:**

```js
yarn install redux-usage-report
```

## 1. Redux Store Usage Tracker: `generateReduxReport`

Example store creation with `generateReduxReport` and other store enhancers:
```js
import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import generateReduxReport from "redux-usage-report"
import rootReducer from "platform/state/reducers"
import initialState from "./initialState"

let enhancer

if (process.env.NODE_ENV === "development") {
  enhancer = compose(
    applyMiddleware(thunk),
    generateReduxReport(),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
} else {
  enhancer = applyMiddleware(thunk)
}

const store = createStore(rootReducer, initialState, enhancer)
```

Once you've set up the reporter, you open up your console when your app is running and type

```js
reduxReport.generate()
```

to view an object that looks like:

```js
{
  used : { a : 1, b : 2 },
  unused : { c : 3 }
}
```

You can peruse the `unused` object to see which parts of state might (possibly, not necessarily) be redundant for that part of the app.

### Setting Breakpoints

If you are curious when an item in the `used` object is being called by the app, you can set a breakpoint whenever that value is retrieved.
For instance, if your state looked like

```js
{
  a: {
    b: {
      c: ["foo", "bar"]
    }
  }
}
```

and you wanted to know when 'bar' was being accessed, you could write in the developer console:

```js
reduxReport.setBreakpoint("a.b.c.1")
```

Reload, and the app will pause execution whenever that value is accessed.
You can then check out the functions in the call stack to see what part of your app accesses the value:

![screenshot of chrome devtools](./dev_tools_screenshot.png)

You might find that, while it is being accessed, it is just incidentally, e.g. in a deep equality check.

You can clear the breakpoint with

```js
reduxReport.clearBreakpoint()
```

**Caveats:**

* Definitely don't use `redux-usage-report` in production!
* This *should* work along with Redux Dev Tools extension but there is some trickery involved to get them both working at the same time.

## 2. Simple Object Wrapper: `trackObjectUse`

### Basic Example:

```js
import { trackObjectUse } from "redux-usage-report"

const obj = {
  a: [1, 2, 3, 4],
  b: {
    e: [1, 2, 3, 4],
    c: { d: [1, 2, 3, 4] }
  }
}
const { trackedObject, accessedProperties } = trackObjectUse(obj)

const access1 = trackedObject.a[0]
const access2 = trackedObject.b.c.d[2]

console.log(accessedProperties)

// { a: [1], b: { c: { d: [undefined, undefined, 3] } } }
```

By default it keeps the `accessedProperties` object as close as possible to the original state of the `trackedObject`. If you'd like `accessedProperties` to update as `trackedObject` is updated you can pass in an option:

```js
const { trackedObject, accessedProperties } = trackObjectUse(obj, { keepOriginalValues: false })
```

### Simple Stub Data Example:

Record the minimum object required by the test:

```js
import fs from "fs"
import { trackObjectUse } from "redux-usage-report"
import hugeStubData from "./stubData.json"

describe("a complex item selector", () => {
  it("returns some item", () => {
    const { trackedObject, accessedProperties } = trackObjectUse(hugeStubData)
    const result = complexItemSelector(trackedObject, { itemId })

    fs.writeFile(`./minimalStubData.json`, JSON.stringify(accessedProperties), err => {
      if (err) throw err
    })
  })
})
```

Then remove the object tracking code from the test and use the new, smaller stub data file (`minimalStubData.json`) instead of the original stub data (`stubData.json`).
