import { getReactPerformanceData } from '../shared/parse'
import { generateDataFromMeasures } from '../shared/generate'

/**
  This registers an observer that listens to the React performance measurement event.
  It hooks an object containing information about the events and performance measures of React components to the
  global state (window object) which can then be accessed inside the inspected window using eval().

  With every re-render, this object is updated with new measures and events count.
  The extension takes care of clearing up the memory (required to store this object) and also the cache.

  Calculating and aggregating the results happens inside the app frame and not in the devtool. It has its own benefits.
    * These measures can be send to a server for analyses
    * Measures can be logged to a console
    * Particular measures can be inspected in the console with the help of configuration object (not done with the API for it yet)
    * This also gives control to the developer on how to manage and inspect the measures apart from using the extension

  Trade-offs of previous version:
    * Need to update the commonjs react-dom development bundle (commenting the line)
    * No way of sending the measures from the app frame to the console
    * Need to query measures rather than listening to an event once
    * No control on how to inspect the measures for a particular use case (for eg - render and update performance of a component)

  Options, passed to listener:
    * log (log to console)
    * port (port number to send the data to console)

  Callback (optional): A callback can also be passed. The callback receives the parsed and aggregated results of the performance measures.

  NOTE: This should only be used in development mode.
*/
const registerObserver = (params = {}, callback) => {
  window.__REACT_PERF_DEVTOOL_GLOBAL_STORE__ = {
    measures: [],
    length: 0,
    rawMeasures: [],
    newMeasures: 0,
    aggregate: params.aggregate
  }
  // TODO: Is there any way to polyfill this API ?
  if (window.PerformanceObserver) {
    const { shouldLog, port, components } = params

    window.observer = new window.PerformanceObserver(list => {
      const newRawMeasures = list
        .getEntries()
        .concat(window.__REACT_PERF_DEVTOOL_GLOBAL_STORE__.rawMeasures)
      const newMeasures =
        newRawMeasures.length -
        window.__REACT_PERF_DEVTOOL_GLOBAL_STORE__.rawMeasures.length

      const measures = generateDataFromMeasures(
        getReactPerformanceData(newRawMeasures)
      )

      if (callback && typeof callback === 'function') {
        callback(measures)
      }

      window.__REACT_PERF_DEVTOOL_GLOBAL_STORE__ = {
        aggregate: params.aggregate,
        length: newRawMeasures.length,
        measures,
        newMeasures,
        rawMeasures: newRawMeasures
      }

      // For logging to console
      if (shouldLog) {
        logToConsole(params, measures)
      }
    })

    window.observer.observe({
      entryTypes: ['measure']
    })

    return window.observer
  }
}

/**
  This function logs the measures to the console. Requires a server running on a specified port. Default port number is 8080.
  TODO: Change this behaviour if Chrome lands the support for recording performance when inspecting the node apps.
*/
const logToConsole = ({ port, components }, measures) => {
  if (!components) {
    logMeasures(port, measures)
  } else if (typeof components !== undefined && Array.isArray(components)) {
    const requiredMeasures = getRequiredMeasures(components, measures)

    logMeasures(port, requiredMeasures)
  }
}

const logMeasures = (port, measures) => {
  measures.forEach(
    ({
      componentName,
      componentDidMount,
      componentDidUpdate,
      componentWillMount,
      componentWillReceiveProps,
      componentWillUnmount,
      componentWillUpdate,
      getChildContext,
      getSnapshotBeforeUpdate,
      mount,
      numberOfInstances,
      percentTimeSpent,
      shouldComponentUpdate,
      totalTimeSpent,
      unmount,
      update,
      wastedRendersGuess
    }) => {
      // The time is in millisecond (ms)
      // TODO: The data generated is generalized. Make it concrete!
      const data = {
        component: componentName,
        omponentDidMount,
        componentDidUpdate,
        componentWillMount,
        componentWillReceiveProps,
        componentWillUnmount,
        componentWillUpdate,
        getChildContext,
        getSnapshotBeforeUpdate,
        mount,
        numberOfInstances,
        percentTimeSpent,
        shouldComponentUpdate,
        totalTimeSpent,
        unmount,
        update,
        wastedRendersGuess
      }

      send(data, port)
    }
  )
}

// Send the data to a specified port
const send = (data, port) => {
  window.navigator.sendBeacon(
    `http://127.0.0.1:${
      port !== undefined && typeof port === 'number' ? port : 8080
    }`,
    JSON.stringify(data, null, 2)
  )
}

const getRequiredMeasures = (components, measures) => {
  let requiredMeasures = []

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

export { registerObserver }
