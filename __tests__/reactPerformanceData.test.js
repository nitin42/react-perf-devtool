var { getReactPerformanceData } = require('../src/shared/parse')
var MEASURES = require('../samples/measures')

describe('React Performance Data', () => {
  test('Parse component name and phase name', () => {
    console.log(getReactPerformanceData(MEASURES))
    expect(getReactPerformanceData(MEASURES)).toMatchSnapshot()
  })
})
