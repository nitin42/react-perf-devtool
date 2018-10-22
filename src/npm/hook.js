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
    * shouldLog (log to console)
    * port (port number to send the data to console)
    * components (array of components to measure)

  Callback (optional): A callback can also be passed. The callback receives the parsed and aggregated results of the performance measures.

  NOTE: This should only be used in development mode.
*/
const registerObserver = (params = { shouldLog: false }, callback) => {
  if (window.PerformanceObserver) {
    const { shouldLog, timeout = 2000 } = params
    const observer = new window.PerformanceObserver(list => {
      const entries = list.getEntries()

      const generatedMeasures = generateDataFromMeasures(
        getReactPerformanceData(entries)
      )
      const measures =
        typeof components !== 'undefined' && Array.isArray(components)
          ? getMeasuresByComponentNames(components, generatedMeasures)
          : generatedMeasures

      if (typeof callback === 'function') callback(measures)
      window.__REACT_PERF_DEVTOOL_GLOBAL_STORE__ = {
        measures,
        timeout,
        length: entries.length,
        rawMeasures: entries
      }
      if (shouldLog) logToConsole(params, measures)
    })
    observer.observe({ entryTypes: ['measure'] })
    return observer
  }
  return undefined
}

/**
  This function logs the measures to the console. Requires a server running on a specified port. Default port number is 8080.
*/
const logToConsole = ({ port }, measures) => {
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

      send(data, port)
    }
  )
}

// Send the data to a specified port
const send = (data, port) => {
  const normalizedPort =
    port !== undefined && typeof port === 'number' ? port : 8080
  try {
    window.navigator.sendBeacon(
      `http://127.0.0.1:${normalizedPort}`,
      JSON.stringify(data, null, 2)
    )
  } catch (err) {
    console.error(`Failed to send data to port ${normalizedPort}`)
  }
}

const getMeasuresByComponentNames = (componentNames, measures) =>
  measures.filter(measure =>
    componentNames.some(componentName =>
      new Regex(componentName).test(measure.componentName)
    )
  )

export { registerObserver, getMeasuresByComponentNames }
