import { add } from './math'

// Update the store with the time spent while committing the changes
const updateStore = (store, measure, delimiter) => {
  if (measure.name.includes(delimiter)) {
    const measureName = measure.name.split(delimiter).join('')

    if (measureName.includes('(Committing Changes)')) {
      if (!store['Committing Changes']) {
        store['Committing Changes'] = {
          timeSpent: []
        }
      }

      store['Committing Changes'].timeSpent.push(
        Number(measure.duration.toFixed(2))
      )
    }
  }
}

const getCommitChangesTime = measures => {
  let store = {}

  for (const measure of measures) {
    updateStore(store, measure, '⚛')
    updateStore(store, measure, '⛔')
  }

  return store
}

export { getCommitChangesTime }
