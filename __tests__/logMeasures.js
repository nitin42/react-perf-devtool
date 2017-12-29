var MEASURES = require('../samples/parsed')

function logMeasures(measures) {
  measures.forEach(
    ({
      componentName,
      mount,
      render,
      update,
      unmount,
      totalTimeSpent,
      percentTimeSpent,
      numberOfInstances,
      componentWillMount,
      componentDidMount,
      componentWillReceiveProps,
      shouldComponentUpdate,
      componentWillUpdate,
      componentDidUpdate,
      componentWillUnmount
    }) => {
      // The time is in millisecond (ms)
      // TODO: The data generated is generalized. Make it concrete!
      const data = {
        component: componentName,
        mount,
        render,
        update,
        unmount,
        totalTimeSpent,
        percentTimeSpent,
        numberOfInstances,
        componentWillMount,
        componentDidMount,
        componentWillReceiveProps,
        shouldComponentUpdate,
        componentWillUpdate,
        componentDidUpdate,
        componentWillUnmount
      }

      // Proxy
      console.log(data)
    }
  )
}

function logToConsole({ port, components }, measures) {
  if (!components) {
    logMeasures(measures)
  } else if (typeof components !== undefined && Array.isArray(components)) {
    var stats = getRequiredMeasures(components, measures)

    logMeasures(stats)
  }
}

function getRequiredMeasures(components, measures) {
  var requiredMeasures = []

  if (!Array.isArray(components)) {
    components = [components]
  }

  measures.forEach(measure => {
    if (components.includes(measure.componentName)) {
      requiredMeasures.push(measure)
    }
  })

  return requiredMeasures
}

describe('Log measures to console', () => {
  var options = {
    port: 3000,
    components: ['App']
  }

  it('logs stats for all the components', () => {
    var stats = logToConsole(options, MEASURES)
    stats
    expect(stats).toMatchSnapshot()
  })
})
