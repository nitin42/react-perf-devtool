const React = require('../../extension/third_party/react')

const getCommitChangesTime = require('../utils/commitChanges')
const {
  getCommitHostEffectsTime,
  getTotalEffects,
} = require('../utils/hostEffects')
const { getLifecycleTime, getTotalMethods } = require('../utils/lifecycle')

const getTotalTime = require('../utils/totalTime')

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

class Results extends React.Component {
  render() {
    return (
      <div>
        {this.props.loading ? (
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
            <h4>Time taken by all the components: {this.props.totalTime} ms</h4>
            <h4>
              Committing changes took:{' '}
              {getResults(this.props.rawMeasures).commitChangesTime} ms
            </h4>
            <h4>
              Committing {getResults(this.props.rawMeasures).totalEffects} host
              effects took: {getResults(this.props.rawMeasures).hostEffectsTime}{' '}
              ms
            </h4>
            <h4>
              Calling {getResults(this.props.rawMeasures).totalLifecycleMethods}{' '}
              lifecycle methods took:{' '}
              {getResults(this.props.rawMeasures).lifecycleTime}
              ms
            </h4>
            <h4>
              Total time:{' '}
              {computeTotalTime(
                this.props.rawMeasures,
                this.props.totalTime
              ).toFixed(2)}{' '}
              ms
            </h4>
          </div>
        )}
      </div>
    )
  }
}

module.exports = Results
