const React = require('../../extension/third_party/react')

const getReactPerformanceData = require('../utils/parse')
const generateDataFromMeasures = require('../utils/generate')

const Table = require('./Table')
const Results = require('./Results')

let cache = []

class ReactPerfPanel extends React.Component {
  timer = null

  constructor(props) {
    super(props)
    this.state = {
      perfData: [],
      totalTime: 0,
      pendingEvents: 0,
      rawMeasures: [],
      loading: false,
    }
  }

  componentDidMount() {
    this.setState({ loading: true })

    this.timer = setInterval(() => this.getMeasuresLength(), 2000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  getMeasuresLength = () => {
    chrome.devtools.inspectedWindow.eval(
      "performance.getEntriesByType('measure').length",
      (count, error) => {
        if (error) {
          console.error('Error', error)
          return
        }

        this.updateEventsCount(JSON.parse(count))
      }
    )
  }

  updateEventsCount = count => {
    this.setState({
      pendingEvents: count,
      loading: false,
    })

    this.shouldRenderMeasures()
  }

  shouldRenderMeasures = () => {
    if (this.state.perfData.length === 0) {
      this.getMeasures()
    }
  }

  getMeasures = () => {
    chrome.devtools.inspectedWindow.eval(
      "JSON.stringify(performance.getEntriesByType('measure'))",
      (measures, error) => {
        if (error) {
          console.error('Error', error)
          return
        }
        this.updateMeasures(JSON.parse(measures))
      }
    )
  }

  updateMeasures = measures => {
    cache = cache.concat(measures)

    const data = generateDataFromMeasures(getReactPerformanceData(cache))

    this.setState({
      perfData: data,
      totalTime: data
        .reduce((acc, comp) => acc + comp.totalTimeSpent, 0)
        .toFixed(2),
      rawMeasures: cache,
    })

    this.clearMeasures()
  }

  clearMeasures = () =>
    chrome.devtools.inspectedWindow.eval(
      'JSON.stringify(performance.clearMeasures())'
    )

  clear = () => {
    cache = []

    this.setState({
      perfData: generateDataFromMeasures(getReactPerformanceData(cache)),
      totalTime: 0,
    })

    this.clearMeasures()
  }

  reload = () => {
    this.clear()

    this.setState({ loading: true })

    chrome.devtools.inspectedWindow.reload()
  }

  render() {
    return (
      <div>
        <div style={{ display: 'inlineBlock' }}>
          <button onClick={this.clear}>Clear</button>
          <button onClick={this.reload}>Reload the inspected page</button>
        </div>

        <div style={{ fontWeight: 500, padding: '8px' }}>
          Pending Events: {this.state.pendingEvents}
        </div>
        <Table perfData={this.state.perfData} />
        <Results
          rawMeasures={this.state.rawMeasures}
          totalTime={this.state.totalTime}
          loading={this.state.loading}
        />
      </div>
    )
  }
}

module.exports = ReactPerfPanel
