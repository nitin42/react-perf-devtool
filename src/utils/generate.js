const { add, average, percent } = require('./math')

function sortComponents(components) {
  return components.sort((a, b) => b.totalTime - a.totalTime)
}

function alignComponents(totalTime) {
  return Object.keys(totalTime).reduce((acc, name) => {
    acc.push({ name, totalTime: totalTime[name] })
    return acc
  }, [])
}

function getTotalTime(components) {
  return components.reduce((acc, component) => (acc += component.totalTime), 0)
}

function plotTimings(nums) {
  return {
    averageTimeSpentMs: average(nums),
    numberOfTimes: nums.length,
    totalTimeSpentMs: add(nums),
  }
}

function createSchema(store, component, totalTime) {
  return {
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
    ),
  }
}

function generateDataFromMeasures(store) {
  const componentsByTotalTime = {}

  for (let componentName in store) {
    componentsByTotalTime[componentName] = componentsByTotalTime[componentName] || 0

    componentsByTotalTime[componentName] += add(store[componentName].mount.timeSpent)
    componentsByTotalTime[componentName] += add(store[componentName].unmount.timeSpent)
    componentsByTotalTime[componentName] += add(store[componentName].update.timeSpent)
    componentsByTotalTime[componentName] += add(store[componentName].render.timeSpent)
    componentsByTotalTime[componentName] += add(store[componentName].componentWillMount.timeSpent)
    componentsByTotalTime[componentName] += add(store[componentName].componentDidMount.timeSpent)
    componentsByTotalTime[componentName] += add(store[componentName].componentWillUnmount.timeSpent)
    componentsByTotalTime[componentName] += add(store[componentName].componentDidUpdate.timeSpent)
    componentsByTotalTime[componentName] += add(store[componentName].componentWillUpdate.timeSpent)
    componentsByTotalTime[componentName] += add(store[componentName].componentWillReceiveProps.timeSpent)
    componentsByTotalTime[componentName] += add(store[componentName].shouldComponentUpdate.timeSpent)
  }

  const components = alignComponents(componentsByTotalTime)

  const totalTime = getTotalTime(components)

  return sortComponents(components).map(component => createSchema(store, component, totalTime))
}

module.exports = generateDataFromMeasures
