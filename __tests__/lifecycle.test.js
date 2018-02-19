var MEASURES = require('../samples/measures')

var { getLifecycleTime, getTotalMethods } = require('../src/shared/lifecycle')
var { getTotalTime } = require('../src/shared/totalTime')

describe('Calling Lifecycle Methods', () => {
  test('Sanity', () => {
    console.log(getLifecycleTime(MEASURES))
  })

  test('Total time taken in calling lifecycle methods', () => {
    console.log(getTotalTime(getLifecycleTime(MEASURES)))
  })

  test('Total effects', () => {
    console.log(getTotalMethods(getLifecycleTime(MEASURES)))
  })
})
