import { getCommitChangesTime } from '../shared/commitChanges'
import {
  getCommitHostEffectsTime,
  getTotalEffects
} from '../shared/hostEffects'
import { getLifecycleTime, getTotalMethods } from '../shared/lifecycle'

import { getTotalTime } from '../shared/totalTime'

// Compute the total time
export function computeTotalTime(measures, componentTotalTime) {
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
export function getResults(measures) {
  return {
    commitChangesTime: Number(
      getTotalTime(getCommitChangesTime(measures)).toFixed(2)
    ),
    totalEffects: Number(getTotalEffects(getCommitHostEffectsTime(measures))),
    hostEffectsTime: Number(
      getTotalTime(getCommitHostEffectsTime(measures)).toFixed(2)
    ),
    totalLifecycleMethods: Number(getTotalMethods(getLifecycleTime(measures))),
    lifecycleTime: Number(getTotalTime(getLifecycleTime(measures)).toFixed(2))
  }
}
