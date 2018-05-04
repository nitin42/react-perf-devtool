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

// These fields are evaluated in the inspectedWindow to get information about measures.
let queries = {
  measuresLength: 'JSON.stringify(__REACT_PERF_DEVTOOL_GLOBAL_STORE__.length)',
  newMeasures:
    'JSON.stringify(__REACT_PERF_DEVTOOL_GLOBAL_STORE__.newMeasures)',
  measures: 'JSON.stringify(__REACT_PERF_DEVTOOL_GLOBAL_STORE__.measures)',
  aggregate: 'JSON.stringify(__REACT_PERF_DEVTOOL_GLOBAL_STORE__.aggregate)',
  requiredData: `JSON.stringify({
    newMeasures: __REACT_PERF_DEVTOOL_GLOBAL_STORE__.newMeasures,
    count: __REACT_PERF_DEVTOOL_GLOBAL_STORE__.length,
    measures: __REACT_PERF_DEVTOOL_GLOBAL_STORE__.measures,
    rawMeasures: __REACT_PERF_DEVTOOL_GLOBAL_STORE__.rawMeasures
  })`,
  rawMeasures:
    'JSON.stringify(__REACT_PERF_DEVTOOL_GLOBAL_STORE__.rawMeasures)',
  clear: `
    __REACT_PERF_DEVTOOL_GLOBAL_STORE__.length = 0;
    __REACT_PERF_DEVTOOL_GLOBAL_STORE__.measures = [];
    __REACT_PERF_DEVTOOL_GLOBAL_STORE__.newMeasures = 0;
    __REACT_PERF_DEVTOOL_GLOBAL_STORE__.rawMeasures = [];
  `,
  clearSome: `
    __REACT_PERF_DEVTOOL_GLOBAL_STORE__.length = 0;
    __REACT_PERF_DEVTOOL_GLOBAL_STORE__.measures = [];
    __REACT_PERF_DEVTOOL_GLOBAL_STORE__.newMeasures = 0;
  `
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

  state = {
    hasError: false, // Track errors, occurred when collecting the measures.
    loading: true, // To show the loading output while collecting the results.
    count: 0, // Pending event count.
    measures: [], // Stores the parsed performance measures
    rawMeasures: [], // Raw measures output. It is used for rendering the overall results.
    showChart: false,
    totalTime: 0 // Total time taken combining all the phases.
  }

  updateAggregate() {
    this.evaluate(queries['aggregate'], (aggregate, err) => {
      if (err) setTimeout(() => this.updateAggregate(), 1000)
      else {
        this.aggregate = JSON.parse(aggregate)
        // Get the total measures and flush them if the store is empty.
        this.timer = setInterval(() => this.updateMeasures(false), 2000)
      }
    })
  }
  componentDidMount() {
    this.updateAggregate()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

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
      responsive: true,
      maintainAspectRatio: true
    }
  })

  getChartData = () => {
    return {
      totalEffects: getResults(this.state.rawMeasures).totalEffects,
      hostEffects: getResults(this.state.rawMeasures).hostEffectsTime,
      commitChanges: getResults(this.state.rawMeasures).commitChangesTime,
      totalLifecycleMethods: getResults(this.state.rawMeasures)
        .totalLifecycleMethods,
      lifecycleTime: getResults(this.state.rawMeasures).lifecycleTime,
      totalTime: computeTotalTime(
        this.state.rawMeasures,
        this.state.totalTime
      ).toFixed(2),
      totalComponents: this.state.measures.length
    }
  }

  drawChart = () => {
    return new this.props.Graphics(
      this.chart,
      this.chartOptions(this.getChartData())
    )
  }

  setErrorState = () => this.setState({ hasError: true, loading: false })

  updateMeasures = (force = false) => {
    this.evaluate(queries['requiredData'], (requiredData, err) => {
      if (err) {
        this.setErrorState()
        return
      }
      const data = JSON.parse(requiredData)

      return ((this.aggregate || force) && data.newMeasures) ||
        (!this.aggregate && this.state.measures.length === 0)
        ? this.persistMeasures(data)
        : this.setState({ count: data.count })
    })
  }

  update = () => {
    this.updateMeasures(true)
  }

  persistMeasures = data => {
    const { count, rawMeasures, measures } = data

    this.setState(
      {
        count,
        loading: false,
        showChart: true,
        rawMeasures,
        measures,
        totalTime: measures
          .reduce((acc, comp) => acc + comp.totalTimeSpent, 0)
          .toFixed(2)
      },
      () => {
        this.clearMeasures()
        if (!this.chart) this.chart = document.getElementById('myChart')
        if (this.chart) {
          this.drawChart()
        }
      }
    )
  }

  clearMeasures = (clearAll = false) => {
    return this.aggregate && !clearAll
      ? this.evaluate(queries['clearSome'])
      : this.evaluate(queries['clear'])
  }

  // Clear the panel content.
  clear = () => {
    this.chart = null
    this.setState({
      count: 0, // Pending event count.
      hassError: false, // Track errors, occurred when collecting the measures.
      loading: true, // To show the loading output while collecting the results.
      measures: [], // Stores the parsed performance measures
      rawMeasures: [], // Raw measures output. It is used for rendering the overall results.
      showChart: false,
      totalTime: 0
    })

    this.clearMeasures(true)
  }

  browserReload = () =>
    typeof window !== undefined ? window.location.reload() : null

  reloadInspectedWindow = () => chrome.devtools.inspectedWindow.reload()

  // Reload.
  reload = () => {
    this.clear()
    this.browserReload()
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
            Pending events: {this.state.count}
          </span>
        </div>
        {this.state.hasError ? (
          <ErrorComponent />
        ) : (
          <React.Fragment>
            <Metrics measures={this.state.measures} />
            <Stats
              showChart={this.state.showChart}
              totalTime={this.state.totalTime}
            />
            <Measures measures={this.state.measures} />
          </React.Fragment>
        )}
      </div>
    )
  }
}
