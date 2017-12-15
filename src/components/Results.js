const React = require('../../extension/dependencies/react')

const getCommitChangesTime = require('../utils/commitChanges')
const {
  getCommitHostEffectsTime,
  getTotalEffects,
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
    lifecycleTime: getTotalTime(getLifecycleTime(measures)).toFixed(2),
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
            marginTop: '20px',
          }}
        >
          Collecting measures...
        </h1>
      ) : (
        <div>
          <h4>Time taken by all the components: {props.totalTime} ms</h4>
          <h4>
            Committing changes took:{' '}
            {getResults(props.rawMeasures).commitChangesTime} ms
          </h4>
          <h4>
            Committing {getResults(props.rawMeasures).totalEffects} host
            effects took: {getResults(props.rawMeasures).hostEffectsTime}{' '}
            ms
          </h4>
          <h4>
            Calling {getResults(props.rawMeasures).totalLifecycleMethods}{' '}
            lifecycle methods took:{' '}
            {getResults(props.rawMeasures).lifecycleTime}
            ms
          </h4>
          <h4>
            Total time:{' '}
            {computeTotalTime(
              props.rawMeasures,
              props.totalTime
            ).toFixed(2)}{' '}
            ms
          </h4>
        </div>
      )}
    </div>
  )
}

module.exports = Results
