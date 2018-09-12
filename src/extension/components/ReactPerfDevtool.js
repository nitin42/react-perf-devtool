import React from 'react'

import { Metrics } from './Metrics'
import { ErrorComponent } from './ErrorComponent'
import { Measures } from './Measures'
import { Buttons } from './Buttons'
import { Stats } from './Stats'

import { computeTotalTime, getResults } from '../util'

const theme = require('../theme')

// Stores the measures
let store = []

// These fields are evaluated in the inspectedWindow to get information about measures.
let queries = {
  measuresLength: 'JSON.stringify(__REACT_PERF_DEVTOOL_GLOBAL_STORE__.length)',
  measures: 'JSON.stringify(__REACT_PERF_DEVTOOL_GLOBAL_STORE__.measures)',
  rawMeasures:
    'JSON.stringify(__REACT_PERF_DEVTOOL_GLOBAL_STORE__.rawMeasures)',
  getTimeoutValue:
    'JSON.stringify(__REACT_PERF_DEVTOOL_GLOBAL_STORE__.timeout)',
  clear: `__REACT_PERF_DEVTOOL_GLOBAL_STORE__ = {
          length: 0,
          measures: [],
          rawMeasures: [],
          timeout: __REACT_PERF_DEVTOOL_GLOBAL_STORE__.timeout
        }`
}

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout))

/**
  This is the main component that renders the table, containing information about
  the component mount/render/update/unmount time and also lifecycle time.
  It also renders the total time taken while committing the changes, host effects
  and calling all the lifecycle methods.
*/
export class ReactPerfDevtool extends React.Component {
  timer = null
  evaluate = chrome.devtools.inspectedWindow.eval
  panelStyles = {
    color: theme === 'dark' ? 'white' : 'black',
    fontFamily: 'Metrophobic, Georgia, Serif',
    fontSize: '15px'
  }

  constructor(props) {
    super(props)
    this.state = {
      perfData: [], // Stores the parsed performance measures
      totalTime: 0, // Total time taken combining all the phases.
      pendingEvents: 0, // Pending event count.
      rawMeasures: [], // Raw measures output. It is used for rendering the overall results.
      loading: false, // To show the loading output while collecting the results.
      hasError: false, // Track errors, occurred when collecting the measures.
      showChart: false
    }
  }

  componentDidMount() {
    // Show the loader while the measures get resolved.
    // showChart, when set to true, render the canvas required for Chart.js.
    this.setState({ loading: true, showChart: true })

    // Defer the initialization of the extension until the application loads. Why ?
    // Because some of the applications are huge in size and may take a lot of time to load.
    // If the extension initialization process kicks-in before the app loads, we are trapped inside the error state.
    // With this, users can configure a timeout value for initialization of the extension using the observer hook like this `registerObserver({ timeout: 4000 })`
    // Default value for the timeout is 2 sec.

    // We need to resolve the promise after one sec. to make sure we have the updated __REACT_PERF_DEVTOOL_GLOBAL_STORE__ object otherwise we might end up with null
    sleep(1000).then(res => {
      this.evaluate(queries['getTimeoutValue'], (timeout, err) => {
        if (err) {
          this.setErrorState()
          return
        }

        // This is also backward compatible with older versions of observer hook (for versions <= @3.0.8)
        this.timer = setInterval(
          () => this.getMeasuresLength(),
          timeout !== undefined ? JSON.parse(timeout) : 2000
        )
      })
    })
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }

  reloadInspectedWindow = () => chrome.devtools.inspectedWindow.reload()

