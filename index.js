const deletedDiff = require('deep-object-diff').deletedDiff;
const fs = require('fs');

let globalObjectCache;

const generateReport = global => {
  globalObjectCache = globalObjectCache || global;
  global.reduxReport = global.reduxReport || {
    accessedState: {},
    state: {},
    get() {
      global.reduxReport.__inProgress = true;
      const report = {
        used: this.accessedState,
        unused: deletedDiff(this.state, this.accessedState)
      };
      global.reduxReport.__inProgress = false;
      return report;
    }
  };

  return rootReducer => (prevState, action) => {
    const reducerInProgress = false;

    function handler(stateLocation = '') {
      return {
        get(target, propKey) {
          if (
            !target.hasOwnProperty(propKey) ||
            global.reduxReport.__inProgress ||
            global.reduxReport.__reducerInProgress
          ) {
            return Reflect.get(target, propKey);
          }

          const accessedStatePointer = !stateLocation
            ? window.reduxReport.accessedState
            : stateLocation.split('.').reduce((acc, key) => {
              return acc[key];
            }, window.reduxReport.accessedState);

          const value = Reflect.get(target, propKey);

          if (value === Object(value) && !(typeof value === 'function')) {
            accessedStatePointer[propKey] = accessedStatePointer[propKey]
              ? accessedStatePointer[propKey]
              : Array.isArray(value) ? [] : {};
            const newStateLocation = stateLocation ? stateLocation + '.' + propKey : propKey;
            return makeProxy(value, newStateLocation);
          }
          // keep "state" using original values
          if (accessedStatePointer[propKey] === undefined) accessedStatePointer[propKey] = value;
          return value;
        }
      };
    }

    function makeProxy(obj, accessedStatePointer) {
      return new Proxy(obj, handler(accessedStatePointer));
    }
    global.reduxReport.__reducerInProgress = true;
    const state = rootReducer(prevState, action);
    global.reduxReport.__reducerInProgress = false;
    const proxiedState = makeProxy(state);
    global.reduxReport.state = proxiedState;
    return proxiedState;
  };
};

export default generateReport;

export const saveReport = () => {
  const report = globalObjectCache.reduxReport.get();
  if (!fs || !report) throw new Error('Could not save redux use report');

  ['used', 'unused'].forEach(descriptor => {
    fs.writeFile(`./redux_report--${descriptor}.json`, JSON.stringify(report[descriptor]), err => {
      if (err) throw err;
      console.log(`The ${descriptor} redux report has been saved!`);
    });
  });
};
