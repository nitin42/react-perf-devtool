const React = require('../../extension/third_party/react')

const Table = require('./Table')

let cache = []

function getComponentAndPhaseName(measure) {
  if (measure.name.includes('⚛')) {
    const index = measure.name.split('⚛ ').join('')

    // "App [mount]"
    if ((/\[\w+\]/).test(index)) {
      const [componentName, phase] = index.split(' ')
      return {
        componentName,
        phase,
      }
    } else if ((/\w+\.\w+/).test(index)) { // App.componentWillMount
      const [componentName, lifecycle] = index.split('.')
      return {
        componentName,
        phase: lifecycle,
      }
    } else {
      return {
        componentName: null,
        phase: null,
      }
    }
  } else if (measure.name.includes('⛔')) {
    const index = measure.name.split('⛔ ').join('')

    if ((/\w+\.\w+/).test(index)) {
      return {
        componentName: index.split('.')[0],
        phase: index.split('.')[1].split(' Warning:')[0],
      }
    } else {
      return {
        componentName: null,
        phase: null,
      }
    }
  }

  return {
    componentName: null,
    phase: null,
  }
}

function readReactPerformanceData(measures) {
  const index = {}
  for (let measure of measures) {
    const { componentName, phase } = getComponentAndPhaseName(measure)
    if (componentName !== null && phase !== null) {
      if (!index[componentName]) {
        index[componentName] = {
          mount: {
            timeSpent: [],
          },
          unmount: {
            timeSpent: [],
          },
          update: {
            timeSpent: [],
          },
          render: {
            timeSpent: [],
          },
          componentWillMount: {
            timeSpent: [],
          },
          componentDidMount: {
            timeSpent: [],
          },
          componentWillReceiveProps: {
            timeSpent: [],
          },
          shouldComponentUpdate: {
            timeSpent: [],
          },
          componentWillUpdate: {
            timeSpent: [],
          },
          componentDidUpdate: {
            timeSpent: [],
          },
          componentWillUnmount: {
            timeSpent: [],
          },
        }
      }

      if (phase === '[mount]') {
        index[componentName].mount.timeSpent.push(measure.duration)
      }

      if (phase === '[unmount]') {
        index[componentName].unmount.timeSpent.push(measure.duration)
      }

      if (phase === '[update]') {
        index[componentName].update.timeSpent.push(measure.duration)
      }

      if (phase === '[render]') {
        index[componentName].render.timeSpent.push(measure.duration)
      }

      if (phase === 'componentWillMount') {
        index[componentName].componentWillMount.timeSpent.push(measure.duration)
      }

      if (phase === 'componentWillUnmount') {
        index[componentName].componentWillUnmount.timeSpent.push(
          measure.duration
        )
      }

      if (phase === 'componentDidMount') {
        index[componentName].componentDidMount.timeSpent.push(measure.duration)
      }

      if (phase === 'componentWillReceiveProps') {
        index[componentName].componentWillReceiveProps.timeSpent.push(
          measure.duration
        )
      }

      if (phase === 'shouldComponentUpdate') {
        index[componentName].shouldComponentUpdate.timeSpent.push(
          measure.duration
        )
      }

      if (phase === 'componentWillUpdate') {
        index[componentName].componentWillUpdate.timeSpent.push(
          measure.duration
        )
      }

      if (phase === 'componentDidUpdate') {
        index[componentName].componentDidUpdate.timeSpent.push(measure.duration)
      }
    } else if (componentName === null && phase === null) {
      index[''] = {
        mount: {
          timeSpent: [],
        },
        unmount: {
          timeSpent: [],
        },
        update: {
          timeSpent: [],
        },
        render: {
          timeSpent: [],
        },
        componentWillMount: {
          timeSpent: [],
        },
        componentDidMount: {
          timeSpent: [],
        },
        componentWillReceiveProps: {
          timeSpent: [],
        },
        shouldComponentUpdate: {
          timeSpent: [],
        },
        componentWillUpdate: {
          timeSpent: [],
        },
        componentDidUpdate: {
          timeSpent: [],
        },
        componentWillUnmount: {
          timeSpent: [],
        },
      }
    }
  }

  return index
}

function sum(nums) {
  return Math.round(Number(nums.reduce((acc, v) => (acc += v), 0).toFixed(2)))
}