  chartOptions = ({
    totalTime,
    commitChanges,
    hostEffects,
    lifecycleTime,
    totalComponents,
    totalEffects,
    totalLifecycleMethods
  }) => ({
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: [totalTime, commitChanges, hostEffects, lifecycleTime],
          backgroundColor: ['#ff9999', '#99ffdd', '#d98cb3', '#ffff4d']
        }
      ],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
        `${totalComponents} ${
          totalComponents === 0 || totalComponents === 1
            ? 'component'
            : 'components'
        } (ms)`,
        'Committing changes (ms)',
        `Committing ${totalEffects} host ${
          totalEffects === 0 || totalEffects === 1 ? 'effect' : 'effects'
        } (ms)`,
        `Calling ${totalLifecycleMethods} ${
          totalLifecycleMethods === 0 || totalLifecycleMethods === 1
            ? 'lifecycle hook'
            : 'lifecycle hooks'
        } (ms)`
      ]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false
    }
  })

  getChartData = props => {
    const totalEffects = getResults(props.rawMeasures).totalEffects
    const hostEffects = getResults(props.rawMeasures).hostEffectsTime
    const commitChanges = getResults(props.rawMeasures).commitChangesTime
    const totalLifecycleMethods = getResults(props.rawMeasures)
      .totalLifecycleMethods
    const lifecycleTime = getResults(props.rawMeasures).lifecycleTime
    const totalTime = computeTotalTime(
      props.rawMeasures,
      props.totalTime
    ).toFixed(2)

    return {
      totalEffects,
      hostEffects,
      commitChanges,
      totalLifecycleMethods,
      lifecycleTime,
      totalTime,
      totalComponents: props.totalComponents
    }
  }

  drawChart = props => {
    const contex = document.getElementById('myChart')
    const Chart = this.props.Graphics

    const statsChart = new Chart(
      contex,
      this.chartOptions(this.getChartData(props))
    )
  }

  setErrorState = () => this.setState({ hasError: true, loading: false })

  getMeasuresLength = () => {
    this.evaluate(queries['measuresLength'], (count, err) => {
      if (err) {
        this.setErrorState()
        return
      }

      // Update the event count.
      this.updateEventsCount(JSON.parse(count))
    })
  }

  updateEventsCount = count => {
    this.setState({
      pendingEvents: count,
      loading: false
    })

    // Render the measures if the store is empty.
    this.shouldRenderMeasures()
  }

  shouldRenderMeasures = () => {
    if (this.state.perfData.length === 0) {
      // Get the performance measures.
      this.getMeasures()
    }
  }

  getMeasures = () => {
    // Returns the performance entries which are not parsed and not aggregated
    // These measures are required for creating the chart.
    this.getRawMeasures()

    this.evaluate(queries['measures'], (measures, err) => {
      if (err) {
        this.setErrorState()
        return
      }

      this.updateMeasures(JSON.parse(measures))
    })
  }

  getRawMeasures = () => {
    this.evaluate(queries['rawMeasures'], (measures, err) => {
      if (err) {
        this.setErrorState()
        return
      }

      this.setState({
        rawMeasures: JSON.parse(measures)
      })
    })
  }

  updateMeasures = measures => {
    store = store.concat(measures)

    this.drawChart({
      totalTime: store
        .reduce((acc, comp) => acc + comp.totalTimeSpent, 0)
        .toFixed(2),
      rawMeasures: this.state.rawMeasures,
      totalComponents: store.length
    })

    this.setState({
      perfData: store,
      totalTime: store
        .reduce((acc, comp) => acc + comp.totalTimeSpent, 0)
        .toFixed(2)
    })

    // Clear the shared state, so that new measures can be appended (and they don't override)
    this.clearMeasures()
  }

  clearMeasures = () => this.evaluate(queries['clear'])

  // Clear the panel content.
  clear = () => {
    store = []

    this.setState({
      perfData: store,
      totalTime: 0,
      rawMeasures: [],
      pendingEvents: 0,
      showChart: false
    })

    this.clearMeasures()

    // Makes sure that we are not batching calls for example - setting chart state here false and batching drawChart may result in an error because the canvas may not render.
    this.timer && clearInterval(this.timer)
  }

  browserReload = () =>
    typeof window !== undefined ? window.location.reload() : null

  // Reload.
  reload = () => {
    this.clear()
    this.browserReload()

    // This avoids a flash when the inspected window is reloaded.
    this.setState({ loading: true })

    this.reloadInspectedWindow()
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <div className="loader-container">
            <div className={theme === 'dark' ? 'dark-loader' : 'loader'} />
          </div>
          <p
            className={theme === 'dark' ? 'dark-loading-text' : 'loading-text'}
          >
            Collecting React performance measures...
          </p>
        </div>
      )
    }

    return (
      <div style={this.panelStyles}>
        <div style={{ display: 'inlineBlock' }}>
          <Buttons theme={theme} clear={this.clear} reload={this.reload} />
          <span style={{ fontWeight: 'bold', padding: '8px' }}>
            Pending events: {this.state.pendingEvents}
          </span>
        </div>
        {this.state.hasError ? (
          <ErrorComponent />
        ) : (
          <React.Fragment>
            <Metrics measures={this.state.perfData} />
            <Stats
              showChart={this.state.showChart}
              totalTime={this.state.totalTime}
            />
            <Measures measures={this.state.perfData} />
          </React.Fragment>
        )}
      </div>
    )
  }
}
