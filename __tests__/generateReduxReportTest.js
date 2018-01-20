import { createStore } from 'redux'
import { generateReduxReport } from '../src/index'
import saveReport from '../src/saveReport'

// a tiny Redux store for testing

const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return Object.assign({}, state, action.payload)
    default:
      return state
  }
}

const wrappedReducer = generateReduxReport(window, rootReducer, ['a.b.c.2'])

const getStore = (initialState) => createStore(wrappedReducer, JSON.parse(JSON.stringify(initialState)))

describe('generateReduxReport', () => {
  const mockStore = {
    a: {
      b: {
        c: [1, 2, 3, 4]
      },
      d: {
        e: [1, 2, 3, 4, 5]
      }
    },
    f: [5, 4, 3, 2, 1],
    g: [{ h: 1 }, { i: 2 }, { j: 3 }],
    k: {},
    l: 1,
    m: 2,
    o: 3
  }

  it('should track accessed properties', () => {
    const store = getStore(mockStore)

    // access some properties
    const val1 = store.getState().a.b.c[2]
    const val2 = store.getState().f.slice(0, 1)
    const val3 = store.getState().a.d
    const val4 = store.getState().g[2].j

    const expectedUsed = {
      'a': {
        'b': {
          'c': [
            null,
            null,
            3
          ]
        },
        'd': {}
      },
      'f': [
        5,
        null,
        null,
        null,
        null
      ],
      'g': [
        null,
        null,
        {
          'j': 3
        }
      ]
    }

    const expectedUnused = {
      'k': null,
      'l': null,
      'm': null,
      'o': null,
      'a': {
        'b': {
          'c': {
            '0': null,
            '1': null,
            '3': null
          }
        },
        'd': {
          'e': null
        }
      },
      'f': {
        '1': null,
        '2': null,
        '3': null,
        '4': null
      },
      'g': {
        '0': null,
        '1': null
      }
    }
    expect(global.reduxReport.generate().used).toEqual(expectedUsed)
    expect(global.reduxReport.generate().unused).toEqual(expectedUnused)
  })
  it('should be able to save the report to a file', () => {
    saveReport(global)
    // I guess just check that saved to a file (?)
  })
})
