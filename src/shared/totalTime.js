import { add } from './math'

// Computes the total time of each measure (commit changes, host effects and lifecycle methods)
const getTotalTime = store => {
  let totalTime = 0

  for (const measure in store) {
    totalTime = totalTime || 0
    totalTime += add(store[measure].timeSpent)
  }

  return totalTime
}

export { getTotalTime }
