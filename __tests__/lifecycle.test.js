var MEASURES = require('../samples/measures')

var { getLifecycleTime, getTotalMethods } = require('../src/shared/lifecycle')
var { getTotalTime } = require('../src/shared/totalTime')

describe('Calling Lifecycle Methods', () => {
  test('Sanity', () => {
    expect(getLifecycleTime(MEASURES)).toMatchSnapshot()
  })

  test('Total time taken in calling lifecycle methods', () => {
    expect(getTotalTime(getLifecycleTime(MEASURES))).toMatchSnapshot()
  })

  test('Total effects', () => {
    expect(getTotalMethods(getLifecycleTime(MEASURES))).toMatchSnapshot()
  })
})