function average(nums) {
  if (nums.length === 0) {
    return '-'
  }
  return (nums.reduce((acc, v) => (acc += v), 0) / nums.length).toFixed(1)
}

function mapData(index) {
  const componentByTotalTime = {}

  for (let componentName in index) {
    componentByTotalTime[componentName] =
      componentByTotalTime[componentName] || 0
    componentByTotalTime[componentName] += sum(
      index[componentName].mount.timeSpent
    )
    componentByTotalTime[componentName] += sum(
      index[componentName].unmount.timeSpent
    )
    componentByTotalTime[componentName] += sum(
      index[componentName].update.timeSpent
    )
  }

  const components = Object.keys(componentByTotalTime).reduce((acc, key) => {
    acc.push({ name: key, totalTime: componentByTotalTime[key] })
    return acc
  }, [])

  const allComponentsTotalTime = components.reduce(
    (acc, component) => (acc += component.totalTime),
    0
  )

  const percent = num => Math.round(num * 100) + '%'

  const r = components.sort((a, b) => b.totalTime - a.totalTime)
  return r.map(c => ({
    componentName: c.name,
    totalTimeSpent: c.totalTime,
    numberOfInstances:
      index[c.name].mount.timeSpent.length -
      index[c.name].unmount.timeSpent.length,
    percentTimeSpent: percent(c.totalTime / allComponentsTotalTime),
    render: mapTiming(index[c.name].render.timeSpent),
    mount: mapTiming(index[c.name].mount.timeSpent),
    update: mapTiming(index[c.name].update.timeSpent),
    unmount: mapTiming(index[c.name].unmount.timeSpent),
    componentWillMount: mapTiming(index[c.name].componentWillMount.timeSpent),
    componentDidMount: mapTiming(index[c.name].componentDidMount.timeSpent),
    componentWillReceiveProps: mapTiming(index[c.name].componentWillReceiveProps.timeSpent),
    componentWillUpdate: mapTiming(index[c.name].componentWillUpdate.timeSpent),
    shouldComponentUpdate: mapTiming(index[c.name].shouldComponentUpdate.timeSpent),
    componentDidUpdate: mapTiming(index[c.name].componentDidUpdate.timeSpent),
    componentWillUnmount: mapTiming(index[c.name].componentWillUnmount.timeSpent)
  }))

  function mapTiming(nums) {
    return {
      averageTimeSpentMs: average(nums),
      numberOfTimes: nums.length,
      totalTimeSpentMs: sum(nums),
    }
  }
}

class ReactPerfPanel extends React.Component {
  // timer = null;
  constructor(props) {
    super(props)
    this.state = {
      perfData: [],
      totalTime: 0,
      pendingEvents: 0,
      data: [],
    }
  }

  componentDidMount() {
    setInterval(() => {
      chrome.devtools.inspectedWindow.eval(
        "performance.getEntriesByType('measure').length",
        (data, error) => {
          if (error) {
            console.error('Error', error)
            return
          }

          innerEvents(JSON.parse(data))
        }
      )
    }, 2000)

    const innerEvents = eventCount => {
      this.setState({
        pendingEvents: eventCount,
      })

      if (this.state.perfData.length === 0) {
        this.flush()
      }
    }
  }

  flush = () => {
    chrome.devtools.inspectedWindow.eval(
      "JSON.stringify(performance.getEntriesByType('measure'))",
      (data, error) => {
        if (error) {
          console.error('Error', error)
          return
        }
        innerFlush(JSON.parse(data))
      }
    )

    const innerFlush = result => {
      cache = cache.concat(result)

      const data = mapData(readReactPerformanceData(cache))

      this.setState({
        perfData: data,
        totalTime: data.reduce((acc, comp) => acc + comp.totalTimeSpent, 0),
      })

      chrome.devtools.inspectedWindow.eval(
        'JSON.stringify(performance.clearMeasures())'
      )
    }
  }

  clear = () => {
    cache = []

    this.setState({
      perfData: mapData(readReactPerformanceData(cache)),
      totalTime: 0,
    })

    chrome.devtools.inspectedWindow.eval(
      'JSON.stringify(performance.clearMeasures())'
    )
  }

  reload = () => {
    this.clear()
    chrome.devtools.inspectedWindow.reload()
  }

