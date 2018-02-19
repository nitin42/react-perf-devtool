import { add } from './math'

// Update the store with the time spent while committing host effects
const updateStore = (store, measure) => {
  if (measure.name.includes('⚛')) {
    const measureName = measure.name.split('⚛ ').join('')

    if (measureName.includes('Committing Host Effects')) {
      var totalEffects = Number(measureName.split(':')[1].split(' ')[1])
      if (!store['Committing Host Effects']) {
        store['Committing Host Effects'] = {
          timeSpent: [],
          totalEffects: []
        }
      }

      store['Committing Host Effects'].timeSpent.push(
        Number(measure.duration.toFixed(2))
      )
      store['Committing Host Effects'].totalEffects.push(totalEffects)
    }
  }

  return {}
}

const getCommitHostEffectsTime = measures => {
  let store = {}

  for (const measure of measures) {
    updateStore(store, measure)
  }

  return store
}

// Get total number of host effects
const getTotalEffects = store => {
  let totalEffects = 0

  for (const measure in store) {
    totalEffects = totalEffects || 0
    totalEffects += add(store[measure].totalEffects)
  }

  return Number(totalEffects.toFixed(2))
}

export { getTotalEffects, getCommitHostEffectsTime }
