# Redux Usage Report

This library allows you to replace a generic object with a proxied object and track which parts of the object are accessed. It can help you which parts of the store are actually being used on various parts of a large Redux application.

It exports two functions: `generateReduxReport`, and the generic helper `trackObjectUse`.

**To install:** `yarn install redux-usage-report`

## 1. Redux Store Usage Tracker: `generateReduxReport`

```
import { generateReduxReport } from 'redux-usage-report';
import { combineReducers } from 'redux';
... rest of imports

const rootReducer = combineReducers({
  // ... reducers go here
});

if (process.env.NODE_ENV === 'development') {
  // provide reference to the global object as the first argument
  export default generateReduxReport(window, rootReducer);
} else {
  export default rootReducer
}

```
Once your rootReducer is wrapped, you open up your console when the app is running and type
`reduxReport.generate()` to view an object that looks like:

```
{
  used : { a : 1, b : 2 },
  unused : { c : 3 }
}
```
You can peruse the `unused` object to see which parts of state might (possibly, not necessarily) be redundant for that part of the app.

### Setting Breakpoints

If you are curious when an item in the `used` object is being called by the app, you can set a breakpoint whenever that value is triggered.
For instance, if your state looked like

```
{
  a : {
    b : {
      c : 'foo'
    }
  }
}
```
and you wanted to know when 'foo' was being accessed, you could do

```
reduxReport.setBreakpoint('a.b.c')
```
Reload the page, and the app will pause execution whenever that value is accessed.
You can then check out the functions in the call stack to see when this value is actually getting accessed in your application:

![screenshot of chrome devtools](./dev_tools_screenshot.png)

Finally, you can clear the breakpoint with `reduxReport.clearBreakpoint()`

Definitely don't use this library in production!

## 2. Simple Object Wrapper: `trackObjectUse`

### Basic Example:
```
import { trackObjectUse } from 'redux-usage-report'

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

```
const { trackedObject, accessedProperties } = trackObjectUse(obj, { keepOriginalValues : false})
```

### Simple Stub Data Example:

Record the minimum object required by the test:
```
import fs from 'fs'
import { trackObjectUse } from 'redux-usage-report'
import hugeStubData from './stubData.json'

describe('a complex item selector', () => {
  it('returns some item', () => {
    const { trackedObject, accessedProperties } = trackObjectUse(hugeStubData)
    const result = complexItemSelector(trackedObject, { itemId })

    fs.writeFile(`./minimalStubData.json`, JSON.stringify(accessedProperties), err => {
      if (err) throw err
    })
  })
})
```

Then remove the object tracking code from the test and use the new, smaller stub data file (`minimalStubData.json`) instead of the original stub data (`stubData.json`).

