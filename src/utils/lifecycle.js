const { add } = require('./math')

// Update the time spent while calling all the lifcycle methods
function updateStore(store, measure) {
  if (measure.name.includes('⚛')) {
    const measureName = measure.name.split('⚛ ').join('')

    if (measureName.includes('Calling Lifecycle Methods')) {
      const totalMethods = Number(measureName.split(":")[1].split(" ")[1])
      if (!store['Calling Lifecycle Methods']) {
        store['Calling Lifecycle Methods'] = {
          timeSpent: [],
          totalMethods: []
        }
      }

      store['Calling Lifecycle Methods'].timeSpent.push(Number((measure.duration).toFixed(2)))
      store['Calling Lifecycle Methods'].totalMethods.push(totalMethods)
    }
  }

  return {}
}

function getLifecycleTime(measures) {
  const store = {}

  for (let measure of measures) {
    updateStore(store, measure)
  }

  return store
}

// Get the total number of lifecycle methods that were called
function getTotalMethods(store) {
  let totalMethods = 0

  for (let measure in store) {
    totalMethods = totalMethods || 0
    totalMethods += add(store[measure].totalMethods)
  }

  return Number(totalMethods.toFixed(2))
}

module.exports = {
  getTotalMethods,
  getLifecycleTime
}
