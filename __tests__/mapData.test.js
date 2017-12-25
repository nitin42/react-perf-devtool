var generateDataFromMeasures = require('../src/shared/generate')
var getReactPerformanceData = require('../src/shared/parse')
var MEASURES = require('../samples/measures')

describe('Map Data from React Performance Data', () => {
  test('Returns an object containing information about the component measure', () => {
    console.log(generateDataFromMeasures(getReactPerformanceData(MEASURES)))
    expect(
      generateDataFromMeasures(getReactPerformanceData(MEASURES))
    ).toMatchSnapshot()
  })
})
