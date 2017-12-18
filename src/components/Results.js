const React = require('react')

const getCommitChangesTime = require('../utils/commitChanges')
const {
  getCommitHostEffectsTime,
  getTotalEffects
} = require('../utils/hostEffects')
const { getLifecycleTime, getTotalMethods } = require('../utils/lifecycle')

const getTotalTime = require('../utils/totalTime')

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
    <div>
      {props.loading ? (
        <h1
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px'
          }}
        >
          Collecting measures...
        </h1>
      ) : (
        <div>
          <p>
            Time taken by all the components:{' '}
            <strong>{props.totalTime} ms</strong>
          </p>
          <p>
            Committing changes took:{' '}
            <strong>
              {getResults(props.rawMeasures).commitChangesTime} ms
            </strong>
          </p>
          <p>
            Committing{' '}
            <strong>{getResults(props.rawMeasures).totalEffects}</strong> host
            effects took:{' '}
            <strong>{getResults(props.rawMeasures).hostEffectsTime} ms</strong>
          </p>
          <p>
            Calling{' '}
            <strong>
              {getResults(props.rawMeasures).totalLifecycleMethods}
            </strong>{' '}
            lifecycle methods took:{' '}
            <strong>{getResults(props.rawMeasures).lifecycleTime} ms</strong>
          </p>
          <p>
            Total time:{' '}
            <strong>
              {computeTotalTime(props.rawMeasures, props.totalTime).toFixed(2)}{' '}
              ms
            </strong>
          </p>
        </div>
      )}
    </div>
  )
}

module.exports = Results
