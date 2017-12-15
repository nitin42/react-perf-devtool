const { add } = require('./math')

// Update the store with the time spent while committing the changes
function updateStore(store, measure, delimiter) {
  if (measure.name.includes(delimiter)) {
    const measureName = measure.name.split(delimiter).join('')

    if (measureName.includes('(Committing Changes)')) {
      if (!store['Committing Changes']) {
        store['Committing Changes'] = {
          timeSpent: [],
        }
      }

      store['Committing Changes'].timeSpent.push(Number((measure.duration).toFixed(2)))
    }
  }
}

function getCommitChangesTime(measures) {
  const store = {}

  for (let measure of measures) {
    updateStore(store, measure, '⚛')
    updateStore(store, measure, '⛔')
  }

  return store
}

module.exports = getCommitChangesTime
