const React = require('react')
const Metrics = require('./Metrics')
const Results = require('./Results')
const ErrorComponent = require('./ErrorComponent')
const Measures = require('./Measures')

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
class ReactPerfDevtool extends React.Component {
  timer = null
  evaluate = chrome.devtools.inspectedWindow.eval
  panelStyles = {
    color: chrome.devtools.panels.themeName === 'dark' ? 'white' : 'black',
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
      hasError: false // Track errors, occurred when collecting the measures.
    }
  }

  reloadInspectedWindow = () => chrome.devtools.inspectedWindow.reload()

  componentWillMount() {
    // When the devtool is launched first, measures may not be available.
    // Reload the window again to get the new measures and then display them.
    // TODO: Remove this hack (possible architecture change)
    if (store.length === 0) {
      this.reloadInspectedWindow()
    }
  }

  componentDidMount() {
    // Display the loading indicator
    this.setState({ loading: true })

    // Get the total measures and flush them if the store is empty.
    this.timer = setInterval(() => this.getMeasuresLength(), 2000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  getMeasuresLength = () => {
    this.evaluate(queries['measuresLength'], (count, err) => {
      // TODO: Inspect this behaviour (possibly a bug)
      // We need to check the measures count also because it may happen that a user reloads the page and see no results.
      if (err && count === 0) {
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

    this.reloadInspectedWindow()
  }

  showDocLink = () => {
    if (this.state.perfData.length > 0) {
      return (
        <a
          className="doc-link"
          style={{
            textDecoration: 'none',
            paddingBottom: '10px',
            color: chrome.devtools.panels.themeName === 'dark' ? 'blue' : null
          }}
          target="_blank"
          href="https://github.com/nitin42/react-perf-devtool"
        >
          👉 &nbsp;Check the documentation to learn more about how these stats
          are calculated and different phases.
        </a>
      )
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <div className="loader-container">
            <div className="loader" />
          </div>
          <p className="loading-text">
            Connecting to React Performance Devtool...
          </p>
        </div>
      )
    }

    return (
      <div style={this.panelStyles}>
        <div style={{ display: 'inlineBlock' }}>
          <button className="btn" onClick={this.clear}>
            Clear
          </button>
          <button className="btn" onClick={this.reload}>
            Reload
          </button>
          <span style={{ fontWeight: 'bold', padding: '8px' }}>
            Pending Events: {this.state.pendingEvents}
          </span>
        </div>
        {this.state.hasError ? (
          <ErrorComponent />
        ) : (
          <React.Fragment>
            <Metrics measures={this.state.perfData} />
            <Results
              rawMeasures={this.state.rawMeasures}
              totalTime={this.state.totalTime}
              loading={this.state.loading}
            />
            <Measures measures={this.state.perfData} />
            {this.showDocLink()}
          </React.Fragment>
        )}
      </div>
    )
  }
}

module.exports = ReactPerfDevtool
