var React = require('react')

var ComponentTime = require('./ComponentTime')

/**
 This component contains the performance measures of React components in Circular loader .
*/
function Metrics(props) {
  return (
    <React.Fragment>
      <div className="component-progress-container">
        <ul className="ctime">
          {props.measures.map((measure, index) => {
            return (
              <li key={index}>
                <ComponentTime
                  componentname={measure.componentName}
                  percentage={parseInt(measure.percentTimeSpent)}
                  msec={Number(measure.totalTimeSpent.toFixed(2))}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </React.Fragment>
  )
}

module.exports = Metrics
