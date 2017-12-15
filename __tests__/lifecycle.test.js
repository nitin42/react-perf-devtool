const MEASURES = require('../samples/measures')

const { getLifecycleTime, getTotalMethods } = require('../src/utils/lifecycle')
const getTotalTime = require('../src/utils/totalTime')

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
