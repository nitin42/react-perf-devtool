var React = require('react')
var ReactTestRenderer = require('react-test-renderer')

var Table = require('../src/extension/components/Table')

var rawMeasures = require('../samples/measures')

var getReactPerformanceData = require('../src/shared/parse')
var generateDataFromMeasures = require('../src/shared/generate')

var aggregatedMeasures = generateDataFromMeasures(
  getReactPerformanceData(rawMeasures)
)

describe('Table component', () => {
  it('should output the calculated results in a table', () => {
    var tree = ReactTestRenderer.create(
      <Table measures={aggregatedMeasures} />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
