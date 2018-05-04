import { getComponentAndPhaseName } from './parseMeasures'

// Schema for storing the time duration of each phase of a React component
const createSchema = () => ({
  componentDidMount: {
    timeSpent: []
  },
  componentDidUpdate: {
    timeSpent: []
  },
  componentWillMount: {
    timeSpent: []
  },
  componentWillReceiveProps: {
    timeSpent: []
  },
  componentWillUnmount: {
    timeSpent: []
  },
  componentWillUpdate: {
    timeSpent: []
  },
  getChildContext: {
    timeSpent: []
  },
  getSnapshotBeforeUpdate: {
    timeSpent: []
  },
  mount: {
    timeSpent: []
  },
  shouldComponentUpdate: {
    timeSpent: []
  },
  unmount: {
    timeSpent: []
  },
  update: {
    timeSpent: []
  },
  cascadingUpdate: {
    timeSpent: []
  }
})

// Update the time duration of each phase
const updateTime = (store, componentName, phase, measure) => {
  if (phase === '[mount]') {
    return store[componentName].mount.timeSpent.push(measure.duration)
  }

  if (phase === '[unmount]') {
    return store[componentName].unmount.timeSpent.push(measure.duration)
  }

  if (phase === '[update]') {
    return store[componentName].update.timeSpent.push(measure.duration)
  }

  if (phase === 'getChildContext') {
    return store[componentName].getChildContext.timeSpent.push(measure.duration)
  }

  if (phase === 'getSnapshotBeforeUpdate') {
    return store[componentName].getSnapshotBeforeUpdate.timeSpent.push(
      measure.duration
    )
  }

  if (phase === 'cascadingUpdate') {
    return store[componentName].cascadingUpdate.timeSpent.push(measure.duration)
  }

  if (phase === 'componentWillMount') {
    return store[componentName].componentWillMount.timeSpent.push(
      measure.duration
    )
  }

  if (phase === 'componentWillUnmount') {
    return store[componentName].componentWillUnmount.timeSpent.push(
      measure.duration
    )
  }

  if (phase === 'componentDidMount') {
    return store[componentName].componentDidMount.timeSpent.push(
      measure.duration
    )
  }

  if (phase === 'componentWillReceiveProps') {
    return store[componentName].componentWillReceiveProps.timeSpent.push(
      measure.duration
    )
  }

  if (phase === 'shouldComponentUpdate') {
    return store[componentName].shouldComponentUpdate.timeSpent.push(
      measure.duration
    )
  }

  if (phase === 'componentWillUpdate') {
    return store[componentName].componentWillUpdate.timeSpent.push(
      measure.duration
    )
  }

  if (phase === 'componentDidUpdate') {
    return store[componentName].componentDidUpdate.timeSpent.push(
      measure.duration
    )
  }
}

// Get data from the performance measures
const getReactPerformanceData = measures => {
  const store = {}
  measures.forEach(measure => {
    const nameAndPhase = getComponentAndPhaseName(measure)
    if (nameAndPhase) {
      const { componentName, phase } = nameAndPhase
      if (!store[componentName]) {
        store[componentName] = createSchema()
      }

      updateTime(store, componentName, phase, measure)
    }
  })
  return store
}

export { getReactPerformanceData }
