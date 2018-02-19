import React from 'react'

import { getCommitChangesTime } from '../../shared/commitChanges'
import {
  getCommitHostEffectsTime,
  getTotalEffects
} from '../../shared/hostEffects'
import { getLifecycleTime, getTotalMethods } from '../../shared/lifecycle'

import { getTotalTime } from '../../shared/totalTime'

const theme = require('../theme')

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

function show(props) {
  const totalEffects = getResults(props.rawMeasures).totalEffects
  const hostEffects = getResults(props.rawMeasures).hostEffectsTime
  const commitChanges = getResults(props.rawMeasures).commitChangesTime
  const totalLifecycleMethods = getResults(props.rawMeasures)
    .totalLifecycleMethods
  const lifecycleTime = getResults(props.rawMeasures).lifecycleTime
  const totalTime = computeTotalTime(
    props.rawMeasures,
    props.totalTime
  ).toFixed(2)

  return (
    <table style={theme === 'dark' ? { color: '#eff1f4' } : null}>
      <tr>
        <td>Time taken by all the components</td>
        <td>
          <strong>{props.totalTime} ms</strong>
        </td>
      </tr>
      <tr>
        <td>Committing changes took</td>
        <td>
          <strong>{commitChanges} ms</strong>
        </td>
      </tr>
      <tr>
        <td>
          Committing <strong> {totalEffects} </strong> host
          {totalEffects === 1 ? ' effect' : ' effects'} took
        </td>
        <td>
          <strong>{hostEffects} ms</strong>
        </td>
      </tr>
      <tr>
        <td>
          Calling <strong> {totalLifecycleMethods} </strong> lifecycle{' '}
          {totalLifecycleMethods === 1 ? 'method' : 'methods'} took
        </td>
        <td>
          <strong>{lifecycleTime} ms</strong>
        </td>
      </tr>
      <tr>
        <td>Total time</td>
        <td>
          {' '}
          <strong>{totalTime} ms</strong>
        </td>
      </tr>
    </table>
  )
}

/**
 This component renders the total time taken combining all the phases of a component,
 committing the changes, host effects and calling all the lifecycle methods.
*/
export function Results(props) {
  return (
    <div className="container result">
      <h1 className="results">Results</h1>
      {props.rawMeasures.length !== 0 ? show(props) : null}
    </div>
  )
}