  render() {
    const toolbarStyle = {
      border: '1px solid #dadada',
      paddingTop: 2,
      paddingBottom: 2,
    }
    const toolbarDividerStyle = {
      backgroundColor: '#ccc',
      width: 1,
      margin: '0 4px',
      height: 12,
      display: 'inline-block',
    }

    const buttonStyle = {
      backgroundColor: '#3B78E7',
      color: 'white',
      padding: '1px 12px',
      border: '1px solid rgba(0, 0, 0, 0.14)',
    }

    const containerStyle = {
      fontFamily: `"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
      zIndex: 999,
      position: 'fixed',
      bottom: 0,
      right: 0,
      width: '100%',
      backgroundColor: 'white',
      overflowY: 'auto',
      fontSize: 12,
      height: '100%',
    }

    return (
      <div>
        {this.props.children}
        <div style={{ ...containerStyle }}>
          <div style={toolbarStyle}>
            <span>React Perf Panel</span>
            <div style={toolbarDividerStyle} />
            <button style={buttonStyle} onClick={this.flush}>
              Update
            </button>
            <div style={toolbarDividerStyle} />
            <span>{this.state.pendingEvents} pending events</span>
            <div style={toolbarDividerStyle} />
            <button style={buttonStyle} onClick={this.clear}>
              Clear
            </button>
            <div style={toolbarDividerStyle} />
            <button style={buttonStyle} onClick={this.reload}>
              Reload Inspected Page
            </button>
          </div>
          <Table components={this.state.perfData} />
          <div
            style={{
              ...toolbarStyle,
              position: 'sticky',
              width: '100%',
              bottom: 0,
              background: '#EEE',
              paddingLeft: 10,
              fontWeight: 'bold',
            }}
          >
            <span>
              Total time: {this.state.totalTime}
              ms
            </span>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ReactPerfPanel

// const measureNames = {
//   Reconcilation: '⚛ (React Tree Reconcilation)', // Reconcilation and should not have a Warning
//
//   Lifecycle: function(measure) {
//     if (measure.name.split("⚛ ").join("").test(/regex/)) {
//       return true
//     }
//   }
//
//   Phase: function(measure) {
//     if (measure.name.split("⚛ ").join("").match(/regex/)) {
//       return true
//     }
//   }
// }
//
// if (measure.name === measureNames['Reconcilation']) {}
//
// if (measureNames['Lifecycle'](measure.name)) {}
//
// if (measureNames['Phase'](measure.name)) {}
//
// return {
//   componentName: null,
//   phase: null
// }
//
// /**
//
//
// ⚛ (React Tree Reconcilation)
//
// ⚛ Component [mount]/[unmount]/[update]/[render]
//
// ⛔ (Committing Changes) Warning: Lifecycle hook scheduled a cascading update
//
// ⚛ (Committing Host Effects: 1 Total)
//
// ⚛ (Calling Lifecycle Hooks: 1 Total)
//
// ⚛ Component.Lifecycle
//
// ⛔ Component.componentDidMount Warning: Scheduled a cascading update
//
// ⛔ (React Tree Reconcilation) Warning: A top-level update interrupted the previous render
//
// For now, we just need the stage and component name. We are not interested in the warning and fiber commit phase right now.
// So we will suppress those warnings and stage details
//
// Compare the measure names with predicted keys and then parse accordingly.
//
// */
//
// function getComponentAndPhaseName(measure) {
//   if (measure.name.includes('⚛')) {
//     if (measure.name.includes('Reconcilation') && !measure.name.includes('Warning')) {
//       return {
//         componentName: 'React Tree Reconcilation',
//         phase: 'Reconcilation',
//       }
//     }
//   } else if (!measure.name.includes('Reconcilation') && measure.name.includes('.')) {
//     let index = measure.name.split('⚛ ').join('')
//
//     if (index.includes('.')) {
//       const arr = index.split('.')
//
//       return {
//         componentName: arr[0],
//         phase: arr[1],
//       }
//     } else if (index.includes('[') || index.includes(']')) {
//       const arr = index.split(' ')
//
//       return {
//         componentName: arr[0],
//         phase: arr[1],
//       }
//     }
//   } else {
//     return {
//       componentName: null,
//       phase: null,
//     }
//   }
// }
