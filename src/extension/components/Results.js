var React = require('react')

var getCommitChangesTime = require('../../shared/commitChanges')
var {
  getCommitHostEffectsTime,
  getTotalEffects
} = require('../../shared/hostEffects')
var { getLifecycleTime, getTotalMethods } = require('../../shared/lifecycle')

var getTotalTime = require('../../shared/totalTime')

// Compute the total time
function computeTotalTime(measures, componentTotalTime) {
  let total = 0

  {
    total = total || 0
    total += getTotalTime(getCommitChangesTime(measures))
    total += getTotalTime(getCommitHostEffectsTime(measures))
    total += getTotalTime(getLifecycleTime(measures))
    total += Number(componentTotalTime)
  }

  return total
}

// Compute the results (host effects, lifecycle and committing change time)
function getResults(measures) {
  return {
    commitChangesTime: getTotalTime(getCommitChangesTime(measures)).toFixed(2),
    totalEffects: getTotalEffects(getCommitHostEffectsTime(measures)),
    hostEffectsTime: getTotalTime(getCommitHostEffectsTime(measures)).toFixed(
      2
    ),
    totalLifecycleMethods: getTotalMethods(getLifecycleTime(measures)),
    lifecycleTime: getTotalTime(getLifecycleTime(measures)).toFixed(2)
  }
}

/**
 This component renders the total time taken combining all the phases of a component,
 committing the changes, host effects and calling all the lifecycle methods.
*/
function Results(props) {
  return (
    <div className="container result">
      <h3>Result</h3>
      <table>
        <tr>
          <td>Time taken by all the components</td>
          <td>
            <strong>{props.totalTime} ms</strong>
          </td>
        </tr>
        <tr>
          <td>Committing changes took</td>
          <td>
            <strong>
              {getResults(props.rawMeasures).commitChangesTime} ms
            </strong>
          </td>
        </tr>
        <tr>
          <td>
            Committing{' '}
            <strong> {getResults(props.rawMeasures).totalEffects} </strong> host
            effects took
          </td>
          <td>
            <strong>{getResults(props.rawMeasures).hostEffectsTime} ms</strong>
          </td>
        </tr>
        <tr>
          <td>
            Calling{' '}
            <strong>
              {' '}
              {getResults(props.rawMeasures).totalLifecycleMethods}{' '}
            </strong>{' '}
            lifecycle methods took
          </td>
          <td>
            <strong>{getResults(props.rawMeasures).lifecycleTime} ms</strong>
          </td>
        </tr>
        <tr>
          <td>Total time</td>
          <td>
            {' '}
            <strong>
              {computeTotalTime(props.rawMeasures, props.totalTime).toFixed(2)}{' '}
              ms
            </strong>
          </td>
        </tr>
      </table>
    </div>
  )
}

module.exports = Results
