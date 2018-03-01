import { add, average, percent } from './math'

// Get the total time taken combining all the phases
const getSummarisedTotalTime = components =>
  components.reduce((acc, component) => (acc += component.totalTime), 0)

// Plot the timings (average time in ms, component instances, total time in ms)
const plotTimings = nums => ({
  averageTimeSpentMs: average(nums),
  numberOfTimes: nums.length,
  totalTimeSpentMs: add(nums)
})

// Create a schema for each component
const createSchema = (store, component, totalTime) => ({
  componentName: component.name,
  totalTimeSpent: component.totalTime,
  numberOfInstances:
    store[component.name].mount.timeSpent.length -
    store[component.name].unmount.timeSpent.length,
  percentTimeSpent: percent(component.totalTime / totalTime),
  render: plotTimings(store[component.name].render.timeSpent),
  mount: plotTimings(store[component.name].mount.timeSpent),
  update: plotTimings(store[component.name].update.timeSpent),
  unmount: plotTimings(store[component.name].unmount.timeSpent),
  componentWillMount: plotTimings(
    store[component.name].componentWillMount.timeSpent
  ),
  componentDidMount: plotTimings(
    store[component.name].componentDidMount.timeSpent
  ),
  componentWillReceiveProps: plotTimings(
    store[component.name].componentWillReceiveProps.timeSpent
  ),
  shouldComponentUpdate: plotTimings(
    store[component.name].shouldComponentUpdate.timeSpent
  ),
  componentWillUpdate: plotTimings(
    store[component.name].componentWillUpdate.timeSpent
  ),
  componentDidUpdate: plotTimings(
    store[component.name].componentDidUpdate.timeSpent
  ),
  componentWillUnmount: plotTimings(
    store[component.name].componentWillUnmount.timeSpent
  )
})

const getTotalComponentTimeSpent = componentPhases => {
  const phases = [
    'mount',
    'unmount',
    'update',
    'render',
    'componentWillMount',
    'componentDidMount',
    'componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'componentDidUpdate',
    'componentWillUnmount'
  ]
  return phases.reduce(
    (totalTimeSpent, phase) =>
      (totalTimeSpent += add(componentPhases[phase].timeSpent)),
    0
  )
}

const generateDataFromMeasures = store => {
  const componentsWithTotalTime = Object.keys(store).map(componentName => ({
    name: componentName,
    totalTime: getTotalComponentTimeSpent(store[componentName])
  }))
  const totalTime = getSummarisedTotalTime(componentsWithTotalTime)
  return componentsWithTotalTime
    .map(componentWithTotalTime =>
      createSchema(store, componentWithTotalTime, totalTime)
    )
    .sort((a, b) => b.totalTimeSpent - a.totalTimeSpent)
}

export { generateDataFromMeasures }
