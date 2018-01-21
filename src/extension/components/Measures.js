var React = require('react')
var ProgressLoader = require('./ProgressLoader')
/**
  This component renders the data (measures of each component)
*/
function Measures(props) {
  return (
    <React.Fragment>
      <h3 className="component-text">Components</h3>
      {props.measures.map((measure, index) => {
        return (
          <div
            key={index}
            id={measure.componentName}
            className="container component-result"
          >
            <h3>{measure.componentName}</h3>
            <table>
              <tr>
                <td>Total time (ms)</td>
                <td>{Number(measure.totalTimeSpent.toFixed(2))}</td>
              </tr>
              <tr>
                <td>Count</td>
                <td>{measure.numberOfInstances}</td>
              </tr>
              <tr>
                <td>Total time (%)</td>
                <td>{measure.percentTimeSpent}</td>
              </tr>
              <tr>
                <td>Mount (ms)</td>
                <td>{measure.mount.totalTimeSpentMs}</td>
              </tr>
              <tr>
                <td>Update (ms)</td>
                <td>{measure.update.totalTimeSpentMs}</td>
              </tr>
              <tr>
                <td>Render (ms)</td>
                <td>{measure.render.totalTimeSpentMs}</td>
              </tr>
              <tr>
                <td>Unmount (ms)</td>
                <td>{measure.unmount.totalTimeSpentMs}</td>
              </tr>
              <tr>
                <td>componentWillMount (ms)</td>
                <td>{measure.componentWillMount.totalTimeSpentMs}</td>
              </tr>
              <tr>
                <td>componentDidMount (ms)</td>
                <td>{measure.componentDidMount.totalTimeSpentMs}</td>
              </tr>
              <tr>
                <td>componentWillReceiveProps (ms)</td>
                <td>{measure.componentWillReceiveProps.totalTimeSpentMs}</td>
              </tr>
              <tr>
                <td>shouldComponentUpdate (ms)</td>
                <td>{measure.shouldComponentUpdate.totalTimeSpentMs}</td>
              </tr>
              <tr>
                <td>componentWillUpdate (ms)</td>
                <td>{measure.componentWillUpdate.totalTimeSpentMs}</td>
              </tr>
              <tr>
                <td>componentDidUpdate (ms)</td>
                <td>{measure.componentDidUpdate.totalTimeSpentMs}</td>
              </tr>
              <tr>
                <td>componentWillUnmount (ms)</td>
                <td>{measure.componentWillUnmount.totalTimeSpentMs}</td>
              </tr>
            </table>
          </div>
        )
      })}
    </React.Fragment>
  )
}

module.exports = Measures
