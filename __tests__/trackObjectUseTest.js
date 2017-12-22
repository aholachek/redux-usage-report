import trackObjectUse from '../src/trackObjectUse'

describe('trackObjectUse', () => {
  const obj = {
    a: [1, 2, 3, 4],
    b: {
      c: { d: [1, 2, 3, 4] }
    },
    e: [1, 2, 3, 4]
  }
  it('returns an object with only the parts of the original object that have been accessed', () => {
    const toTrack = JSON.parse(JSON.stringify(obj))
    const { trackedObject, accessedProperties } = trackObjectUse(toTrack)

    const test1 = trackedObject.a[2]
    const test2 = trackedObject.b.c.d[0]
    const test3 = trackedObject.b.c
    const test4 = trackedObject.b.c.d[3]

    const expected = { a: [undefined, undefined, 3], b: { c: { d: [1, undefined, undefined, 4] } } }

    expect(accessedProperties).toEqual(expected)
  })

  it('ignores sets, and only tracks gets', () => {
    const toTrack = JSON.parse(JSON.stringify(obj))
    const { trackedObject, accessedProperties } = trackObjectUse(toTrack)

    trackedObject.a = 'test'
    const test2 = trackedObject.b.c.d[0]
    const test3 = trackedObject.b.c
    const test4 = trackedObject.b.c.d[3]

    expect(accessedProperties).toEqual({ b: { c: { d: [1, undefined, undefined, 4] } } })
  })
})
