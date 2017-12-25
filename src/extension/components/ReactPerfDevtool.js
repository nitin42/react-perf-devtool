var React = require('react')

var Table = require('./Table')
var Results = require('./Results')
var ErrorComponent = require('./ErrorComponent')

// Stores the measures
var store = []

// These fields are evaluated in the inspectedWindow to get information about measures.
var queries = {
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
class ReactPerfDevtool extends React.Component {
  timer = null
  evaluate = chrome.devtools.inspectedWindow.eval
  refresh = chrome.devtools.inspectedWindow.reload
  panelStyles = {
    color: chrome.devtools.panels.themeName === 'dark' ? 'white' : 'black'
  }

  constructor(props) {
    super(props)
    this.state = {
      perfData: [], // Stores the parsed performance measures
      totalTime: 0, // Total time taken combining all the phases.
      pendingEvents: 0, // Pending event count.
      rawMeasures: [], // Raw measures output. It is used for rendering the overall results.
      loading: false, // To show the loading output while collecting the results.
      hasError: false // Track errors, occurred when collecting the measures.
    }
  }

  componentDidMount() {
    this.setState({ loading: true })

    // Get the total measures and flush them if the store is empty.
    this.timer = setInterval(() => this.getMeasuresLength(), 2000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  getMeasuresLength = () => {
    this.evaluate(queries['measuresLength'], (count, err) => {
      if (err) {
        this.setState({ hasError: true })
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
    // Returns the performance entries which are not parsed and not aggregated (required for generating the overall result)
    this.getRawMeasures()

    this.evaluate(queries['measures'], (measures, err) => {
      if (err) {
        this.setState({ hasError: true })
        return
      }

      // Update the state.
      this.updateMeasures(JSON.parse(measures))
    })
  }

  getRawMeasures = () => {
    this.evaluate(queries['rawMeasures'], (measures, err) => {
      if (err) {
        this.setState({ hasError: true })
        return
      }
      this.setState({
        rawMeasures: JSON.parse(measures)
      })
    })
  }

  updateMeasures = measures => {
    store = store.concat(measures)

    this.setState({
      perfData: store,
      totalTime: store
        .reduce((acc, comp) => acc + comp.totalTimeSpent, 0)
        .toFixed(2)
    })

    this.clearMeasures()
  }

  // TODO: This is not an accurate way to clear the shared state (store on the window object).
  // When the task from the queue is executed (this.getMeasures), it checks for the internal state (perf. measures)
  // For documents that use React, measures are rendered immediately but in other cases, this will cause an error.
  clearMeasures = () => this.evaluate(queries['clear'])

  // Clear the panel content.
  clear = () => {
    store = []

    this.setState({
      perfData: store,
      totalTime: 0,
      rawMeasures: [],
      pendingEvents: 0
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

    chrome.devtools.inspectedWindow.reload()
  }

  render() {
    return (
      <div style={this.panelStyles}>
        <div style={{ display: 'inlineBlock' }}>
          <button onClick={this.clear}>Clear</button>
          <button onClick={this.reload}>Reload the inspected page</button>
        </div>

        <div style={{ fontWeight: 500, padding: '8px' }}>
          Pending Events: {this.state.pendingEvents}
        </div>
        {this.state.hasError ? (
          <ErrorComponent />
        ) : (
          <React.Fragment>
            <Table measures={this.state.perfData} />
            <Results
              rawMeasures={this.state.rawMeasures}
              totalTime={this.state.totalTime}
              loading={this.state.loading}
            />
          </React.Fragment>
        )}
      </div>
    )
  }
}

module.exports = ReactPerfDevtool
