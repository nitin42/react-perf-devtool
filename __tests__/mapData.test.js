const generateDataFromMeasures = require('../src/utils/generate')
const getReactPerformanceData = require('../src/utils/parse')
const MEASURES = require('../samples/measures')

describe("Map Data from React Performance Data", () => {
  test("Returns an object containing information about the component measure", () => {
    console.log(generateDataFromMeasures(getReactPerformanceData(MEASURES)))
    expect(generateDataFromMeasures(getReactPerformanceData(MEASURES))).toMatchSnapshot()
  })
})
