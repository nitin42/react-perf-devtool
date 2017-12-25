var React = require('react')
var ReactTestRenderer = require('react-test-renderer')

var Results = require('../src/extension/components/Results')

var rawMeasures = require('../samples/measures')

describe('Results component', () => {
  it('should output the calculated results', () => {
    var tree = ReactTestRenderer.create(
      <Results
        rawMeasures={rawMeasures}
        totalTime={124.45}
        loading={false} // Consider the queue is empty and the task is finished (event loop)
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
