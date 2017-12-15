const { add } = require('./math')

// Computes the total time of each measure (commit changes, host effects and lifecycle methods)
function getTotalTime(store) {
  let totalTime = 0

  for (let measure in store) {
    totalTime = totalTime || 0
    totalTime += add(store[measure].timeSpent)
  }

  return totalTime
}

module.exports = getTotalTime
