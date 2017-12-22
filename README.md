## Redux Usage Report

This library allows you to replace a generic object with a proxied object and track which part of the object is accessed. I made it to help me track which parts of the store were actually being used on various parts of a large Redux application, but it could also have other applications, such as quickly creating a minimal stub data object for tests.

It exports two functions: the generic helper `trackObjectUse`, and `generateReduxReport`.

They make use of ES2015 proxy functionality to record when an object property is accessed.

### 1. Simple Object Wrapper: `trackObjectUse`

#### Example:
```
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

By default it keeps the accessedProperties object as close as possible to the original state of the tracked object. If you'd like the accessedProperties to update as the tracked object is updated you can pass in an option:

```
const { trackedObject, accessedProperties } = trackObjectUse(obj, { keepOriginalValues : false})
```
### 2. Redux Store Usage Tracker: `generateReduxReport`

#### Example:
```
import { generateReduxReport } from 'redux-usage-report';
import { combineReducers } from 'redux';
// ...import reducers here

const rootReducer = combineReducers({
  // ... reducers go here
});

// don't add redux logging in production mode
if (process.env.NODE_ENV === 'development') {
  // provide reference to the global object
  const reportGenerator = generateReduxReport(window)
  export default reportGenerator(rootReducer);
} else {
  export default rootReducer
}

```
Once your rootReducer is wrapped, you open up your console when the app is running and type
`reduxReport.generate()` to view an object that looks like:

```
{
  used : { a : 1, b : 2},
  unused : {c : 3}
}
```
You can peruse the `unused` object to see which parts of state might (possibly, not necessarily) be redundant for that part of the app.

### Disclaimer
This was built for a fairly narrow use case and doesn't handle a multitude of edge cases!