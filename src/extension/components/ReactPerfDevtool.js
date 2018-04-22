import React from 'react'
import { Metrics } from './Metrics'
import { ErrorComponent } from './ErrorComponent'
import { Measures } from './Measures'
import { Buttons } from './Buttons'
import { Stats } from './Stats'
import { getReactPerformanceData } from '../../shared/parse'
import { generateDataFromMeasures } from '../../shared/generate'

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
  clear: `__REACT_PERF_DEVTOOL_GLOBAL_STORE__ = {
          length: 0,
          measures: [],
          rawMeasures: [],
        }`
}

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
    // Display the loading indicator
    this.setState({ loading: true })

    // Get the total measures and flush them if the store is empty.
    this.timer = setInterval(() => this.getMeasuresLength(), 2000)

    // Show the chart when we have the measures
    this.setState({ showChart: true })
  }

  componentWillUnmount() {
    clearInterval(this.timer)
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
        `${totalComponents} components (ms)`,
        'Committing changes (ms)',
        `Committing ${totalEffects} host ${
          totalEffects === 1 || totalEffects === 0 ? 'effect' : 'effects'
        } (ms)`,
        `Calling ${totalLifecycleMethods} ${
          totalLifecycleMethods === 1 || totalLifecycleMethods === 0
            ? 'lifecycle hook'
            : 'lifecycle hooks'
        } (ms)`
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true
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

  drawChart = (props, contex) => {
    if (contex) {
      return new this.props.Graphics(
        contex,
        this.chartOptions(this.getChartData(props))
      )
    }
  }

  setErrorState = () => this.setState({ hasError: true, loading: false })

  getMeasuresLength = (force = false) => {
    this.evaluate(queries['measuresLength'], (count, err) => {
      if (err) {
        // || count === 0
        this.setErrorState()
        return
      }
      const parsed = JSON.parse(count)

      // Update the event count.
      if (this.state.pendingEvents !== parsed || force)
        return this.updateEventsCount(parsed)
    })
  }

  update = () => {
    this.getMeasuresLength(true)
  }

  updateEventsCount = count => {
    this.shouldRenderMeasures(count)
  }

  getAllMeasures = () => {
    // TODO
  }
  shouldRenderMeasures = count => {
    if (this.state.perfData.length === 0) {
      // Get the performance measures.
      this.getMeasures(count)
    } else {
      this.evaluate(queries['rawMeasures'], (rawMeasures, err) => {
        if (err) {
          this.setErrorState()
          return
        }

        this.evaluate(queries['measures'], (measures, err2) => {
          if (err2) {
            this.setErrorState()
            return
          }
          const newMeasures = JSON.parse(measures)
          if (newMeasures.length) {
            const newRawMeasures = this.state.rawMeasures.concat(
              JSON.parse(rawMeasures)
            )
            store = [
              ...generateDataFromMeasures(
                getReactPerformanceData(newRawMeasures)
              )
            ]

            this.setState(
              {
                pendingEvents: count,
                loading: false,
                rawMeasures: newRawMeasures,
                perfData: store,
                totalTime: store
                  .reduce((acc, comp) => acc + comp.totalTimeSpent, 0)
                  .toFixed(2)
              },
              () => {
                const contex = document.getElementById('myChart')
                if (contex) {
                  this.drawChart(
                    {
                      totalTime: store
                        .reduce((acc, comp) => acc + comp.totalTimeSpent, 0)
                        .toFixed(2),
                      rawMeasures: newRawMeasures,
                      totalComponents: store.length
                    },
                    contex
                  )
                  this.clearMeasures()
                }
              }
            )
          } else this.setState({ pendingEvents: count })
        })
      })
    }
  }

  getMeasures = count => {
    // Returns the performance entries which are not parsed and not aggregated
    // These measures are required for creating the chart.
    this.getRawMeasures(count)
  }

  getRawMeasures = count => {
    this.evaluate(queries['rawMeasures'], (rawMeasures, err) => {
      if (err) {
        this.setErrorState()
        return
      }
      const newRawMeasures = this.state.rawMeasures.concat(
        JSON.parse(rawMeasures)
      )

      this.evaluate(queries['measures'], (measures, err) => {
        if (err) {
          this.setErrorState()
          return
        }
        this.updateMeasures(JSON.parse(measures), newRawMeasures, count)
      })
    })
  }

  updateMeasures = (measures, raw, count) => {
    store = [...generateDataFromMeasures(getReactPerformanceData(raw))]
    // store = this.mergeStore(measures, store);

    this.setState(
      {
        pendingEvents: count,
        loading: false,
        rawMeasures: raw,
        perfData: store,
        totalTime: store
          .reduce((acc, comp) => acc + comp.totalTimeSpent, 0)
          .toFixed(2)
      },
      () => {
        const contex = document.getElementById('myChart')
        if (contex) {
          this.drawChart(
            {
              totalTime: store
                .reduce((acc, comp) => acc + comp.totalTimeSpent, 0)
                .toFixed(2),
              rawMeasures: raw,
              totalComponents: store.length
            },
            contex
          )
        }
      }
    )

    // Clear the shared state, so that new measures can be appended (and they don't override)
    this.clearMeasures()
  }

  clearMeasures = () => this.evaluate(queries['clear'])

  // Clear the panel content.
  clear = () => {
    store = []

    this.setState({
      perfData: [],
      totalTime: 0,
      rawMeasures: [],
      pendingEvents: 0,
      showChart: false
    })

    this.clearMeasures()
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
          <Buttons
            theme={theme}
            clear={this.clear}
            reload={this.reload}
            update={this.update}
          />
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
