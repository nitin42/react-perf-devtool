const { add } = require('./math')

function getTotalTime(store) {
  let totalTime = 0

  for (let measure in store) {
    totalTime = totalTime || 0
    totalTime += add(store[measure].timeSpent)
  }

  return totalTime
}

module.exports = getTotalTime
