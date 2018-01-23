# Redux Usage Report

This library allows you to replace a generic object with a proxied object and track which parts of the object are accessed. It can help you which parts of the store are actually being used on various parts of a large Redux application.

It exports two functions: `generateReduxReport`, and the generic helper `trackObjectUse`.

**To install:** `yarn install redux-usage-report`

## 1. Redux Store Usage Tracker: `generateReduxReport`

### Basic Example:
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

### Debugging Example

When you use the `reduxReport.generate` function, you might want to see why certain parts of the store are marked `used`. It's possible that they are accessed simply as a side effect, for instance when doing a deep comparison of state in a `PureComponent`, which means weren't actually necessary to render the current state of the app.
In order to investigate further, in the console you can call you can provide a third argument to `generateReduxReport`: an array of redux paths that, when accessed, should trigger a debugger statement so that you can explore the call stack. The paths should be in the form:

```
"a.b.c.2.d"
```
With index arrays provided as numbers.

Here's an example from a real project:

```
export default generateReduxReport(
  window,
  rootReducer,
  ['entities.contentItemProgresses.byUuid.0e0b97415ab7bc4a061cf703dff8d93a.started']
);
```

You can then check out the functions in the call stack to see when this value is actually getting accessed in your application:

![screenshot of chrome devtools](./dev_tools_screenshot.png)

### Integration Test Stub Data

Finally, `reduxReport.generate` can also be used to create a minimal stub data object for Redux integration tests (by saving the `used` object) as demoed in [this test](./__tests__/generateReduxReportTest.js)

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

## Disclaimer

There are a bunch of edge cases that are not handled particularly well.

