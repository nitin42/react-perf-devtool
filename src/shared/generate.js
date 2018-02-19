import { add, average, percent } from './math'

// Sort the all components by total time
const sortComponents = components =>
  components.sort((a, b) => b.totalTime - a.totalTime)

// Align the components by their name and total time
const alignComponents = totalTime => {
  return Object.keys(totalTime).reduce((acc, name) => {
    acc.push({ name, totalTime: totalTime[name] })
    return acc
  }, [])
}

// Get the total time taken combining all the phases
const getTotalTime = components =>
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

// Generate the data from React performance measures
const generateDataFromMeasures = store => {
  let componentsByTotalTime = {}

  for (const componentName in store) {
    // Default
    componentsByTotalTime[componentName] =
      componentsByTotalTime[componentName] || 0

    // mount time
    componentsByTotalTime[componentName] += add(
      store[componentName].mount.timeSpent
    )
    // unmount time
    componentsByTotalTime[componentName] += add(
      store[componentName].unmount.timeSpent
    )
    // update time
    componentsByTotalTime[componentName] += add(
      store[componentName].update.timeSpent
    )
    // render time
    componentsByTotalTime[componentName] += add(
      store[componentName].render.timeSpent
    )
    // time spent in componentWillMount
    componentsByTotalTime[componentName] += add(
      store[componentName].componentWillMount.timeSpent
    )
    // time spent in componentDidMount
    componentsByTotalTime[componentName] += add(
      store[componentName].componentDidMount.timeSpent
    )
    // time spent in componentWillReceiveProps
    componentsByTotalTime[componentName] += add(
      store[componentName].componentWillReceiveProps.timeSpent
    )
    // time spent in shouldComponentUpdate
    componentsByTotalTime[componentName] += add(
      store[componentName].shouldComponentUpdate.timeSpent
    )
    // time spent in componentWillUpdate
    componentsByTotalTime[componentName] += add(
      store[componentName].componentWillUpdate.timeSpent
    )
    // time spent in componentDidUpdate
    componentsByTotalTime[componentName] += add(
      store[componentName].componentDidUpdate.timeSpent
    )
    // time spent in componentWillUnmount
    componentsByTotalTime[componentName] += add(
      store[componentName].componentWillUnmount.timeSpent
    )
  }

  const components = alignComponents(componentsByTotalTime)

  const totalTime = getTotalTime(components)

  return sortComponents(components).map(component =>
    createSchema(store, component, totalTime)
  )
}

export { generateDataFromMeasures }
